// const repl = require( "repl" );
const express      = require( "express" );
const favicon      = require( "express-favicon" );
const path         = require( "path" );
const http         = require( "http" );
const sha256       = require( "sha256" );
const WebSocket    = require( "ws" ); // jshint ignore:line
const { shutdown }      = require( "./shutdown" );
const { log }           = require( "./log" );
// const { validateInput } = require( "./validateInput" );

const serverPort          = process.env.PORT                  || 3000;
const userPasswordHash    = process.env.USER_PASSWORD_HASH    || "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
const printerPasswordHash = process.env.PRINTER_PASSWORD_HASH || "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

console.log( "serverPort: ", serverPort );
console.log( "userPasswordHash: ", userPasswordHash );
console.log( "printerPasswordHash: ", printerPasswordHash );

// const history = [];
let filePrintingInfo = {
    isPrintingActive: false
};
const secondsForHeatingExtruder = 300;
let isPrinterConnected = false;
let printingStatusNotificationTimeout;

const staticBuildDir = express.static( path.join( __dirname, "build" ) );
const app = express();
app.use( favicon( path.join( __dirname, "build", "favicon.ico" ) ) );
app.use( "/", staticBuildDir );
app.use( "/login/", staticBuildDir );
app.use( "/admin/terminal/", staticBuildDir );
app.use( "/admin/axesControl/", staticBuildDir );
app.use( "/admin/heatObserver/", staticBuildDir );
app.use( "/admin/loadSlicedModel/", staticBuildDir );
app.get( "*", ( request, response ) => {
    response.redirect( "/" );
} );

const httpServer = http.createServer( app );
const webSocketServer = new WebSocket.Server( { server: httpServer } );
// @ts-ignore
httpServer.listen( serverPort, function() {
    log( "http and websocket server is listening" );
} );

function broadcast( body, filter = c => true ) {
    webSocketServer.clients.forEach( client =>
        filter( client ) && client.send( JSON.stringify( body ) )
    );
}
const sendToAuthorized = body => broadcast( body, client => client.isUser || client.isPrinter );
const sendToUsers      = body => broadcast( body, client => client.isUser );
const sendToPrinters   = body => broadcast( body, client => client.isPrinter );

function allMessagesHandler( data, connection ) {
    switch ( data.event ) {
        case "sendGCommand": {
            if( !connection.isUser ) return;
            sendToAuthorized( {
                event: "clientSendedGCommand",
                command: data.command,
                time: Date.now()
            } );
            break;
        }
        case "sendGCodeFile": {
            if( !connection.isUser ) return;
            sendToUsers( {
                event: "clientSendedGCodeFile",
                preview: data.preview,
                time: Date.now()
            } );
            // @ts-ignore
            filePrintingInfo = {
                isPrintingActive: true,
                secondsCost: data.secondsCost + secondsForHeatingExtruder,
                gCodeFileName: data.gCodeFileName,
                startTime: Date.now(),
                finishTime: Date.now() + ( data.secondsCost + secondsForHeatingExtruder ) * 1000,
            };
            sendToUsers( {
                event: "modelPrintingStatus",
                ...filePrintingInfo
            } );
            clearTimeout( printingStatusNotificationTimeout );

            printingStatusNotificationTimeout = setTimeout( () => {
                filePrintingInfo = {
                    isPrintingActive: false
                };
                sendToUsers( {
                    event: "modelPrintingStatus",
                    ...filePrintingInfo
                } );
            }, filePrintingInfo.secondsCost * 1000 + 300000 );
            sendToPrinters( {
                event: "clientSendedGCodeFile",
                gCodeFileContent: data.gCodeFileContent,
                gCodeFileName: data.gCodeFileName
            } );
            break;
        }
        case "sendLine": {
            if( !connection.isPrinter ) return;
            sendToUsers( {
                event: "printerSendedLine",
                line: data.line,
                time: Date.now(),
                id: "" + Date.now() + process.hrtime()[ 1 ]
            } );
            break;
        }
        case "raspberryup": {
            if( sha256( data.password ) === printerPasswordHash ) {
                connection.isPrinter = true;
                isPrinterConnected = true;
                sendToUsers( {
                    event: "printerState",
                    isPrinterConnected,
                    time: Date.now()
                } );
            }
            break;
        }
        case "userauth": {
            const isPasswordCorrect = sha256( data.password ) === userPasswordHash;
            connection.send( JSON.stringify( {
                event: "loginReply",
                report: {
                    isError: !isPasswordCorrect,
                    info: isPasswordCorrect ? "" : "Неверный пароль",
                },
                reply: {
                    password: data.password,
                },
            } ) );
            if( !isPasswordCorrect ) return;
            connection.isUser = true;
            connection.send( JSON.stringify( {
                event: "modelPrintingStatus",
                ...filePrintingInfo
            } ) );
            connection.send( JSON.stringify( {
                event: "printerState",
                isPrinterConnected,
                time: Date.now()
            } ) );
            break;
        }
        default:
            break;
    }
}

webSocketServer.on( "connection", ( connection, request ) => {
    connection.isAlive = true;
    connection.on( "pong", () => {
        connection.isAlive = true;
    } );
    connection.on( "close", () => {
        if ( !connection.isPrinter ) return;
        isPrinterConnected = false;
        sendToUsers( {
            event: "printerState",
            isPrinterConnected,
            time: Date.now()
        } );
    } );
    connection.addListener( "message", async function ( input ) {
        // TODO: Вообще по хорошему ещё бы валидацию входящих запросов накинуть, но пофиг
        // Я JSON.parse даже в trycatch не буду оборачивать ибо пофиг
        // Сделаем допущение так сказать, что пользователь не будет пускать свои руки глубже, чем ему позволяет мой интерфейс.
        // Аппаратные ошибки можно смело исключить ибо высокий уровень абстракции позволяет
        console.log( "JSON.parse( input.toString() ): ", JSON.parse( input.toString() ) );
        allMessagesHandler(
            JSON.parse( input.toString() ),
            connection
        );
        // const { isOK, info, body } = validateInput( input );
    } );
} );

const deadWebSocketConnectionsCleaner = setInterval( () => {
    // Проверка на то, оставлять ли соединение активным
    webSocketServer.clients.forEach( connection => {
        // Если соединение мертво, завершить
        if ( !connection.isAlive ) {
            return connection.terminate();
        }
        // обьявить все соединения мертвыми, а тех кто откликнется на ping, сделать живыми
        connection.isAlive = false;
        connection.ping( null, false );
    } );
}, 10000 );
[ "SIGHUP", "SIGINT", "SIGQUIT", "SIGTERM" ].forEach(
    sig => process.on(
        sig,
        shutdown( deadWebSocketConnectionsCleaner, webSocketServer, httpServer )
    )
);

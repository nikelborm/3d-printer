// import repl from "repl";
import express from "express";
import favicon from "express-favicon";
import path from "path";
import http from "http";
import sha256 from "sha256";
import ws from "ws";
import { shutdown } from "./shutdown.js";
import { log } from "./log.js";
import { reportAuthStatus } from "./reportAuthStatus.js";
import { sendAccessDeniedMessage } from "./sendAccessDeniedMessage.js";
import compression from "compression";
// import { validateInput } from "./validateInput";

const __dirname = path.resolve();

const staticBuildDir = express.static( path.join( __dirname, "build" ) );

const secsToHeatExtruder  = process.env.SECS_TO_HEAT_EXTRUDER || 300;
const serverPort          = process.env.PORT                  || 3000;
const userPasswordHash    = process.env.USER_PASSWORD_HASH    || "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
const printerPasswordHash = process.env.PRINTER_PASSWORD_HASH || "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

console.log( "serverPort: ", serverPort );
console.log( "userPasswordHash: ", userPasswordHash );
console.log( "printerPasswordHash: ", printerPasswordHash );
console.log( "secsToHeatExtruder: ", secsToHeatExtruder );
console.log( "__dirname: ", __dirname );

// const history = [];
let filePrintingInfo = {
    isPrintingActive: false,
};

let isPrinterConnected = false;
let printingStatusNotificationTimeout;

const app = express();

app.use( favicon( path.join( __dirname, "build", "favicon.ico" ) ) );
app.use( compression() );

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
const webSocketServer = new ws.Server( { server: httpServer } );
// @ts-ignore
httpServer.listen( serverPort, function() {
    log( "http and websocket server is listening" );
} );

function broadcast( body, filter = c => true ) {
    webSocketServer.clients.forEach(
        client => filter( client ) && client.send( JSON.stringify( body ) )
    );
}
const sendToAuthorized = body => broadcast( body, client => client.isUser || client.isPrinter );
const sendToUsers      = body => broadcast( body, client => client.isUser );
const sendToPrinters   = body => broadcast( body, client => client.isPrinter );

function allMessagesHandler( data, connection ) {
    switch ( data.event ) {
        case "sendGCommand": {
            if( !connection.isUser ) return sendAccessDeniedMessage( connection, data.event );
            sendToAuthorized( {
                event: "clientSendedGCommand",
                command: data.command,
                time: Date.now(),
            } );
            break;
        }
        case "sendGCodeFile": {
            if( !connection.isUser ) return sendAccessDeniedMessage( connection, data.event );
            sendToUsers( {
                event: "clientSendedGCodeFile",
                preview: data.preview,
                time: Date.now(),
            } );
            // @ts-ignore
            filePrintingInfo = {
                isPrintingActive: true,
                secondsCost: data.secondsCost + secsToHeatExtruder,
                gCodeFileName: data.gCodeFileName,
                startTime: Date.now(),
                finishTime: Date.now() + ( data.secondsCost + secsToHeatExtruder ) * 1000,
            };
            sendToUsers( {
                event: "modelPrintingStatusWasChanged",
                ...filePrintingInfo,
            } );
            clearTimeout( printingStatusNotificationTimeout );

            printingStatusNotificationTimeout = setTimeout( () => {
                filePrintingInfo = {
                    isPrintingActive: false,
                };
                sendToUsers( {
                    event: "modelPrintingStatusWasChanged",
                    ...filePrintingInfo,
                } );
            }, filePrintingInfo.secondsCost * 1000 + 300000 );
            /* + 300 дополнительных секунд, при которых на сайте ещё будет показываться уведомление, даже если печать завершена */
            sendToPrinters( {
                event: "clientSendedGCodeFile",
                gCodeFileContent: data.gCodeFileContent,
                gCodeFileName: data.gCodeFileName,
            } );
            break;
        }
        case "sendLine": {
            if( !connection.isPrinter ) return sendAccessDeniedMessage( connection, data.event );
            sendToUsers( {
                event: "printerSendedLine",
                line: data.line,
                id: data.id,
                time: Date.now(),
            } );
            break;
        }
        case "printerAuth": {
            const isPasswordCorrect = sha256( data.password ) === printerPasswordHash;
            reportAuthStatus( connection, isPasswordCorrect, data.password, data.event );
            if( !isPasswordCorrect ) return;
            connection.isPrinter = true;
            isPrinterConnected = true;
            sendToUsers( {
                event: "printerState",
                isPrinterConnected,
                time: Date.now(),
            } );
            break;
        }
        case "userAuth": {
            const isPasswordCorrect = sha256( data.password ) === userPasswordHash;
            reportAuthStatus( connection, isPasswordCorrect, data.password, data.event );
            if( !isPasswordCorrect ) return;
            connection.isUser = true;
            connection.send(
                JSON.stringify( {
                    event: "modelPrintingStatusWasChanged",
                    ...filePrintingInfo,
                } )
            );
            connection.send(
                JSON.stringify( {
                    event: "printerState",
                    isPrinterConnected,
                    time: Date.now(),
                } )
            );
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
            time: Date.now(),
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

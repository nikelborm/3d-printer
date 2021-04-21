// const repl = require( "repl" );
const Readline      = require( "@serialport/parser-readline" );
const child_process = require( "child_process" );
const SerialPort    = require( "serialport" );
const minimist      = require( "minimist" );
const { shutdown }  = require( "./shutdown" );
const { log }       = require( "./log" );
const { SelfHealingWebSocket } = require( "./SelfHealingWebSocket" );
const {
    writeFile,
    readdir
} = require( "fs/promises" );
const { promisify } = require( "util" );

function randomString( len ) {
    const chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let str = "";
    for ( let i = 0; i < len; i++ ) {
        str += chrs[ Math.floor( Math.random() * chrs.length ) ];
    }
    return str;
}

const exec = promisify( child_process.exec );
const timeout = ms => new Promise( resolve => setTimeout( () => resolve(), ms ) );
// m22 release
function downWatcher() {

}
function upWatcher() {
    wsConnectionToServer.send( {
        event: "printerAuth",
        password,
    } );
}

async function messageParser( data ) {
    switch ( data.event ) {
        case "clientSendedGCommand": {
            serialPort.write( data.command + "\n" );
            break;
        }
        case "clientSendedGCodeFile": {
            try {
                serialPort.write( "M22\n" );
                await timeout( 15 );
                const {
                    stdout: mountout,
                    stderr: mounterr
                } = await exec( "/bin/mount '/dev/sda1'" );
                console.log( "mounterr: ", mounterr );
                console.log( "mountout: ", mountout );
                const filenamePrefix = randomString( 6 );
                const dos8dot3filename = filenamePrefix + "~1.GCO";
                const realFileName = filenamePrefix + data.gCodeFileName;
                await writeFile( "/mnt/flashcard/" + realFileName, data.gCodeFileContent );

                const {
                    stdout: umountout,
                    stderr: umounterr
                } = await exec( "/bin/umount '/dev/sda1'" );
                console.log( "umounterr: ", umounterr );
                console.log( "umountout: ", umountout );
                serialPort.write( "M21\nM23 " + dos8dot3filename + "\nM24\n" );
            } catch ( error ) {
                console.log( "error: ", error );
                wsConnectionToServer.send( {
                    event: "errorOnFileUpload",
                    errorMessage: error.message,
                    errorName: error.name,
                    time: Date.now()
                } );
            }
            break;
        }
        case "getTTYPorts": {
            try {
                const items = await readdir( "/dev" );
                wsConnectionToServer.send( {
                    event: "returnedTTYPorts",
                    ttys: items
                        .filter( item => item.includes( "tty" ) )
                        .map( tty => "/dev/" + tty ),
                    time: Date.now()
                } );
            } catch ( error ) {
                console.log("error: ", error);
            }
            break;
        }
        case "setTTYPort": {
            break;
        }
        default:
            break;
    }
}

const procArgs = minimist( process.argv.slice( 2 ), {
    default: {
        serialAdress: "/dev/ttyACM0",
        webSocketServerAdress: "wss://hello-printy-3d.herokuapp.com/",
        baudRate: 115200,
        password: "hello",
    },
    alias: {
        srl: "serialAdress",
        srv: "webSocketServerAdress",
        br: "baudRate",
        pwd: "password",
    }
} );

const serialAdress          = process.env.SERIAL_ADRESS            || procArgs.serialAdress;
const webSocketServerAdress = process.env.WEB_SOCKET_SERVER_ADRESS || procArgs.webSocketServerAdress;
const baudRate              = process.env.SERIAL_BAUD_RATE         || procArgs.baudRate;
const password              = process.env.PASSWORD                 || procArgs.password;

console.log( "password: ", password );
console.log( "serialAdress: ", serialAdress );
console.log( "serverAdress: ", webSocketServerAdress );
console.log( "baudRate: ", baudRate );

const history = [];

const serialPort = new SerialPort( serialAdress, {
    baudRate
} );

const readlineParser = new Readline( { delimiter: "\n" } );
let wsConnectionToServer;
// @ts-ignore
serialPort.addListener( "open", () => {
    log( "Port opened" );
    wsConnectionToServer = new SelfHealingWebSocket( downWatcher, upWatcher, messageParser, webSocketServerAdress );
    // @ts-ignore
    serialPort.pipe( readlineParser );
} );

readlineParser.addListener( "data", line => {
    log( "readlineParser data Listener: ", line );
    wsConnectionToServer.send( {
        event: "sendLine",
        line,
        id: "" + Date.now() + process.hrtime()[ 1 ],
    } );
} );

// @ts-ignore
serialPort.addListener( "error", error => {
    log( "Error on port: ", error );
    wsConnectionToServer.send( {
        event: "errorOnSerial",
        errorMessage: error.message,
        errorName: error.name,
        time: Date.now()
    } );
    if ( error ) throw error;
} );

// @ts-ignore
serialPort.addListener( "close", () => {
    wsConnectionToServer.send( {
        event: "serialClosed",
        time: Date.now()
    } );
    log( "Serial port closed" );
    process.exit( 1 );
} );

process.on( "SIGTERM", shutdown( wsConnectionToServer, serialPort ) );
process.on( "SIGINT",  shutdown( wsConnectionToServer, serialPort ) );

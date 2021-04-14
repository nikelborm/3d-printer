const { log } = require( "./log" );

const shutdown = ( ws, serialPort ) => () => {
    serialPort.close( err => {
        if ( err ) log( err );
        console.log( "Serial port closed." );
        process.exit( ~~err );
    } );
}

exports.shutdown = shutdown;

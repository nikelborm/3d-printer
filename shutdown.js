const { log } = require( "./log" );

const shutdown = ( cleaner, webSocketServer, httpsServer ) => () => {
    let haveErrors = false;
    console.log( "Exiting...\n\nClearing interval with cleaner of websocket connections..." );
    clearInterval( cleaner );
    console.log( "Interval cleared.\n\n" );
    if ( httpsServer.listening ) {
        console.log( "Closing WebSocket server..." );
        webSocketServer.close( err => {
            if ( err ) { log( err ); haveErrors = true; }
            console.log( "WebSocket server closed.\n\nClosing http server..." );
            httpsServer.close( err => {
                if ( err ) { log( err ); haveErrors = true; }
                console.log( "Http server closed." );
                process.exit( ~~haveErrors );
            } );
        } );
    } else {
        console.log( "Http Server is not listening.\n\nWebSocket Server is not listening.\n\n" );
        process.exit( 1 );
    }
}

exports.shutdown = shutdown;

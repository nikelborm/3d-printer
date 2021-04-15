export const log = ( ...args ) => {
    if ( args.length ) {
        console.log( Date() + " - ", ...args );
    } else {
        console.log();
    }
};

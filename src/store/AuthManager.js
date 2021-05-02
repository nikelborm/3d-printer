import { AppWSChannel } from "../AppWSChannel";
import { AuthManager } from "../model/AuthManager";

export const AuthInfoStore = new AuthManager();

export const login = password => {
    if ( AuthInfoStore.isAuthInProcess ) return;
    AppWSChannel.send( {
        event: "userAuth",
        password,
    } );
    AuthInfoStore.startAuthProcess();
};

AppWSChannel.addEventListener( "open", () => {
    if ( AuthInfoStore.amIAuthorized ) login( AuthInfoStore.storedPassword );
} );

AppWSChannel.addMessageListener( data => {
    if ( data.event !== "userAuthReply" ) return;
    AuthInfoStore.finishAuthProcess();
    if ( data.report.isError ) {
        alert( data.report.errorField + "   " + data.report.info );
    } else {
        AuthInfoStore.savePassword( data.reply.password );
    }
} );

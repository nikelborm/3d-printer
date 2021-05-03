import { action } from "mobx";
import { AuthInfoStore, login } from "../store/AuthManager";

export const connectWSHandlersFromAuthInfoStore = AppWSChannel => {
    AppWSChannel.addEventListener( "open", action( () => {
        if ( AuthInfoStore.amIAuthorized ) login( AuthInfoStore.storedPassword );
    } ) );

    AppWSChannel.addMessageListener( action( data => {
        if ( data.event !== "userAuthReply" ) return;
        AuthInfoStore.finishAuthProcess();
        if ( data.report.isError ) {
            alert( data.report.errorField + "   " + data.report.info );
        } else {
            AuthInfoStore.savePassword( data.reply.password );
        }
    } ) );
}

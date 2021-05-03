import { action } from "mobx";
import { AppWSChannel } from "../AppWSChannel";
import { AuthManager } from "../model/AuthManager";

export const AuthInfoStore = new AuthManager();
console.log("AuthInfoStore: ", AuthInfoStore);

export const login = action( password => {
    if ( AuthInfoStore.isAuthInProcess ) return;
    AppWSChannel.send( {
        event: "userAuth",
        password,
    } );
    AuthInfoStore.startAuthProcess();
} );

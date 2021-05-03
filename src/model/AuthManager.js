import { action, observable, computed, makeObservable } from "mobx";

export class AuthManager {
    constructor(){
        makeObservable( this );
    }
    @observable isAuthInProcess = false;
    @observable storedPassword = sessionStorage.getItem( "savedPassword" ) ?? "";

    @computed get amIAuthorized() {
        return !!this.storedPassword;
    }
    @action startAuthProcess = () => {
        this.isAuthInProcess = true;
    };
    @action finishAuthProcess = () => {
        this.isAuthInProcess = false;
    };
    @action savePassword = password => {
        sessionStorage.setItem( "savedPassword", password );
        this.storedPassword = password;
    };
}

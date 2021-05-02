import { action, observable, computed } from "mobx";

export class AuthManager {
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

export class SelfHealingWebSocket {
    constructor( url, protocols ) {
        this.#url = url;
        this.#protocols = protocols;
    }
    #url;
    #protocols;
    connection = null;
    isInitialized = false;
    isRestartOnClosingEnabled = true;
    #openingHandler = event => {
        console.log( "[open] Соединение установлено. Отчёт: ", event );
    };
    #closingHandler = event => {
        console.log( "[close] Соединение закрыто. Отчёт: ", event );
        this.isRestartOnClosingEnabled && setTimeout( this.#respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    #messageReporter = event => {
        console.log( "[message] Сервер отправил сообщение. Отчёт: ", event );
        console.log( "[message] Данные: ", event.data );
    };
    #messageHandlerBuilder = messageHandler => event => {
        let incomingData;
        try {
            incomingData = JSON.parse( event.data );
        } catch ( error ) {
            this.#errorHandler( error );
            return;
        }
        messageHandler( incomingData );
    };
    #errorHandler = error => {
        console.error( "[error] Ошибка! Отчёт: ", error );
    };
    #eventListenersStore = [
        [ "open", this.#openingHandler, this.#openingHandler ], // name, raw, wrapped
        [ "error", this.#errorHandler, this.#errorHandler ],
        [ "message", this.#messageReporter, this.#messageReporter ],
        [ "close", this.#closingHandler, this.#closingHandler ],
    ];
    #connectEventHandlers = () => {
        console.log("#eventListenersStore: ", this.#eventListenersStore);
        for ( const [ eventName, rawHandler, wrappedHandler ] of this.#eventListenersStore ) {
            this.connection?.addEventListener( eventName, wrappedHandler || rawHandler );
        }
    };
    #respawnWebSocket = () => {
        this.connection = null;
        this.connection = new WebSocket( this.#url, this.#protocols );
        this.#connectEventHandlers();
    };
    addEventListener = ( eventName, rawHandler, wrappedHandler ) => {
        this.#eventListenersStore.push( [ eventName, rawHandler, wrappedHandler || rawHandler ] );
        this.connection?.addEventListener( eventName, wrappedHandler || rawHandler );
    };
    removeEventListener = ( eventNameParam, rawHandlerParam ) => {
        const indexOfEventHandlerToDelete = this.#eventListenersStore.findIndex(
            ( [ eventName, rawHandler ] ) => eventName === eventNameParam && rawHandler === rawHandlerParam
        );
        if ( indexOfEventHandlerToDelete === -1 ) return;
        const [ [ eventName, rawHandler, wrappedHandler ] ] = this.#eventListenersStore.splice( indexOfEventHandlerToDelete, 1 );
        this.connection?.removeEventListener( eventName, wrappedHandler || rawHandler );
    };
    addMessageListener = rawHandler => {
        this.addEventListener(
            "message",
            rawHandler,
            this.#messageHandlerBuilder( rawHandler )
        );
    };
    removeMessageListener = rawHandler => {
        this.removeEventListener(
            "message",
            rawHandler
        );
    };
    finish = () => {
        this.isRestartOnClosingEnabled = false;
        this.connection?.close();
    };
    start = () => {
        this.isInitialized = true;
        this.#respawnWebSocket();
    };
    isAvailable = () => this.connection?.readyState === 1;
    sendRaw = data => {
        console.log( "[sendRaw] Данные: ", data );
        if( this.isAvailable() ) {
            this.connection?.send( data );
        } else {
            console.log( "[error] Соединение с сервером не установлено." );
        }
    };
    send = data => this.sendRaw( JSON.stringify( data ) );
}

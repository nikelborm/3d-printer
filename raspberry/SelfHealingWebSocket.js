const WebSocket = require("ws");

class SelfHealingWebSocket
{
    constructor(downCallback, upCallback, allMessagesHandler, ...initializationArgs)
    {
        this._initializationArgs = initializationArgs;
        this.connection = null;
        this._downCallback = downCallback;
        this._upCallback = upCallback;
        this._allMessagesHandler = function ( event )
        {
            const data = JSON.parse( event.data );
            allMessagesHandler( data );
        };
        this.respawnWebSocket();
    }
    _closeEL = event =>
    {
        console.log("[close] Соединение закрыто. Отчёт: "/* , event */);
        this._downCallback();
        setTimeout( this.respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    _errorEL = function (error)
    {
        console.error("[error] Ошибка! Отчёт: ");
        console.log(error);
    };
    _messageEL = event =>
    {
        console.log("[message] Сервер отправил сообщение. Отчёт: "/* , event */);
        try
        {
            const data = JSON.parse(event.data);
            console.log("[message] Данные: ", data);
        } catch (error)
        {
            this._errorEL(error);
        }
    };
    _openEL = event =>
    {
        console.log("[open] Соединение установлено");
        this._upCallback();
    };
    respawnWebSocket = () =>
    {
        this.connection = null;
        // @ts-ignore
        this.connection = new WebSocket(...this._initializationArgs);
        this.connection.addEventListener("error", this._errorEL);
        this.connection.addEventListener("open", this._openEL);
        this.connection.addEventListener("message", this._messageEL);
        this.connection.addEventListener("message", this._allMessagesHandler);
        this.connection.addEventListener("close", this._closeEL);
    };
    isAvailable = () => this.connection?.readyState === 1;
    sendRaw = data =>
    {
        console.log("[sendRaw] Данные: ", data);
        if (this.isAvailable())
        {
            this.connection.send(data);
        } else
        {
            console.log("Соединение с сервером не установлено.");
        }
    };
    send = data => this.sendRaw(JSON.stringify(data));
}

exports.SelfHealingWebSocket = SelfHealingWebSocket;

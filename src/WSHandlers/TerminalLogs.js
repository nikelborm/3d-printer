import { TerminalLogsStore } from "../store/TerminalLogs";

export const connectWSHandlersFromTerminalLogsStore = AppWSChannel => {
    AppWSChannel.addEventListener( "open", () => {
        TerminalLogsStore.addLineIntoTerminalLogs( {
            time: new Date(),
            prefixcontent: "wserver",
            name: "connect-success",
            linecontent: "Соединение с сервером установлено!"
        } );
    } );

    AppWSChannel.addEventListener( "close", () => {
        TerminalLogsStore.addLineIntoTerminalLogs( {
            time: new Date(),
            prefixcontent: "wserver",
            name: "connect-error",
            linecontent: "Соединение с сервером разорвано, переподключение..."
        } );
    } );

    AppWSChannel.addMessageListener( data => {
        switch ( data.event ) {
            case "clientSendedGCommand": {
                TerminalLogsStore.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "client",
                    prefixcontent: "command",
                    linecontent: data.command,
                    id: data.id
                } );
                break;
            }
            case "printerState": {
                TerminalLogsStore.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: data.isPrinterConnected ? "connect-success" : "connect-error",
                    prefixcontent: "printer",
                    linecontent: data.isPrinterConnected ? "Принтер подключён" : "Принтер отключён"
                } );
                break;
            }
            case "clientSendedGCodeFile": {
                TerminalLogsStore.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "client",
                    prefixcontent: "_.gcode",
                    linecontent: data.preview
                } );
                break;
            }
            case "printerSendedLine": {
                TerminalLogsStore.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "printer",
                    prefixcontent: "printer",
                    linecontent: data.line
                } );
                break;
            }
            default: break;
        }
    } );
}

import React, { Component } from "react";
import dayjs from "dayjs";

class SelfHealingWebSocket {
    constructor( downCallback, upCallback, allMessagesHandler, ...initializationArgs ) {
        this.initializationArgs = initializationArgs;
        this.connection = null;
        this.downCallback = downCallback;
        this.upCallback = upCallback;
        this.allMessagesHandler = function ( event ) {
            const data = JSON.parse( event.data );
            allMessagesHandler( data );
        };
        this.respawnWebSocket();
    }
    closeEL = event => {
        console.log( "[close] Соединение закрыто. Отчёт: ", event );
        this.downCallback();
        setTimeout( this.respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    errorEL = function ( error ) {
        console.error( "[error] Ошибка! Отчёт: " );
        console.log( error );
    };
    messageEL = event => {
        console.log( "[message] Сервер отправил сообщение. Отчёт: ", event );
        try {
            const data = JSON.parse( event.data );
            console.log( "[message] Данные: ", data );
        } catch ( error ) {
            this.errorEL( error );
        }
    };
    openEL = event => {
        console.log( "[open] Соединение установлено" );
        this.upCallback();
    };
    respawnWebSocket = () => {
        this.connection = null;
        // @ts-ignore
        this.connection = new WebSocket( ...this.initializationArgs );
        this.connection.addEventListener( "error", this.errorEL );
        this.connection.addEventListener( "open", this.openEL );
        this.connection.addEventListener( "message", this.messageEL );
        this.connection.addEventListener( "message", this.allMessagesHandler );
        this.connection.addEventListener( "close", this.closeEL );
    };
    isAvailable = () => this.connection?.readyState === 1;
    sendRaw = data => {
        console.log( "[sendRaw] Данные: ", data );
        if( this.isAvailable() ) {
            this.connection.send( data );
        } else {
            alert( "Соединение с сервером не установлено." );
        }
    };
    send = data => this.sendRaw( JSON.stringify( data ) );
}
const RegExpForSearchTemperatureLines = /T:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) \/(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) B:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) \/(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) @:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) B@:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,}))/;
const RegExpForSearchNumbers = /([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})/g;
export const GlobalContext = React.createContext( {
    authorizationActions: {
        login: password => {},
        amIAuthorized: () => false,
    },
    userActions: {
        sendGCommand: ( command, isCapitalize ) => {},
        sendGCodeFile: ( gCodeFileContent, gCodeFileName ) => {},
        clearTerminal: () => {},
        closeProgressBar: () => {},
        addTestSampleInTerminal: () => {},
    },
    isPrinterConnected: null,
    isAuthInProcess: false,
    records: {
        realTemperatureOfExtruder: [],
        expectedTemperatureOfExtruder: [],
        realTemperatureOfTable: [],
        expectedTemperatureOfTable: [],
    },
    filePrintingInfo: {
        isPrintingActive: false,
    },
    terminalLogs: [],
} );
function getEmptyRecordsArray( length ) {
    return new Array( length ).fill( void 0 ).map( ( elem, index ) => ( {
        y: NaN,
        x: new Date( Date.now() + ( index - length + 1 ) * 1000 )
    } ) );
}
const adder = ( records, recordType, dateobj, value ) => {
    records[ recordType ] = [ ...records[ recordType ] ];
    const newRecord = {
        x: dateobj,
        y: value,
    }
    const lastItem = records[ recordType ][ records[ recordType ].length - 1 ];
    if ( lastItem && dayjs( newRecord.x ).diff( dayjs( lastItem.x ), "seconds" ) > 5 ) {
        records[ recordType ].push( { y: NaN, x: lastItem.x } );
        records[ recordType ].shift();
    }
    records[ recordType ].push( newRecord );
    records[ recordType ].shift();
}
// Вот вы думаете, что я нахуй не знаю как строятся реакт приложения? Вы блять думаете, что я не в курсе тех лишних ререндеров которые происходят, когда прилетают данные с сервака, вы думаете я не в курсе того что из-за этого ререндярятся даже абсолютно статичные страницы, потому что через контекст я передаю в них функции для отправвки команд на сервер? вы думаете я не в курсе о shouldComponentUpdate или o React.memo? И вы думаете, что я не в курсе того что если происходят изменения в контексте они идут нахуй и игнорируются и единственный способ остановить тяжёлый ререндер - блядский костыль, когда ты контекст передаешь в пропсы и уже внутри дочернего компонента сравниваешь пропсы? Вы думаете я не в курсе того что у нас 100% кода не документировано? Вы думаете я не в курсе того, что ___( что бы вы там не произнесли ). Нет блять я в курсе и мне похуй и я не собираюсь ебаться с этой хуйнёй. У этого проекта не будет продолжения после защит ( хотя себе в резюме я его точно положу ), он умрёт также как умирает первая любовь. Мне блять и так пиздец обидно, что блять как минимум 4 косаря строк кода что я написала коту под хвост из-за того что грёбаный перфекционизм или ещё хуй пойми что мешает мне недоделанный до некой степени минимально живучей хуйни проект показывать. У меня блять просто рука нахуй на это не поднимается. Я блять в своём мессенджере такие нахуй гучи флип флап вытворяю, да вы бы просто охуели с этого, но нет блять Я ебанашка та ещё. Ну похуй, я этот кусок говна на коленке собрала за 10 дней и мне норм. Графики я вообще со своего кода с рэпидфарма пизданула, кусок с авторизацией кстати тоже так что по кайфу, надо расслабиться и чилить. Запасной проект есть и отлично. Хотя это теперь конечно не мой запасной, а уже мой основной блять. Похуй на баллы, похуй на бабки, похуй на рейтинг. Даааа, ага блятьь агаааа дааа нахуй

// И вообще прошу заметить, что всё по законам иммутабельности сделано
const maxTerminalLinesCount = 200;
class GlobalContextBasedOnDataFromWS extends Component {
    state = {
        isAuthInProcess: false,
        isPrinterConnected: null,
        records: {
            realTemperatureOfExtruder:     getEmptyRecordsArray( 300 ),
            expectedTemperatureOfExtruder: getEmptyRecordsArray( 300 ),
            realTemperatureOfTable:        getEmptyRecordsArray( 300 ),
            expectedTemperatureOfTable:    getEmptyRecordsArray( 300 ),
        },
        filePrintingInfo: {
            isPrintingActive: false,
        },
        terminalLogs: [],
    }
    constructor( props ) {
        super( props );
        this.ws = null;
        this.processesBackup = null;
    }
    amIAuthorized = () => !!sessionStorage.getItem( "lastPassword" );
    upWatcher = () => {
        this.addLineIntoTerminalLogs( {
            time: new Date(),
            prefixcontent: "wserver",
            name: "connect-success",
            linecontent: "Соединение с сервером установлено!"
        } );
        if ( this.amIAuthorized() ) {
            this.login( sessionStorage.getItem( "lastPassword" ) );
        }
    };
    downWatcher = () => {
        this.addLineIntoTerminalLogs( {
            time: new Date(),
            prefixcontent: "wserver",
            name: "connect-error",
            linecontent: "Соединение с сервером разорвано, переподключение..."
        } );
        this.setState( {
            isPrinterConnected: null
        } );
    };
    addTestSampleInTerminal = () => {
        const sample = [
            {
                time: new Date(),
                name: "client",
                prefixcontent: "_.gcode",
                linecontent: ";FLAVOR:Marlin ;TIME:100 ;TIME:1593 ;Filament used: 1.58554m ;Layer height: 0.16 ;MINX:95.725 ;MINY:95.725 ;MINZ:0.2 ;MAXX:124.275 ;MAXY:124.275 ;MAXZ:19.88 ;Generated with Cura_SteamEngine 4.8.0 M140 S90 M105 M190 S90 M104 S230 M105 M109 S230 M82 ;absolute extrusion mode G28........"
            }, {
                time: new Date( Date.now() - 11000 ),
                name: "connect-success",
                prefixcontent: "printer",
                linecontent: "Принтер подключён"
            }, {
                time: new Date( Date.now() - 22000 ),
                name: "connect-error",
                prefixcontent: "printer",
                linecontent: "Принтер отключён"
            }, {
                time: new Date( Date.now() - 33000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "ok"
            }, {
                time: new Date( Date.now() - 44000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 55000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 66000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 77000 ),
                name: "client",
                prefixcontent: "command",
                linecontent: "G28"
            }, {
                time: new Date( Date.now() - 88000 ),
                prefixcontent: "wserver",
                name: "connect-success",
                linecontent: "Подключение установлено!"
            }, {
                time: new Date( Date.now() - 99000 ),
                prefixcontent: "wserver",
                name: "connect-error",
                linecontent: "Подключение потеряно, переподключение..."
            }, {
                time: new Date( Date.now() - 110000 ),
                prefixcontent: "wserver",
                name: "connect-error",
                linecontent: "Подключение потеряно, переподключение..."
            }
        ];
        this.setState( ps => ( {
            ...ps,
            terminalLogs: [ ...sample, ...sample, ...ps.terminalLogs ],
        } ) );
    }
    addLineIntoTerminalLogs = lineInfo => this.setState( ps => {
        const terminalLogs = [
            lineInfo,
            ...ps.terminalLogs
        ];
        if ( terminalLogs.length > maxTerminalLinesCount ) terminalLogs.pop();
        return {
            ...ps,
            terminalLogs
        };
    } );
    messageParser = data => {
        switch ( data.event ) {
            case "clientSendedGCommand": {
                this.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "client",
                    prefixcontent: "command",
                    linecontent: data.command
                } );
                break;
            }
            case "printerState": {
                this.setState( {
                    isPrinterConnected : data.isPrinterConnected
                } );
                this.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: data.isPrinterConnected ? "connect-success" : "connect-error",
                    prefixcontent: "printer",
                    linecontent: data.isPrinterConnected ? "Принтер подключён" : "Принтер отключён"
                } );
                break;
            }
            case "clientSendedGCodeFile": {
                this.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "client",
                    prefixcontent: "_.gcode",
                    linecontent: data.preview
                } );
                break;
            }
            case "modelPrintingStatus": {
                this.setState( {
                    filePrintingInfo: {
                        isPrintingActive: data.isPrintingActive,
                        ...( data.isPrintingActive
                            ? {
                                secondsCost: data.secondsCost,
                                gCodeFileName: data.gCodeFileName,
                                startTime: new Date( data.startTime ),
                                finishTime: new Date( data.finishTime ),
                            }
                            : {}
                        )
                    }
                } );
                break;
            }
            case "printerSendedLine": {
                this.addLineIntoTerminalLogs( {
                    time: new Date( data.time ),
                    name: "printer",
                    prefixcontent: "printer",
                    linecontent: data.line
                } );
                if( RegExpForSearchTemperatureLines.test( data.line ) ) {
                    this.setState( ps => {
                        const records = { ...ps.records };
                        const temps = data.line.match( RegExpForSearchNumbers );
                        const time = new Date( data.time )
                        adder( records, "realTemperatureOfExtruder"    , time, temps[ 0 ] );
                        adder( records, "expectedTemperatureOfExtruder", time, temps[ 1 ] );
                        adder( records, "realTemperatureOfTable"       , time, temps[ 2 ] );
                        adder( records, "expectedTemperatureOfTable"   , time, temps[ 3 ] );
                        return {
                            ...ps,
                            records
                        }
                    } );
                }
                break;
            }
            case "loginReply": {
                this.setState( {
                    isAuthInProcess: false
                } );
                if ( data.report.isError ) {
                    alert( data.report.errorField + "   " + data.report.info );
                    return;
                }
                sessionStorage.setItem( "lastPassword", data.reply.password );
                break;
            }
            case "error": {
                alert( "Ошибка, сообщите программисту этот текст: " + data.message );
                break;
            }
            default:
                alert( "Пришло нечто неожиданное, сообщите программисту этот текст: " + JSON.stringify( data ) );
        }
    };
    login = ( password ) => {
        if ( this.state.isAuthInProcess ) return;
        this.ws.send( {
            event: "userauth",
            password,
        } );
        this.setState( {
            isAuthInProcess: true
        } );
    };
    sendGCommand = ( command, isCapitalize ) => {
        this.ws.send( {
            event: "sendGCommand",
            command: isCapitalize ? command.toUpperCase() : command
        } );
    };
    sendGCodeFile = ( gCodeFileContent, gCodeFileName ) => {
        let preview = gCodeFileContent.slice( 0, 300 );
        preview = preview.length === 300 ? preview + "........" : preview;
        // TODO: подумать как работать с файлами, у которых нет времени
        // например выводить инфу о том что время в файле не предоставлено
        // Подумать над тем что делать с прогресс баром
        // Показывать крестик о закрытии сразу? много кода менять похоже надо
        const secondsCost = parseFloat( gCodeFileContent.match( /time:\s?(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,}))/i )[ 1 ] );
        this.ws.send( {
            event: "sendGCodeFile",
            secondsCost,
            preview,
            gCodeFileName,
            gCodeFileContent,
        } );
    };
    closeProgressBar = () => {
        this.setState( {
            filePrintingInfo: {
                isPrintingActive: false,
            }
        } );
        clearInterval();
    }
    clearTerminal = () => this.setState( {
        terminalLogs: []
    } );
    authorizationActions = {
        login: this.login,
        amIAuthorized: this.amIAuthorized,
    };
    userActions = {
        sendGCommand: this.sendGCommand,
        sendGCodeFile: this.sendGCodeFile,
        clearTerminal: this.clearTerminal,
        closeProgressBar: this.closeProgressBar,
        addTestSampleInTerminal: this.addTestSampleInTerminal,
    };
    componentDidMount() {
        const loc = document.location;
        const protocol = loc.protocol[ 4 ] === "s" ? "wss://" : "ws://";
        const WSAdress = protocol + ( loc.port === "3001" ? loc.hostname + ":3000" : loc.host );
        this.ws = new SelfHealingWebSocket( this.downWatcher, this.upWatcher, this.messageParser, WSAdress );
    }
    render() {
        return (
            <GlobalContext.Provider
                value={ {
                    ...this.state,
                    // @ts-ignore
                    authorizationActions: this.authorizationActions,
                    userActions: this.userActions,
                } }
                children={ this.props.children }
            />
        );
    }
}

export default GlobalContextBasedOnDataFromWS;

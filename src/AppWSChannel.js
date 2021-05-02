import { SelfHealingWebSocket } from "./SelfHealingWebSocket";

const RegExpForSearchLinesWithTime = /time:\s?(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,}))/i;

const { port, hostname, } = document.location;
const protocol = document.location.protocol === "https:" ? "wss://" : "ws://";
const WSAdress = protocol + hostname + ( port === "3001" ? ":3000" : "3001" );

export const AppWSChannel = new SelfHealingWebSocket( WSAdress );

AppWSChannel.addMessageListener( data => {
    if ( data.event !== "error" ) return;
    alert( "Ошибка, сообщите программисту этот текст: " + data.message );
} );

export const sendGCommand = ( command, isCapitalize ) => {
    AppWSChannel.send( {
        event: "sendGCommand",
        command: isCapitalize ? command.toUpperCase() : command
    } );
};

export const sendGCodeFile = ( gCodeFileContent, gCodeFileName ) => {
    let preview = gCodeFileContent.slice( 0, 300 );
    preview = preview.length === 300 ? preview + "........" : preview;
    // TODO: подумать как работать с файлами, у которых нет времени
    // например выводить инфу о том что время в файле не предоставлено
    // Подумать над тем что делать с прогресс баром
    // Показывать крестик о закрытии сразу? много кода менять похоже надо
    const secondsCost = parseFloat( gCodeFileContent.match( RegExpForSearchLinesWithTime )[ 1 ] );
    AppWSChannel.send( {
        event: "sendGCodeFile",
        secondsCost,
        preview,
        gCodeFileName,
        gCodeFileContent,
    } );
};

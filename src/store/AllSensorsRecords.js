import { AppWSChannel } from "../AppWSChannel";
import { AllSensorsRecords } from "../model/AllSensorsRecords";

const RegExpForSearchTemperatureLines = /T:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) \/(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) B:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) \/(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) @:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})) B@:(([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,}))/;

export const AllSensorsRecordsStore = new AllSensorsRecords();

AppWSChannel.addMessageListener( data => {
    if ( data.event !== "printerSendedLine" ) return;
    if( RegExpForSearchTemperatureLines.test( data.line ) ) return;
    AllSensorsRecordsStore.parseTemperatureLineAndArrangeIntoDatasets( data.line, data.time );
} );

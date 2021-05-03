import { PrinterStatusStore } from "../store/PrinterStatus";

export const connectWSHandlersFromPrinterStatusStore = AppWSChannel => {
    AppWSChannel.addEventListener( "close", () => {
        PrinterStatusStore.setUnknownConnectionStatus();
    } );

    AppWSChannel.addMessageListener( data => {
        switch ( data.event ) {
            case "printerState": {
                PrinterStatusStore.setPrinterConnectionStatus( data.isPrinterConnected );
                break;
            }
            case "modelPrintingStatusWasChanged": {
                if ( data.isPrintingActive ) {
                    PrinterStatusStore.setActivePrintingStatus( {
                        secondsCost: data.secondsCost,
                        gCodeFileName: data.gCodeFileName,
                        startTime: data.startTime,
                        finishTime: data.finishTime,
                    } );
                } else {
                    PrinterStatusStore.setInactivePrintingStatus();
                }
                break;
            }
            default: break;
        }
    } );
}

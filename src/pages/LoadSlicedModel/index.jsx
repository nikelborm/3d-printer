import { Dropzone } from "./components/Dropzone";
import { WarningMessage } from "./components/WarningMessage";
import { sendGCodeFile } from "../../AppWSChannel";
import { PrinterStatusStore } from "../../store/PrinterStatus";
import { observer } from "mobx-react";

export const ContentOfLoadSlicedModelPage = observer( () => (
    <>
        <WarningMessage
            canOurCommandsBeDangerous={ PrinterStatusStore.canOurCommandsBeDangerous }
            isPrinterConnected={ PrinterStatusStore.isPrinterConnected }
        />
        <Dropzone
            sender={ sendGCodeFile }
            canOurCommandsBeDangerous={ PrinterStatusStore.canOurCommandsBeDangerous }
            isPrinterConnected={ PrinterStatusStore.isPrinterConnected }
        />
    </>
) );

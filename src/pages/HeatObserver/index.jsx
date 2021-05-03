import { RecordsVisualization } from "./components/RecordsVisualization";
import { GettingTemperatureDataControlButtons } from "./components/GettingTemperatureDataControlButtons";
import { WarningMessage } from "./components/WarningMessage";
import { sendGCommand } from "../../AppWSChannel";
import { PrinterStatusStore } from "../../store/PrinterStatus";
import { observer } from "mobx-react";

const handleClick = event => {
    event.preventDefault();
    sendGCommand( event.target.title );
};

export const ContentOfHeatObserverPage = observer( () => (
    <>
        <WarningMessage
            isPrinterConnected={ PrinterStatusStore.isPrinterConnected }
        />
        <GettingTemperatureDataControlButtons
            disabled={ !PrinterStatusStore.isPrinterConnected }
            onClick={ handleClick }
        />
        <RecordsVisualization/>
    </>
) );

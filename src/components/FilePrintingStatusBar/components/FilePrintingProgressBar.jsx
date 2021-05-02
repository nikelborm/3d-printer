import { observer } from "mobx-react-lite";
import { StyledProgressBar } from "./StyledProgressBar";
import { PrinterStatusStore } from "../../../store/PrinterStatus";

export const FilePrintingProgressBar = observer( () => {
    const { isPrintingFinished, printingPercentFinished } = PrinterStatusStore;
    return (
        <StyledProgressBar
            isPrintingFinished={ isPrintingFinished }
            percent={ printingPercentFinished }
        />
    );
} );

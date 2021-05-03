import { observer } from "mobx-react";
import { StyledProgressBar } from "./StyledProgressBar";
import { PrinterStatusStore } from "../../../store/PrinterStatus";

export const FilePrintingProgressBar = observer( () => (
    <StyledProgressBar
        isPrintingFinished={ PrinterStatusStore.isPrintingFinished }
        percent={ PrinterStatusStore.printingPercentFinished }
    />
) );

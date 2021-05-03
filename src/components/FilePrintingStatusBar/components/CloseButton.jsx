import { observer } from "mobx-react";
import { PrinterStatusStore } from "../../../store/PrinterStatus";
import { StyledButton } from "./StyledButton";

export const CloseButton = observer( () => (
    <StyledButton
        // @ts-ignore
        isPrintingFinished={ PrinterStatusStore.isPrintingFinished }
        onClick={ PrinterStatusStore.setInactivePrintingStatus }
        children="×"
    />
) );

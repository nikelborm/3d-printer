import { observer } from "mobx-react";
import Navbar from "react-bootstrap/Navbar";
import { PrinterStatusStore } from "../../../store/PrinterStatus";

export const FileName = observer( () => (
    <Navbar.Text>
        { PrinterStatusStore.filePrintingInfo.gCodeFileName }
    </Navbar.Text>
) );

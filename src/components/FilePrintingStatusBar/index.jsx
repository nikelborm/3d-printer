import Navbar from "react-bootstrap/Navbar";
import { FilePrintingProgressBar } from "./components/FilePrintingProgressBar";
import { CloseButton } from "./components/CloseButton";
import { TimeInfo } from "./components/TimeInfo";
import { CubeImage } from "./components/CubeImage";
import { FileName } from "./components/FileName";
import { observer } from "mobx-react";
import { PrinterStatusStore } from "../../store/PrinterStatus";

export const FilePrintingStatusBar = observer( () => (
    PrinterStatusStore.isPrintingActive && (
        <Navbar bg="dark" variant="dark" fixed="bottom">
            <CubeImage/>
            <FileName/>
            <FilePrintingProgressBar/>
            <TimeInfo/>
            <CloseButton/>
        </Navbar>
    )
) );

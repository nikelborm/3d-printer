import { observer } from "mobx-react-lite";
import { PrinterStatusStore } from "../../../store/PrinterStatus";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";

const TimeContainer = styled( Navbar.Text )`
    min-width: 320px;
    justify-content: flex-end!important;
`;

export const TimeInfo = observer( () => {
    const { startTimeDate, finishTimeDate } = PrinterStatusStore.filePrintingInfo;
    return (
        <TimeContainer>
            { startTimeDate.toLocaleString( "ru-RU" ) }
            { " - " }
            { finishTimeDate.toLocaleString( "ru-RU" ) }
        </TimeContainer>
    )
} );

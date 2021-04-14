import { memo } from "react";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";

const TimeContainer = styled( Navbar.Text )`
    min-width: 320px;
    justify-content: flex-end!important;
`;
const NotMemorizedTimeInfo = ( { startTime, finishTime } ) => (
    <TimeContainer>
        { startTime.toLocaleString( "ru-RU" ) } - { finishTime.toLocaleString( "ru-RU" ) }
    </TimeContainer>
);

export const TimeInfo = memo( NotMemorizedTimeInfo );

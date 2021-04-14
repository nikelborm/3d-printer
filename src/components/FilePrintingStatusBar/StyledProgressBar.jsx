// @ts-ignore
import { Progress } from "react-sweet-progress";
import styled from "styled-components";

export const StyledProgressBar = styled( Progress )`
    width: 100%;
    margin-left: 20px;
    margin-right: ${ props => props.isPrintingFinished ? "20px" : "40px" };
    & .react-sweet-progress-symbol {
        color: #ffffff;
    }
    & .react-sweet-progress-line-inner-status-active {
        background-color: rgb(244 156 164) !important;
    }
`;

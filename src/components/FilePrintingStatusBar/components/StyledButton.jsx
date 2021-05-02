// @ts-nocheck
import styled from "styled-components";

export const StyledButton = styled.button`
    display: ${ props => props.isPrintingFinished ? "block" : "none" };
    border: none;
    background: inherit;
    font-size: 25px;
    margin-left: 15px;
    color: rgb(255 189 189);
`;

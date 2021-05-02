// @ts-nocheck
import styled from "styled-components";

export const DropBoxContainer = styled.div`
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${ props => props.isDragActive ? "#2196f3" : "#a5a5a5" };
    border-style: dashed;
    background-color: ${ props => props.isDragActive ? "#e2f2ff" : "#fafafa" };
    color: #484848;
    display: grid;
    text-align:center;
    place-items: center center;
    outline: none;
    transition: border .24s ease-in-out;
    height: 500px;
`;

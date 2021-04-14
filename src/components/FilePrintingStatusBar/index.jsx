import React, { useContext, useCallback } from "react";
// @ts-ignore
import { GlobalContext } from "../GlobalContextBasedOnDataFromWS";
import { withRouter } from "react-router";
import Navbar from "react-bootstrap/Navbar";
import { FilePrintingProgressBar } from "./FilePrintingProgressBar";
import { CloseButton } from "./CloseButton";
import { TimeInfo } from "./TimeInfo";
import { CubeImage } from "./CubeImage";
import { FileName } from "./FileName";

const BottomStatusBar = () => {
    const {
        filePrintingInfo: {
            isPrintingActive,
            secondsCost,
            startTime,
            finishTime,
            gCodeFileName,
        },
        userActions: {
            closeProgressBar
        }
    } = useContext( GlobalContext );

    const handleClick = useCallback(
        () => closeProgressBar(),
        [ closeProgressBar ]
    );

    const isPrintingFinished = isPrintingActive && Date.now() >= finishTime.getTime();
    return isPrintingActive && (
        <Navbar bg="dark" variant="dark" fixed="bottom">
            <CubeImage/>
            <FileName name={ gCodeFileName }/>
            <FilePrintingProgressBar
                isPrintingFinished={ isPrintingFinished }
                startTime={ startTime }
                finishTime={ finishTime }
                secondsCost={ secondsCost }
            />
            <TimeInfo
                startTime={ startTime }
                finishTime={ finishTime }
            />
            <CloseButton
                onClick={ handleClick }
                // @ts-ignore
                isPrintingFinished={ isPrintingFinished }
                children="×"
            />
        </Navbar>
    );
}

export const FilePrintingStatusBar = withRouter( BottomStatusBar );

import React, { useContext } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { PageContent } from "../../components/PageContent";
import { Dropzone } from "./components/Dropzone";
import { WarningMessage } from "./components/WarningMessage";

const LoadSlicedModel = () => {
    const {
        authorizationActions: {
            amIAuthorized
        },
        filePrintingInfo: {
            isPrintingActive,
            finishTime
        },
        userActions: {
            sendGCodeFile
        },
        isPrinterConnected
    } = useContext( GlobalContext );

    if ( !amIAuthorized() ) {
        return <Redirect to="/login/" />;
    }
    const couldIBreakEverything = isPrintingActive && Date.now() < finishTime.getTime();
    return (
        <PageContent>
            <WarningMessage
                couldIBreakEverything={ couldIBreakEverything }
                isPrinterConnected={ isPrinterConnected }
            />
            <Dropzone
                sender={ sendGCodeFile }
                couldIBreakEverything={ couldIBreakEverything }
                isPrinterConnected={ isPrinterConnected }
            />
        </PageContent>
    );
}

export const LoadSlicedModelRoute = withRouter( LoadSlicedModel );

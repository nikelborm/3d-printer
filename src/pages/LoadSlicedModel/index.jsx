import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { PageContent } from "../../components/PageContent";
import { Dropzone } from "./components/Dropzone";
import { WarningMessage } from "./components/WarningMessage";
import { MenuWithRouter } from "../../components/Menu";
import { FilePrintingStatusBar } from "../../components/FilePrintingStatusBar";

export const LoadSlicedModel = () => {
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
    return <>
        <MenuWithRouter/>
        <FilePrintingStatusBar/>
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
    </>;
}

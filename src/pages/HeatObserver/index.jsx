import { useContext, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { RecordsVisualization } from "./components/RecordsVisualization";
import { PageContent } from "../../components/PageContent";
import { GettingTemperatureDataControlButtons } from "./components/GettingTemperatureDataControlButtons";
import { WarningMessage } from "./components/WarningMessage";
import { MenuWithRouter } from "../../components/Menu";
import { FilePrintingStatusBar } from "../../components/FilePrintingStatusBar";

export const HeatObserver = () => {
    const {
        authorizationActions: {
            amIAuthorized
        },
        isPrinterConnected,
        userActions: {
            sendGCommand
        },
        records
    } = useContext( GlobalContext );

    const handleClick = useCallback( event => {
        event.preventDefault();
        sendGCommand( event.target.title );
    }, [ sendGCommand ] );

    if ( !amIAuthorized() ) {
        return <Redirect to="/login/" />;
    }
    return <>
        <MenuWithRouter/>
        <FilePrintingStatusBar/>
        <PageContent>
            <WarningMessage
                isPrinterConnected={ isPrinterConnected }
            />
            <GettingTemperatureDataControlButtons
                disabled={ !isPrinterConnected }
                onClick={ handleClick }
            />
            <RecordsVisualization
                data={ records }
            />
        </PageContent>
    </>;
}

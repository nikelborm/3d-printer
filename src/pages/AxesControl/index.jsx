import { useContext, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { PageContent } from "../../components/PageContent";
import { WarningMessage } from "./components/WarningMessage";
import { JoystickImage } from "./components/JoystickImage";
import { JoystickButtons } from "./components/JoystickButtons";
import { MenuWithRouter } from "../../components/Menu";
import { FilePrintingStatusBar } from "../../components/FilePrintingStatusBar";

export const AxesControl = () => {
    const {
        authorizationActions: {
            amIAuthorized
        },
        filePrintingInfo: {
            isPrintingActive,
            finishTime,
        },
        isPrinterConnected,
        userActions: {
            sendGCommand
        }
    } = useContext( GlobalContext );

    const handleClick = useCallback(
        event => {
            event.preventDefault();
            const couldIBreakEverything = isPrintingActive && Date.now() < finishTime.getTime();
            if ( couldIBreakEverything ) {
                alert( "Дождитесь завершения печати!" );
            } else if ( !isPrinterConnected ) {
                alert( "Вы не можете отправлять команды до установки подключения с принтером." );
            } else {
                sendGCommand( event.target.title );
            }
        },
        [ isPrintingActive, finishTime, isPrinterConnected, sendGCommand ]
    );

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
            <JoystickImage/>
            <JoystickButtons onClick={ handleClick }/>
        </PageContent>
    </>;
}

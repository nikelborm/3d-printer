import { useCallback, useContext } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { PageContent } from "../../components/PageContent";
import { CommandEnteringForm } from "./components/CommandEnteringForm";
import { TerminalOutput } from "./components/TerminalOutput";
import { WarningMessage } from "./components/WarningMessage";
import { AlternateCommandsAndIssuesWarning } from "./components/AlternateCommandsAndIssuesWarning";
import { MenuWithRouter } from "../../components/Menu";
import { FilePrintingStatusBar } from "../../components/FilePrintingStatusBar";

export const Terminal = () => {
    const {
        authorizationActions: {
            amIAuthorized
        },
        filePrintingInfo: {
            isPrintingActive,
            finishTime
        },
        isPrinterConnected,
        terminalLogs,
        userActions
    } = useContext( GlobalContext );

    const handleSend = useCallback( event => {
        event.preventDefault();
        const commandInput = event.target.elements.command;
        const commands = {
            clear: "clearTerminal",
            test: "addTestSampleInTerminal",
            resetfile: "resetFile"
        };
        userActions[
            commandInput.value in commands
                ? commands[ commandInput.value ]
                : "sendGCommand"
        ] (
            commandInput.value,
            event.target.elements.isCapitalize.checked
        );
        commandInput.value = "";
    }, [ userActions ] );

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
            <AlternateCommandsAndIssuesWarning/>
            <CommandEnteringForm handleSend={ handleSend }/>
            <TerminalOutput terminalLogs={ terminalLogs }/>
        </PageContent>
    </>;
}

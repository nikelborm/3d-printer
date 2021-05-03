import { CommandEnteringForm } from "./components/CommandEnteringForm";
import { TerminalOutput } from "./components/TerminalOutput";
import { WarningMessage } from "./components/WarningMessage";
import { AlternateCommandsAndIssuesWarning } from "./components/AlternateCommandsAndIssuesWarning";
import { TerminalLogsStore } from "../../store/TerminalLogs";
import { sendGCommand } from "../../AppWSChannel";

const commands = {
    clear: TerminalLogsStore.clearTerminalLogs,
    test: TerminalLogsStore.addTestSampleInTerminal,
};

const handleSend = event => {
    event.preventDefault();
    const commandInput = event.target.elements.command;
    if ( commandInput.value in commands ) {
        commands[ commandInput.value ]();
    } else {
        sendGCommand(
            commandInput.value,
            event.target.elements.isCapitalize.checked
        );
    }
    commandInput.value = "";
};

export const ContentOfTerminalPage = () => (
    <>
        <WarningMessage/>
        <AlternateCommandsAndIssuesWarning/>
        <CommandEnteringForm handleSend={ handleSend }/>
        <TerminalOutput/>
    </>
);

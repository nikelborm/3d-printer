import { Line } from "./Line";
import { AreaForPrintingLines } from "./AreaForPrintingLines";
import { observer } from "mobx-react";
import { TerminalLogsStore } from "../../../store/TerminalLogs";


export const TerminalOutput = observer( () => (
    <AreaForPrintingLines>
        { TerminalLogsStore.terminalLogs.map( log => (
            <Line
                { ...log }
            />
        ) ) }
    </AreaForPrintingLines>
) );

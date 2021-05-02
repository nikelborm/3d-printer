import { memo } from "react";
import { Line } from "./Line";
import { AreaForPrintingLines } from "./AreaForPrintingLines";

export const NotMemorizedTerminalOutput = ( { terminalLogs } ) => (
    <AreaForPrintingLines>
        { terminalLogs.map( log => (
            <Line
                { ...log }
            />
        ) ) }
    </AreaForPrintingLines>
);

export const TerminalOutput = memo( NotMemorizedTerminalOutput );

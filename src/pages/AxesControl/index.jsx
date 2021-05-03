import { useCallback } from "react";
import { WarningMessage } from "./components/WarningMessage";
import { JoystickImage } from "./components/JoystickImage";
import { JoystickButtons } from "./components/JoystickButtons";
import { sendGCommand } from "../../AppWSChannel";
import { observer } from "mobx-react";
import { PrinterStatusStore } from "../../store/PrinterStatus";

export const ContentOfAxesControlPage = observer( () => {
    const isPrinterConnected = PrinterStatusStore.isPrinterConnected;
    const canOurCommandsBeDangerous = PrinterStatusStore.canOurCommandsBeDangerous;
    const handleClick = useCallback(
        event => {
            event.preventDefault();
            if ( canOurCommandsBeDangerous ) {
                alert( "Дождитесь завершения печати!" );
            } else if ( !isPrinterConnected ) {
                alert( "Вы не можете отправлять команды до установки подключения с принтером." );
            } else {
                sendGCommand( event.target.title );
            }
        },
        [ canOurCommandsBeDangerous, isPrinterConnected ]
    );

    return <>
        <WarningMessage
            canOurCommandsBeDangerous={ canOurCommandsBeDangerous }
            isPrinterConnected={ isPrinterConnected }
        />
        <JoystickImage/>
        <JoystickButtons onClick={ handleClick }/>
    </>;
} );

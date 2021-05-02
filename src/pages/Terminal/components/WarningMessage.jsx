import { memo } from "react";
import Alert from "react-bootstrap/Alert";

const NotMemorizedWarningMessage = ( { canOurCommandsBeDangerous, isPrinterConnected } ) => (
    isPrinterConnected
        ? canOurCommandsBeDangerous && (
            <Alert variant="danger">
                Большинство команд, которые вы отправите будут
                выполнены только после завершения печати
            </Alert>
        )
        : (
            <Alert variant="danger">
                G команды, отправленные до установки подключения
                с принтером, исполняться не будут.
            </Alert>
        )
);

export const WarningMessage = memo( NotMemorizedWarningMessage );

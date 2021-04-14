import { memo } from "react";
import Alert from "react-bootstrap/Alert";

const NotMemorizedWarningMessage = ( { isPrinterConnected } ) => (
    !isPrinterConnected && (
        <Alert variant="danger">
            Нажатия на кнопки до установки подключения
            к принтером, ни к чему не приведут.
        </Alert>
    )
);

export const WarningMessage = memo( NotMemorizedWarningMessage );

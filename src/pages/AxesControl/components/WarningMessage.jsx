import { memo } from "react";
import Alert from "react-bootstrap/Alert";

const NotMemorizedWarningMessage = ( { canOurCommandsBeDangerous, isPrinterConnected } ) => (
    isPrinterConnected
        ? canOurCommandsBeDangerous && (
            <Alert variant="danger">
                Будьте осторожны: при измении положения печатающей головки и стола <br/>
                Во время печати, будет непоправимо испорчена отправленная на печать модель
            </Alert>
        )
        : (
            <Alert variant="danger">
                Нажатия на кнопки до установки подключения
                к принтером, ни к чему не приведут.
            </Alert>
        )
);

export const WarningMessage = memo( NotMemorizedWarningMessage );

import { memo } from "react";
import Alert from "react-bootstrap/Alert";

const NotMemorizedWarningMessage = ( { couldIBreakEverything, isPrinterConnected } ) => (
    isPrinterConnected
        ? couldIBreakEverything && (
            <Alert variant="danger">
                Отправка новых моделей заблокирована до завершения печати текущей. <br/>
                Дождитесь завершения текущей, извлеките её из принтера, <br/>
                И только потом запускайте новую.
            </Alert>
        )
        : (
            <Alert variant="danger">
                Вы не сможете отправить модель до установки подключения к принтеру.
            </Alert>
        )
);

export const WarningMessage = memo( NotMemorizedWarningMessage );

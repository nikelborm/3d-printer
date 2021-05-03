import { observer } from "mobx-react";
import Alert from "react-bootstrap/Alert";
import { PrinterStatusStore } from "../../../store/PrinterStatus";


export const WarningMessage = observer( () => (
    PrinterStatusStore.isPrinterConnected
        ? PrinterStatusStore.canOurCommandsBeDangerous && (
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
) );

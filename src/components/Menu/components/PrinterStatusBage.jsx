import { observer } from "mobx-react";
import Badge from "react-bootstrap/Badge";
import { PrinterStatusStore } from "../../../store/PrinterStatus";

const getVariant = (
    connectionStatus,
    ifAvailable,
    ifUnavailable,
    ifUnknown
) => (
    connectionStatus === true
        ? ifAvailable
        : connectionStatus === false
            ? ifUnavailable
            : ifUnknown
);

export const PrinterStatusBage = observer( () => (
    <>
        Принтер:{" "}
        <Badge
            pill
            variant={
                getVariant(
                    PrinterStatusStore.isPrinterConnected,
                    "success",
                    "danger",
                    "secondary"
                )
            }
            children={
                getVariant(
                    PrinterStatusStore.isPrinterConnected,
                    "Подключён",
                    "Отключён",
                    "Запрашивается..."
                )
            }
        />
    </>
) );

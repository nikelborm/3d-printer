import { memo } from "react";
import Badge from "react-bootstrap/Badge";

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

const NotMemorizedPrinterStatus = ( { isPrinterConnected } ) => (
    <>
        Принтер:{" "}
        <Badge
            pill
            variant={
                getVariant(
                    isPrinterConnected,
                    "success",
                    "danger",
                    "secondary"
                )
            }
            children={
                getVariant(
                    isPrinterConnected,
                    "Подключён",
                    "Отключён",
                    "Запрашивается..."
                )
            }
        />
    </>
);

export const PrinterStatus = memo( NotMemorizedPrinterStatus );

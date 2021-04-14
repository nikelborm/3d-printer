import { memo } from "react";
import Button from "react-bootstrap/Button";

const NotMemorizedButtons = ( { disabled, onClick } ) => (
    <p>
        Обновление графика:
        {" "}
        <Button
            title="M155 S1"
            size="sm"
            variant="primary"
            type="submit"
            onClick={ onClick }
            children="Включить"
            disabled={ disabled }
            />
        {" "}
        <Button
            title="M155 S0"
            size="sm"
            variant="secondary"
            type="submit"
            onClick={ onClick }
            children="Выключить"
            disabled={ disabled }
        />
    </p>
);

export const GettingTemperatureDataControlButtons = memo( NotMemorizedButtons );

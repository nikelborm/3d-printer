import { memo } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { SendCommandButton } from "./SendCommandButton";
import { CommandInput } from "./CommandInput";

const NotMemorizedCommandEnteringForm = ( { handleSend } ) => (
    <Form onSubmit={ handleSend }>
        <Form.Group controlId="formBasicCheckbox">
            <b>
                <Form.Check
                    defaultChecked
                    type="checkbox"
                    name="isCapitalize"
                    label="Привести вводимые команды к верхнему регистру"
                />
            </b>
        </Form.Group>
        Введите команду:
        <InputGroup>
            <CommandInput
                name="command"
                type="text"
                placeholder="G01 X0 Y0 Z50"
                autoComplete="off"
            />
            <InputGroup.Append>
                <SendCommandButton
                    variant="primary"
                    type="submit"
                    children="Отправить"
                />
            </InputGroup.Append>
        </InputGroup>
    </Form>
);

export const CommandEnteringForm = memo( NotMemorizedCommandEnteringForm );

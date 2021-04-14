import { memo } from "react";
import Form from "react-bootstrap/Form";

const NotMemorizedInput = ( { name, type, label, placeholder } ) => (
    <Form.Group controlId={ name }>
        <Form.Label>
            { label }
        </Form.Label>
        <Form.Control
            type={ type }
            name={ name }
            required
            placeholder={ placeholder }
        />
    </Form.Group>
);

export const Input = memo( NotMemorizedInput );

import { memo } from "react";
import Navbar from "react-bootstrap/Navbar";

const NotMemorizedFileName = ( { name } ) => (
    <Navbar.Text>
        { name }
    </Navbar.Text>
);

export const FileName = memo( NotMemorizedFileName );

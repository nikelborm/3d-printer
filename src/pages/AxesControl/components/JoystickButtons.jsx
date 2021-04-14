import { MapThatOutlineAreasInside } from "./MapThatOutlineAreasInside";
import { Areas } from "./Areas";
import { memo } from "react";

const NotMemorizedJoystickButtons = ( { onClick } ) => (
    <MapThatOutlineAreasInside
        name="image-map"
        onClick={ onClick }
    >
        <Areas/>
    </MapThatOutlineAreasInside>
);

export const JoystickButtons = memo( NotMemorizedJoystickButtons );

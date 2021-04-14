import { DivForCenteringImage } from "./DivForCenteringImage";

const RenderedJoystickImage = (
    <DivForCenteringImage>
        <img
            src="Joystick.webp"
            alt="Картинка с джойстиком"
            useMap="#image-map"
        />
    </DivForCenteringImage>
);

export const JoystickImage = () => RenderedJoystickImage;

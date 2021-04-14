import Navbar from "react-bootstrap/Navbar";

const RenderedCubeImage = (
    <Navbar.Brand href="#home">
        <img
            alt="file"
            src="cutecube.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
        />
    </Navbar.Brand>
);

export const CubeImage = () => RenderedCubeImage;

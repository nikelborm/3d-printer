import { PureComponent } from "react";
import { withRouter } from "react-router";
import Nav from "react-bootstrap/Nav";
import LinkContainer from "react-router-bootstrap/lib/LinkContainer";
import Navbar from "react-bootstrap/Navbar";
import { PrinterStatusBage } from "./components/PrinterStatusBage";

class MenuPoint extends PureComponent {
    render() {
        const { to, text } = this.props;
        return (
            <Nav.Item>
                <LinkContainer to={ to }>
                    <Nav.Link eventKey={ to } children={ text }/>
                </LinkContainer>
            </Nav.Item>
        );
    }
}

const Menu = ( props ) => {
    console.log('props: ', props);
    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <Navbar.Brand href="#home">
                <img
                    alt="logo"
                    src="128128.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{" "}
                Hello Printy 3D
            </Navbar.Brand>
            <Nav className="mr-auto" activeKey={ props.location.pathname }>
                <MenuPoint to="/admin/terminal/"        text="Терминал"        />
                <MenuPoint to="/admin/axesControl/"     text="Оси"             />
                <MenuPoint to="/admin/heatObserver/"    text="Температура"     />
                <MenuPoint to="/admin/loadSlicedModel/" text="Загрузка модели" />
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <PrinterStatusBage/>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}
export const MenuWithRouter = withRouter( Menu );

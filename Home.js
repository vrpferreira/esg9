import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import './style.css';
import {Button,Container, Navbar, Nav} from 'react-bootstrap';


class Home extends React.Component {
    clickRegister = () => {
        this.props.history.push("/register")
    };

    clickLogin = () => {
        this.props.history.push("/login")
    }

    clickLogout = () => {
        this.props.history.push("/")
        ReactSession.set("username", null)
    }

    render() {
        return (
            <div>
                <Navbar fluid bg="dark" variant="dark">
                    <Container class="container" fluid> 
                    <Navbar.Brand ><b>Car Dealership</b></Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link >Home</Nav.Link>
                            <Nav.Link onClick={this.clickLogin}>Login</Nav.Link>
                            <Nav.Link onClick={this.clickRegister} >Register</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                            Signed in as: <b>{ReactSession.get("username")}</b>
                            </Navbar.Text>
                                <Button className='ml-4' variant="outline-info" onClick={this.clickLogout}>Logout</Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div className="container-fluid homepage-bgimage"></div>
            </div>
        );
    }
}
 
export default withRouter(Home);
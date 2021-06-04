import React from "react";
import {withRouter} from "react-router-dom";
import {ReactSession} from "react-client-session";
import {Form, Button, Container, Col} from "react-bootstrap";
import './style.css';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            responseAWS: "",
            message: "",
            messageCSS: ""
        }
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
    }

    render() {
        return (
           
            <div className="Login-parent">
                <Container>
                 <Col md={{ span: 6, offset: 3 }}>
                 <header className="Login-header">Login</header>
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={this.state.username} onChange={this.onChangeUsername}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword}/>
                            </Form.Group>
                            
                            <Button variant="secondary" onClick={this.clickHome}>
                               Back
                            </Button>

                            <Button variant="primary" onClick={this.clickLogin}>
                                Login
                            </Button>
                        </Form>
                    </Col>
                </Container>
            {/*
                <div className="Login-form">
                    <p>
                        <label>Username</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.onChangeUsername}></input>
                    </p>
                    <p>
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.onChangePassword}></input>
                    </p>
                </div>
                <button className="Login-button-login" onClick={this.clickLogin}>Login</button>
                <button className='Login-button-forgot-password' onClick={this.clickForgotPassword}>Forgot Password</button>
                <button className="Login-button-home" onClick={this.clickHome}>Home</button>
            */}
                <div className={this.state.messageCSS}>
                    <p>{this.state.message}</p>
                </div>
            </div>
        );
    }
    
    clickLogin = () => {
        this.sendAwsRequest()
    };

    clickForgotPassword = () => {
        this.props.history.push("/")
    }

    clickHome = () => {
        this.props.history.push("/")
    }

    request = async (api, data) => {
        const response = await fetch(api, data)
        const json = await response.json()
        this.setState({responseAWS: json.message})
    }

    sendAwsRequest() {
        var invalidUsername = this.isInvalid(this.state.username)
        var invalidPassword = this.isInvalid(this.state.password)

        if (!invalidUsername && !invalidPassword) {
            const api = 'https://zdzw8gz3xf.execute-api.us-east-1.amazonaws.com/stage/res-login'
            const data = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "username" : this.state.username,
                        "password" : this.state.password
                    }
                )
            }
            this.request(api, data);
        }
        else {
            this.setState({responseAWS: ""})
            this.setState({message: "Invalid input"})
            this.setState({messageCSS: "Login-message-invalid"})
        }
    }

    receiveAwsResponse() {
        if (this.state.responseAWS === "SUCCESS") {
            ReactSession.set("username", this.state.username)
            this.setState({responseAWS: ""})
            this.props.history.push("/main")
        }
        else if (this.state.responseAWS === "NO_SUCCESS") {
            this.setState({responseAWS: ""})
            this.setState({message: "Unsuccessful login"})
            this.setState({messageCSS: "Login-message-no-success"})
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.receiveAwsResponse(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }   

    onChangeUsername(event) {
        this.setState({username : event.target.value})
    }

    onChangePassword(event) {
        this.setState({password : event.target.value})
    }

    isInvalid(string) {
        return (string.length === 0 || !string.trim())
    }
}
 
export default withRouter(Login);
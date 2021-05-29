import React from "react";
import { withRouter } from "react-router-dom";
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

    clickLogin = () => {
        this.props.history.push("/main");
    };

    clickHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="Login-parent">
                <header className="Login-header">Login</header>
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
        const response = await fetch(api, data);
        const json = await response.json();

        this.setState({responseAWS: json.message});
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

    checkResponseAWS() {
        if (this.state.responseAWS === "SUCCESS") {
            this.setState({responseAWS: ""})
            this.setState({message: "Successful login"})
            this.setState({messageCSS: "Login-message-success"})
        }
        else if (this.state.responseAWS === "NO_SUCCESS") {
            this.setState({responseAWS: ""})
            this.setState({message: "Unsuccessful login"})
            this.setState({messageCSS: "Login-message-no-success"})
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.checkResponseAWS(), 1000);
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
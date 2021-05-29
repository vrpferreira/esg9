import React from "react";
import { withRouter } from "react-router-dom";
import './style.css';


class Register extends React.Component {
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
            <div className="Register-parent">
                <header className="Register-header">Register</header>
                <div className="Register-form">
                    <p>
                        <label>Username</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.onChangeUsername}></input>
                    </p>
                    <p>
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.onChangePassword}></input>
                    </p>
                </div>
                <button className="Register-button-register" onClick={this.clickRegister}>Register</button>
                <button className="Register-button-home" onClick={this.clickHome}>Home</button>
                <div className={this.state.messageCSS}>
                    <p>{this.state.message}</p>
                </div>
            </div>
        );
    }

    clickRegister = () => {
        this.sendAwsRequest()
    };

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
            const api = 'https://zdzw8gz3xf.execute-api.us-east-1.amazonaws.com/stage/res-register'
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
            this.setState({messageCSS: "Register-message-invalid"})
        }
    }

    checkResponseAWS() {
        if (this.state.responseAWS === "SUCCESS") {
            this.setState({responseAWS: ""})
            this.setState({message: "Successful registration"})
            this.setState({messageCSS: "Register-message-success"})
        }
        else if (this.state.responseAWS === "NO_SUCCESS") {
            this.setState({responseAWS: ""})
            this.setState({message: "Unsuccessful registration"})
            this.setState({messageCSS: "Register-message-no-success"})
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
 
export default withRouter(Register);
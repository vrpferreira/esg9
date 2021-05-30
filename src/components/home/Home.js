import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import './style.css';


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
            <div className="Home">
                <header>User: {ReactSession.get("username")}</header>
                <header className="Home-header">Home</header>
                <button className="Home-button-register" onClick={this.clickRegister}>Register</button>
                <button className="Home-button-login" onClick={this.clickLogin}>Login</button>
                <button onClick={this.clickLogout}>Logout</button>
            </div>
        );
    }
}
 
export default withRouter(Home);
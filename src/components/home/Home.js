import React from "react";
import { withRouter } from "react-router-dom";
import './style.css';


class Home extends React.Component {
    clickRegister = () => {
        this.props.history.push("/register");
    };

    clickLogin = () => {
        this.props.history.push("/login");
    }

    render() {
        return (
            <div className="Home">
                <header className="Home-header">Home</header>
                <button className="Home-button-register" onClick={this.clickRegister}>Register</button>
                <button className="Home-button-login" onClick={this.clickLogin}>Login</button>
            </div>
        );
    }
}
 
export default withRouter(Home);
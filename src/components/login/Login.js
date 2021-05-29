import React from "react";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
    clickLogin = () => {
        this.props.history.push("/main");
    };

    clickHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="Login">
                <header className="Login-header">Login Header</header>
                <button onClick={this.clickLogin}>Login</button>
                <button onClick={this.clickHome}>Home</button>
            </div>
        );
    }
}
 
export default withRouter(Login);
import React from "react";
import { withRouter } from "react-router-dom";

class Register extends React.Component {
    clickRegister = () => {
        this.props.history.push("/main");
    };

    clickHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="Register">
                <header className="Register-header">Register Header</header>
                <button onClick={this.clickRegister}>Register</button>
                <button onClick={this.clickHome}>Home</button>
            </div>
        );
    }
}
 
export default withRouter(Register);
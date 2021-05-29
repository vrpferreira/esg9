import React from "react";
import { withRouter } from "react-router-dom";

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
                <header className="Home-header">Home Header</header>
                <button onClick={this.clickRegister}>Register</button>
                <button onClick={this.clickLogin}>Login</button>
            </div>
        );
    }
}
 
export default withRouter(Home);
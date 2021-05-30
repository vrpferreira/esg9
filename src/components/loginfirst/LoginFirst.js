import React from "react";
import { withRouter } from "react-router-dom";


class LoginFirst extends React.Component {
    clickHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="LoginFirst">
                <header className="LoginFirst-header">LoginFirst</header>
                <button className="LoginFirst-button-home" onClick={this.clickHome}>Home</button>
            </div>
        );
    }
}
 
export default withRouter(LoginFirst);
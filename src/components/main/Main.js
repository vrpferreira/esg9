import React from "react";
import { withRouter } from "react-router-dom";

class Main extends React.Component {
    clickHome = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="Main">
                <header className="Main-header">Main Header</header>
                <button onClick={this.clickHome}>Home</button>
            </div>
        );
    }
}
 
export default withRouter(Main);
import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"


class Main extends React.Component {
    render() {
        return (
            <div className="Main">
                <header>User: {ReactSession.get("username")}</header>
                <header className="Main-header">Main Header</header>
                <button onClick={this.clickHome}>Home</button>
                <button onClick={this.clickProfile}>Profile</button>
                <button onClick={this.clickLogout}>Logout</button>
            </div>
        );
    }

    clickHome = () => {
        this.props.history.push("/")
    }

    clickProfile = () => {
        this.props.history.push("/profile")
    }

    clickLogout = () => {
        this.props.history.push("/")
        ReactSession.set("username", null)
    }

    componentDidMount() {
        this.checkSession()
    }

    checkSession() {
        var username = ReactSession.get("username")
        if (username == null) {
            this.props.history.push("/loginfirst")
        }
    }
}
 
export default withRouter(Main);
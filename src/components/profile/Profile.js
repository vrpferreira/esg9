import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"


class Profile extends React.Component {
    clickHome = () => {
        this.props.history.push("/")
    }

    clickMain = () => {
        this.props.history.push("/main")
    }

    clickLogout = () => {
        this.props.history.push("/")
        ReactSession.set("username", null)
    }

    render() {
        return (
            <div className="Profile">
                <header>User: {ReactSession.get("username")}</header>
                <header className="Profile-header">Profile Header</header>
                <button onClick={this.clickHome}>Home</button>
                <button onClick={this.clickMain}>Main</button>
                <button onClick={this.clickLogout}>Logout</button>
            </div>
        );
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
 
export default withRouter(Profile);
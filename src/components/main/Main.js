import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import './style.css';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: null,
            carList: []
        }

    }

    render() {
        return (
            <div className="Main">
                <header>User: {ReactSession.get("username")}</header>
                <header className="Main-header">Main Header</header>
                <button onClick={this.clickHome}>Home</button>
                <button onClick={this.clickProfile}>Profile</button>
                <button onClick={this.clickLogout}>Logout</button>
                {this.divCarsList()}
            </div>
            
        );
    }

    divCarsList() {
        return(
            <div className="Cars">
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche1.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche2.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche3.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche4.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche5.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
                <div className="Main-car-info">
                    <img src="https://car-images-esg9.s3.amazonaws.com/porsche6.png" alt="Logo"/>
                    <p>Brand: Porsche</p>
                    <p>Model: 911-GT3-RS</p>
                    <p>Color: X</p>
                    <p>Price: 230000€</p>
                    <button>Buy</button>
                </div>
            </div>
        );
    }

    request = async (api, data) => {
        const response = await fetch(api, data)
        const json = await response.json()
        this.setState({body: json.body})
    }

    sendAwsRequest() {
        const api = 'https://zdzw8gz3xf.execute-api.us-east-1.amazonaws.com/stage/res-getcarslist'
        const data = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        this.request(api, data);
    }

    checkResponseAWS() {
        if (this.state.body != null) {
            //convert and add cars to this.state.carList
            var jsonString= JSON.parse(this.state.body);
            var jsonStringList = jsonString.split(/\n/)

            for (var i in jsonStringList) {
                var obj = JSON.parse(jsonStringList[i]);
                this.state.carList.push(obj)
            }
            /*
            for (var i in this.state.carList) {
                console.log(this.state.carList[i]["color"])
            }
            */
        }
    }

    componentDidMount() {
        this.checkSession()
        this.sendAwsRequest()
        this.interval = setInterval(() => this.checkResponseAWS(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }   

    checkSession() {
        var username = ReactSession.get("username")
        if (username == null) {
            this.props.history.push("/loginfirst")
        }
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
}
 
export default withRouter(Main);
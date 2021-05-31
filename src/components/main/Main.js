import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import './style.css';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: null,
            carArray: [],
            carId: -1,
            carBrand: "",
            carModel: "",
            carColor: "",
            carPrice: "",
            carImage: "",
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
                <div className="Main-place-order-panel">
                    <header>Place order</header>
                    <img src={this.state.carImage} alt="Car"/>
                    <div className="Main-car-info-brand">Brand: {this.state.carBrand}</div>
                    <div className="Main-car-info-model">Model: {this.state.carModel}</div>
                    <div className="Main-car-info-color">Color: {this.state.carColor}</div>
                    <div className="Main-car-info-price">Price: {this.state.carPrice}</div>
                </div>
                <div>Selected car id: {this.state.carId}</div>
                <div>
                    <div>{this.renderCarList()}</div>
                </div>
            </div>
            
        );
    }

    renderCarList() {
        return(
            <div className="Cars">
                <header>Cars</header>
                {this.state.carArray.map(car => (
                    <div className = "Main-car-info" key={car.id}>
                        <img src={car.image} alt="Car"/>
                        <div className="Main-car-info-brand">Brand: {car.brand}</div>
                        <div className="Main-car-info-model">Model: {car.model}</div>
                        <div className="Main-car-info-color">Color: {car.color}</div>
                        <div className="Main-car-info-price">Price: {car.price}</div>
                        <button onClick={() => this.clickSelect(car.id, car.brand, car.model, car.color, car.price, car.image)}>Select</button>
                    </div>
                ))}
            </div>
        );
    }

    clickSelect(id, brand, model, color, price, image) {
        this.setState({carId: id})
        this.setState({carBrand: brand})
        this.setState({carModel: model})
        this.setState({carColor: color})
        this.setState({carPrice: price})
        this.setState({carImage: image})
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

    receiveAwsResponse() {
        if (this.state.body != null && this.state.carArray.length === 0) {
            //convert and add cars to this.state.carList
            var jsonString = JSON.parse(this.state.body);
            var jsonStringList = jsonString.split(/\n/)
            var array = []
            for (var i in jsonStringList) {
                var obj = JSON.parse(jsonStringList[i]);
                array.push(obj)
            }
            this.setState({carArray: array})
        }
    }

    checkSession() {
        var username = ReactSession.get("username")
        if (username === null) {
            this.props.history.push("/loginfirst")
        }
        else {
            this.sendAwsRequest()
        }
    }

    componentDidMount() {
        this.checkSession()
        this.interval = setInterval(() => this.receiveAwsResponse(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
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
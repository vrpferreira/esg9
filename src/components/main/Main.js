import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import emailjs from "emailjs-com"
import QRCode from "qrcode"
import './style.css';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: null,
            carArray: [],
            carId: 0,
            carBrand: "",
            carModel: "",
            carColor: "",
            carPrice: "",
            carImage: "",
            name: "",
            address: "",
            email: "",
            qrcode: ""
        }
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
    }

    render() {
        return (
            <div className="Main">
                <div className="Main-topbar">
                    <label className="Main-topbar-user">User</label>
                    <button className="Main-topbar-button-logout" onClick={this.clickLogout}>Logout</button>
                    <button className="Main-topbar-button-home" onClick={this.clickHome}>Home</button>
                </div>
                <div className="Main-place-order-panel">
                    <header>Place order</header>
                    {this.renderCarAndFieldsPlaceOrder()}
                </div>
                <div>
                    <div>{this.renderCarList()}</div>
                </div>
            </div>
        );
    }

    renderCarList() {
        return(
            <div className="Cars">
                {this.state.carArray.map(car => (
                    <div className = "Main-car-info" key={car.id}>
                        <img src={car.image} alt="Car"/>
                        <div className="Main-car-info-brand">Brand: {car.brand}</div>
                        <div className="Main-car-info-model">Model: {car.model}</div>
                        <div className="Main-car-info-color">Color: {car.color}</div>
                        <div className="Main-car-info-price">Price: {car.price}€</div>
                        <button onClick={() => this.clickSelect(car.id, car.brand, car.model, car.color, car.price, car.image)}>Select</button>
                    </div>
                ))}
            </div>
        );
    }

    renderCarAndFieldsPlaceOrder() {
        if (this.state.carId !== 0) {
            return(
                <div>
                    <img src={this.state.carImage} alt="Car"/>
                    <div className="Main-car-info-brand">Brand: {this.state.carBrand}</div>
                    <div className="Main-car-info-model">Model: {this.state.carModel}</div>
                    <div className="Main-car-info-color">Color: {this.state.carColor}</div>
                    <div className="Main-car-info-price">Price: {this.state.carPrice}</div>

                    <form className="Main-place-order-form" onSubmit={this.sendEmailPlaceOrder}>
                        <p>Name</p>
                        <input type="text" name="name" value={this.state.name} onChange={this.onChangeName}></input>
                        <p>Address</p>
                        <input type="text" name="address" value={this.state.address} onChange={this.onChangeAddress}></input>
                        <p>Email</p>
                        <input type="text" name="email" value={this.state.email} onChange={this.onChangeEmail}></input>
                        <input hidden readOnly type="text" name="carBrand" value={this.state.carBrand} />
                        <input hidden readOnly type="text" name="carModel" value={this.state.carModel} />
                        <input hidden readOnly type="text" name="carColor" value={this.state.carColor} />
                        <input hidden readOnly type="text" name="carPrice" value={this.state.carPrice} />
                        <input hidden readOnly type="text" name="carImage" value={this.state.carImage} />
                        <button>Place order</button>
                    </form>

                    <form className="Main-confirmation-order-form" onSubmit={this.sendEmailConfirmationOrder}>
                        <input hidden readOnly type="text" name="name" value={this.state.name} />
                        <input hidden readOnly type="text" name="email" value={this.state.email} />
                        <input hidden readOnly type="text" name="qrcode" value={this.state.qrcode} />
                        <p>
                            <button onClick={() => this.generateQRCode()}>Send QRCode Email</button>
                        </p>
                    </form>
                </div>
            )
        }
    }

    sendEmailPlaceOrder(e) {
        e.preventDefault()
        emailjs.sendForm('service_3et3hvh', 'template_jch835x', e.target, 'user_GM5dpQBFVEjwQwf8lh6Hz')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }

    sendEmailConfirmationOrder(e) {
        e.preventDefault()
        emailjs.sendForm('service_3et3hvh', 'template_pt6rlqi', e.target, 'user_GM5dpQBFVEjwQwf8lh6Hz')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }

    generateQRCode = async () => {
        try {
            const qrcode = await QRCode.toDataURL("hello my friend")
            this.setState({qrcode: qrcode})
            console.log("qrcode: ", qrcode)
        }
        catch (error) {
            console.log(error)
        }
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

    onChangeName(event) {
        this.setState({name : event.target.value})
    }

    onChangeAddress(event) {
        this.setState({address : event.target.value})
    }

    onChangeEmail(event) {
        this.setState({email : event.target.value})
    }

    isInvalid(string) {
        return (string.length === 0 || !string.trim())
    }
}
 
export default withRouter(Main);
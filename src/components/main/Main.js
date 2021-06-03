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
            qrcode: "",
            licensePlate: "",
            receivedVIN: ""
        }
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
    }


    render() {
        return (
            <div className="Main">
                <div className="Main-topbar">
                    <label className="Main-topbar-user">{ReactSession.get("username")}</label>
                    <button className="Main-topbar-button-logout" onClick={this.clickLogout}>Logout</button>
                    <button className="Main-topbar-button-home" onClick={this.clickHome}>Home</button>
                </div>
                <div className="Main-place-order-panel">
                    <header>Place order</header>
                    {this.renderCarAndFieldsPlaceOrder()}
                </div>
                <div className="Main-car-list">
                    <div>{this.renderCarList()}</div>
                </div>
            </div>
        );
    }


    renderCarList() {
        return(
            <div className="Cars">
                {this.state.carArray.map(car => (
                    <div className="Main-car-info" key={car.id}>
                        <img className="Main-car-info-image" src={car.image} alt="Car"/>
                        <div>Brand: {car.brand}</div>
                        <div>Model: {car.model}</div>
                        <div>Color: {car.color}</div>
                        <div>Price: {car.price}€</div>
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
                    <div className="Main-place-order-panel-car">
                        <img className="Main-place-order-panel-car-image" src={this.state.carImage} alt="Car"/>
                        <div>Brand: {this.state.carBrand}</div>
                        <div>Model: {this.state.carModel}</div>
                        <div>Color: {this.state.carColor}</div>
                        <div>Price: {this.state.carPrice}</div>
                    </div>
                    
                    <div className="Main-place-order-form">
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
                        <button onClick={() => this.sendEmailPlaceOrder(this.state.name, this.state.address, this.state.email, this.state.carBrand, this.state.carModel, this.state.carColor, this.state.carPrice, this.state.carImage)}>Place Order</button>
                    </div>

                    <div className="Main-confirmation-order-form">
                        <input hidden readOnly type="text" name="name" value={this.state.name} />
                        <input hidden readOnly type="text" name="email" value={this.state.email} />
                        <input hidden readOnly type="text" name="vin" value={this.state.receivedVIN} />
                        <input hidden readOnly type="text" name="plate" value={this.state.licensePlate} />
                        <input hidden readOnly type="text" name="qrcode" value={this.state.qrcode} />
                    </div>
                </div>
            )
        }
    }


    sendEmailPlaceOrder(name, address, email, brand, model, color, price, image) {
        var templateParams = {
            email: email,
            name: name,
            address: address,
            brand: brand,
            model: model,
            color: color,
            price: price,
            image: image
        };

        emailjs.send('service_3et3hvh', 'template_jch835x', templateParams, 'user_GM5dpQBFVEjwQwf8lh6Hz')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        //ask for vin
        this.AwsRequestVIN()
    }


    sendEmailConfirmationOrder(name, email, vin, plate, qrcode) {
        var templateParams = {
            email: email,
            name: name,
            vin: vin,
            qrcode: qrcode,
            plate: plate
        };

        console.log("sendEmailConfirmationOrder")
        emailjs.send('service_3et3hvh', 'template_pt6rlqi', templateParams, 'user_GM5dpQBFVEjwQwf8lh6Hz')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    }


    clickSelect(id, brand, model, color, price, image) {
        this.setState({carId: id})
        this.setState({carBrand: brand})
        this.setState({carModel: model})
        this.setState({carColor: color})
        this.setState({carPrice: price})
        this.setState({carImage: image})
    }


    /*
    Request the list of cars
    */
    AwsRequestCarList() {
        const api = 'https://zdzw8gz3xf.execute-api.us-east-1.amazonaws.com/stage/res-getcarslist'
        const data = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        this.requestCarList(api, data);
    }


    /*
    Send request to AWS (list of cars) and wait for response
    */
    requestCarList = async (api, data) => {
        //Send request and waits for response
        const response = await fetch(api, data)
        const json = await response.json()

        //Handle AWS response (list of cars)
        var jsonString = JSON.parse(json.body);
        var jsonStringList = jsonString.split(/\n/)
        var array = []
        for (var i in jsonStringList) {
            var obj = JSON.parse(jsonStringList[i]);
            array.push(obj)
        }
        this.setState({carArray: array})
    }


    /*
    Send id to Country Distributor and ask for a VIN
    */
    AwsRequestVIN() {
        const api = 'https://0c936jjw26.execute-api.us-east-1.amazonaws.com/dev/res-getcarstock'
        const data = {
            method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "id" : this.state.carId
                    }
                )
        }
        this.requestVIN(api, data);

        //After send id and received a VIN, send VIN to Registry
        this.interval = setInterval(() => this.AwsSendVIN(), 1000)
    }


    /*
    Send request to AWS (VIN) and wait for response
    */
    requestVIN = async (api, data) => {
        const response = await fetch(api, data)
        const json = await response.json()
        this.setState({receivedVIN: json.message})
    }


    /*
    Send VIN to National Auto Registry (AWS SQS)
    */
    AwsSendVIN() {
        if (this.state.receivedVIN.length > 0) {
            clearInterval(this.interval)
            const api = 'https://nv3zrup082.execute-api.us-east-1.amazonaws.com/stage/res-sendtosqs'
            const data = {
                method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            "vin" : this.state.receivedVIN
                        }
                    )
            }
            this.request(api, data);

            //After send VIN, keep request the according license plate
            this.interval = setInterval(() => this.AwsRequestLicensePlate(), 1000)
        }
    }


    /*
    Send request to AWS (VIN) and wait for response
    */
    request = async (api, data) => {
        const response = await fetch(api, data)
        const json = await response.json()
        console.log(json)
    }


    /*
    Request the license plate
    */
    AwsRequestLicensePlate() {
        const api = 'https://nv3zrup082.execute-api.us-east-1.amazonaws.com/stage/res-receivefromsqs'
        const data = {
            method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "vin" : this.state.receivedVIN
                    }
                )
        }
        this.requestLicensePlate(api, data);
    }


    /*
    Send request to AWS (list of cars) and wait for response
    */
    requestLicensePlate = async (api, data) => {
        //Send request and waits for response
        const response = await fetch(api, data)
        const json = await response.json()


        if (json.license_plate.length > 0 && this.state.licensePlate.length === 0) {
            clearInterval(this.interval)
            this.setState({licensePlate: json.license_plate})

            console.log("VIN: ", this.state.receivedVIN)
            console.log("PLATE: ", this.state.licensePlate)

            this.interval = setInterval(() => this.generateQRCode(), 1000)
        }
    }

    generateQRCode = async () => {
        try {
            const qrcode = await QRCode.toDataURL("Thank you! VIN: " + this.state.receivedVIN + " and LICENSE PLATE: "+ this.state.licensePlate)
            this.setState({qrcode: qrcode})
            this.sendEmailConfirmationOrder(this.state.name, this.state.email, this.state.receivedVIN, this.state.licensePlate, this.state.qrcode)

            clearInterval(this.interval)
        }
        catch (error) {
            console.log(error)
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
            this.AwsRequestCarList()
        }
    }


    componentDidMount() {
        this.checkSession()
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
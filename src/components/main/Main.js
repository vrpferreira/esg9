import React from "react"
import {withRouter} from "react-router-dom"
import {ReactSession} from "react-client-session"
import emailjs from "emailjs-com"
import QRCode from "qrcode"
import './style.css';
import {Button,Container, Navbar, Card, Form} from 'react-bootstrap'; 


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
            receivedVIN: "",
            deliveryDate: ""
        }
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
    }

            render() {
                return (
                    <div className="Main">
                        <Navbar fluid bg="dark" variant="dark">
                            <Container class="container" fluid> 
                                <Navbar.Brand ><b>Car Dealership</b></Navbar.Brand>
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                    Signed in as: <b>{ReactSession.get("username")}</b>
                                    </Navbar.Text>
                                        <Button  className='ml-4'variant="outline-info" onClick={this.clickLogout}>Logout</Button>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <div className="Main-place-order-panel">
                            <header><h2>Place order</h2></header>
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
                                <Card className="h-100 shadow-sm bg-grey rounded">
                                    <Card.Img variant="top" src={car.image} alt="Car" />
                                    <Card.Body>
                                    <Card.Text>
                                        <div><b>Brand:</b> {car.brand}</div>
                                        <div><b>Model:</b> {car.model}</div>
                                        <div><b>Color:</b> {car.color}</div>
                                        <div><b>Price:</b> {car.price}€</div>
                                    </Card.Text>
                                    <Button variant="dark" onClick={() => this.clickSelect(car.id, car.brand, car.model, car.color, car.price, car.image)}>Select</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                        }
                    </div>
                        );
                    }


    renderCarAndFieldsPlaceOrder() {
        if (this.state.carId !== 0) {
            return(
                <div>
                    
                    <div className="Main-place-order-panel-car">
                        <Card className="h-100 shadow-sm bg-grey rounded">
                                        <Card.Img variant="top" src={this.state.carImage} alt="Car" />
                                        <Card.Body className="d-flex flax-column">
                                            <Card.Text>
                                                <div><b>Brand:</b> {this.state.carBrand}</div>
                                                <div><b>Model:</b>: {this.state.carModel}</div>
                                                <div><b>Color:</b> {this.state.carColor}</div>
                                                <div><b>Price:</b> {this.state.carPrice}</div>
                                            </Card.Text>
                                        </Card.Body>
                        </Card>
                    </div>

                
                        
                    <div className="Main-place-order-form">
                        <Form>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.name} onChange={this.onChangeName}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter Address" value={this.state.address} onChange={this.onChangeAddress}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" placeholder="Enter Email" value={this.state.email} onChange={this.onChangeEmail}/>
                            </Form.Group>
                            <Button onClick={() => this.sendEmailPlaceOrder(this.state.name, this.state.address, this.state.email, this.state.carBrand, this.state.carModel, this.state.carColor, this.state.carPrice, this.state.carImage)}>
                                Place Order
                            </Button>
                        </Form>
                    </div>

                </div>
            )
        }
    }


    sendEmailDeliveryDateLogistic(date) {
        var templateParams = {
            message: date,
            sendemail: "gg.gustavopg@gmail.com"
        };

        console.log("sendEmailDeliveryDateLogistic")
        emailjs.send('gmail', 'template_xlz9pcj', templateParams, 'user_ualiHPVnbPLyTCQw1E096')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
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

        console.log("sendEmailPlaceOrder")
        emailjs.send('service_my4v2tl', 'template_z2ibchc', templateParams, 'user_v01K7ikSV9uQDaKeYIakP')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        //ask for vin
        this.AwsRequestVIN()
    }


    sendEmailConfirmationOrder(name, email, brand, model, color, vin, plate, qrcode, deliveryDate) {
        var message = ""
        if (this.state.receivedVIN === "FAIL") {
            message = "This car is out of stock!"
        }
        else {
            message = "Brand: " + brand + " // Model: " + model + " // Color: " + color + " // VIN: " + vin + " // License Plate: " + plate + " // Delivery Date: " + deliveryDate
        }
        var templateParams = {
            email: email,
            name: name,
            qrcode: qrcode,
            message: message,
            deliveryDate: deliveryDate

        };

        console.log("sendEmailConfirmationOrder")
        emailjs.send('service_my4v2tl', 'template_8ff23ms', templateParams, 'user_v01K7ikSV9uQDaKeYIakP')
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
        this.setState({deliveryDate: json.delivery_date})
        this.sendEmailDeliveryDateLogistic(json.delivery_date)
    }


    /*
    Send VIN to National Auto Registry (AWS SQS)
    */
    AwsSendVIN() {
        console.log("AwsSendVIN: ", this.state.receivedVIN)
        if (this.state.receivedVIN.length > 0) {
            if (this.state.receivedVIN !== "FAIL") {
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
            else {
                clearInterval(this.interval)
                this.setState({qrcode: "Unavailable"})
                this.sendEmailConfirmationOrder(this.state.name, this.state.email, this.state.carBrand, this.state.carModel, this.state.carColor, this.state.receivedVIN, this.state.licensePlate, this.state.qrcode, this.state.deliveryDate)
            }
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
    Send request to AWS (license plate) and wait for response
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


    /*
    Request to save qrcode on S3
    */
    AwsRequestSaveQRCode() {
        const api = 'https://zdzw8gz3xf.execute-api.us-east-1.amazonaws.com/stage/res-saveqrcode'
        const data = {
            method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "qrcode" : this.state.qrcode
                    }
                )
        }
        this.requestSaveQRCode(api, data);
    }


    /*
    Send request to AWS (save qrcode) and wait for response
    */
    requestSaveQRCode = async (api, data) => {
        //Send request and waits for response
        const response = await fetch(api, data)
        const json = await response.json()
        console.log("saved qrcode: " + json.message)
    }


    generateQRCode = async () => {
        try {
            const qrcode = await QRCode.toDataURL("Thank you! VIN: " + this.state.receivedVIN + " and LICENSE PLATE: "+ this.state.licensePlate)
            this.setState({qrcode: qrcode})
            this.sendEmailConfirmationOrder(this.state.name, this.state.email, this.state.carBrand, this.state.carModel, this.state.carColor, this.state.receivedVIN, this.state.licensePlate, this.state.qrcode, this.state.deliveryDate)
            this.AwsRequestSaveQRCode()
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
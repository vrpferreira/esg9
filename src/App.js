import React from 'react'
import {BrowserRouter as Router, Route} from "react-router-dom"
import Home from './components/home/Home'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Main from './components/main/Main'
import LoginFirst from './components/loginfirst/LoginFirst'
import {ReactSession} from "react-client-session"
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {

    render() {
        return (
            <Router>
                <div className='App'>
                    {ReactSession.setStoreType("localStorage")}
                    {ReactSession.set("username", ReactSession.get("username"))}
    
                    <Route exact path="/" component={Home} />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/main" component={Main} />
                    <Route path="/loginfirst" component={LoginFirst} />
                </div>
            </Router>
        );
    }
}

export default App;
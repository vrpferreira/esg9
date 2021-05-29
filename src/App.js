import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './components/home/Home'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Main from './components/main/Main'

function App() {
    return (
        <Router>
            <div className='App'>
                <Route exact path="/" component={Home} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/main" component={Main} />
            </div>
        </Router>
    );
}

export default App;
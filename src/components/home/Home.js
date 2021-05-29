import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Register from '../register/Register'
import Login from '../login/Login'

function Home() {
    return (
        <Router>
            <div className="Home">
                <header className="Home-header">Home Page</header>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
            </div>
        </Router>
    );
}

export default Home;
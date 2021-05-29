import React from 'react'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Home from './components/home/Home'

function App() {
    return (
        <div className="App">
            <header className="App-header">App</header>
            <Register/>
            <Login/>
            <Home/>
        </div>
    );
}

export default App;
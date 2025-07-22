import React, { useState } from 'react';
import './navbar.css'
//import amazonLogo from ""
import logo from "./logo.jpg";
import { useAuth } from "react-oidc-context";

const Navbar = ({ auth, signIn, signOut }) => {
    const [isResponsive, setIsResponsive] = useState(false);

    const signOutButton = () => {
        if (auth.isAuthenticated) {
            return <button onClick={signOut}>Sign out</button>
        }
    }

    const signInButton = () => {
        if (!auth.isAuthenticated) {
            return <button onClick={signIn}>Sign in</button>
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Company Logo" />
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>Search</button>
            </div>

            <ul className={`navbar-links ${isResponsive ? 'active' : ''}`}>
                {signOutButton()}
                {signInButton()}
            </ul>
        </nav>
    )
}
export default Navbar;
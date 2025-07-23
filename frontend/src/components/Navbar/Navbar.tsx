import React, { useState } from 'react';
import './navbar.css'
//import amazonLogo from ""
import logo from "./logo backup.jpg";
import { useAuth } from "react-oidc-context";

const Navbar = () => {
    const signOutRedirect = () => {
        auth.removeUser();
        const clientId = "7sn205necoj0cmj5u3mrc1cjee";
        const logoutUri = "http://localhost:5173";
        const cognitoDomain = "https://ap-southeast-2rgeisywkm.auth.ap-southeast-2.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    const auth = useAuth();
    const [isResponsive, setIsResponsive] = useState(false);

    const signOutButton = () => {
        if (auth.isAuthenticated) {
            return <button onClick={signOutRedirect}>Sign out</button>
        }
    }

    const signInButton = () => {
        if (!auth.isAuthenticated) {
            return <button onClick={() => auth.signinRedirect()}>Sign in</button>
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
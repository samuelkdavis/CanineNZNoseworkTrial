import React, { useState } from 'react';
import './navbar.css'
//import amazonLogo from ""
const amazonLogo = "todo";
import { useAuth } from "react-oidc-context";

const Navbar = ({ signOut }) => {
    const [isResponsive, setIsResponsive] = useState(false);
    const auth = useAuth();

    const toggleResponsiveMenu = () => {
        setIsResponsive(!isResponsive);
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={amazonLogo} alt="Company Logo" />
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <button>Search</button>
            </div>

            <ul className={`navbar-links ${isResponsive ? 'active' : ''}`}>
                {/* <li><button href="#">Sign In</button></li> */}
                <li>
                    {auth.isAuthenticated ? (
                        <button onClick={signOut}>Sign out</button>
                    ) : (
                        <button onClick={() => auth.signinRedirect()}>Sign in</button>
                    )
                    }
                    <a href="#">Sign In</a>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar;
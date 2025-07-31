// App.js

import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./components/SettingsPage/SettingsPage";

function App() {

    return (
        <>
            <BrowserRouter>
                <TopNav />

                <Routes>
                    <Route path="/" element={<LoginToken />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* Add more routes as needed */}
                </Routes>
                {/* <TopNav2 /> */}
            </BrowserRouter>
        </>
    );
}

export default App;
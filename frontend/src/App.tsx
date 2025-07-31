// App.js

import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import AdminPage from "./components/AdminPage/AdminPage";
import DogsPage from "./components/DogsPage/DogsPage";

function App() {

    return (
        <>
            <BrowserRouter>
                <TopNav />
                <Routes>
                    <Route path="/" element={<LoginToken />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/dogs" element={<DogsPage />} />
                    {/* Add more routes as needed */}
                </Routes>
                {/* <TopNav2 /> */}
            </BrowserRouter>
        </>
    );
}

export default App;
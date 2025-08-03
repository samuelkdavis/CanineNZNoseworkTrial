// App.js

import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import AdminPage from "./components/AdminPage/AdminPage";
import DogsPage from "./components/DogsPage/DogsPage";
import { RequireAdmin } from "./Authorisation";

function App() {

    return (
        <>
            <BrowserRouter>
                <TopNav />
                <Routes>
                    <Route path="/" element={<LoginToken />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route
                        path="/admin"
                        element={
                            <RequireAdmin>
                                <AdminPage />
                            </RequireAdmin>
                        }
                    />
                    <Route path="/dogs" element={<DogsPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}


export default App;
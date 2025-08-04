// App.js

import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import DogsPage from "./pages/DogsPage/DogsPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import { RequireAdmin } from "./Authorisation";



function App() {

    return (
        <>
            <BrowserRouter>
                <TopNav />
                <Routes>
                    <Route path="/" element={<LoginToken />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/dogs" element={<DogsPage />} />
                    <Route path="/admin"
                        element={
                            <RequireAdmin>
                                <AdminPage />
                            </RequireAdmin>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}


export default App;
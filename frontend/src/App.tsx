// App.js

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import RunningOrder from "./pages/RunningOrder/RunningOrder";
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
                    <Route path="/running-order" element={<RunningOrder />} />
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
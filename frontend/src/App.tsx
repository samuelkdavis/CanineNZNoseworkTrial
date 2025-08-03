// App.js

import { useAuth } from "react-oidc-context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import AdminPage from "./components/AdminPage/AdminPage";
import DogsPage from "./components/DogsPage/DogsPage";

function RequireAdmin({ children }) {
    const auth = useAuth();
    console.log(auth.isLoading); // Debugging line to check loading state
    if (auth.isLoading) {
        return <div>Loading...</div>;
    } else {

        const roles = auth.user?.profile["cognito:groups"] || [];
        console.log("Roles:", roles); // Debugging line to check roles
        // Adjust the above line based on your token's claim structure
        const isAdmin = Array.isArray(roles)
            ? roles.includes("admin")
            : roles === "admin";

        if (!auth.isAuthenticated) {
            return <Navigate to="/" replace />;
        }
        if (!isAdmin) {
            return <div>Access denied. Admins only.</div>;
        }
        return children;
    }
}

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
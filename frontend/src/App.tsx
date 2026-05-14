// App.js

import { BrowserRouter, Routes, Route } from "react-router-dom"
import TopNav from "./components/TopNav/TopNav";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import DeveloperPage from "./pages/DeveloperPage/DeveloperPage";
import HomePage from "./pages/HomePage/HomePage";
import RunningOrder from "./pages/RunningOrder/RunningOrder";
import CallBoard from "./pages/CallBoard/CallBoard";
import WipPage from "./pages/WipPage/WipPage";
import Admin2Page from "./pages/Admin2Page/Admin2Page";
import RunningOrder2Page from "./pages/RunningOrder2Page/RunningOrder2Page";
import AdminHub from "./pages/AdminHub/AdminHub";
import { RequireAdmin } from "./Authorisation";
import { ServiceContainer } from "./repositories/ServiceContainer";
import { ServiceContext } from "./repositories/ServiceContext";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';


function App() {
    const services = new ServiceContainer();
    return (
        <Theme
            appearance="light"
            accentColor="purple"
            grayColor="slate"
            radius="medium"
            scaling="100%"
        >
            <ServiceContext.Provider value={services}>
                <BrowserRouter>
                    <TopNav />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/running-order" element={<RunningOrder />} />
                        <Route path="/call-board" element={<CallBoard />} />
                        <Route path="/developer" element={<DeveloperPage />} />
                        <Route path="/wip" element={<WipPage />} />
                        <Route path="/admin2" element={<Admin2Page />} />
                        <Route path="/running-order-2" element={<RunningOrder2Page />} />
                        <Route path="/admin-hub" element={<AdminHub />} />
                        <Route path="/admin"
                            element={
                                <RequireAdmin>
                                    <AdminPage />
                                </RequireAdmin>
                            }
                        />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </BrowserRouter>
            </ServiceContext.Provider>

        </Theme>
    );
}


export default App;
// App.js

import { useAuth } from "react-oidc-context";
import Navbar from "./components/Navbar/Navbar";

function App() {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }


    return (
        <>
            <Navbar />
            {auth.isAuthenticated ?
                <div>
                    <pre> Hello: {auth.user?.profile.email} </pre>
                    <pre> ID Token: {auth.user?.id_token} </pre>
                    <pre> Access Token: {auth.user?.access_token} </pre>
                    <pre> Refresh Token: {auth.user?.refresh_token} </pre>
                </div>
                : <div></div>
            }
        </>
    );
}

export default App;
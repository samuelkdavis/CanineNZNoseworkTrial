// App.js

import { useAuth } from "react-oidc-context";
import TopNav from "./components/TopNav/TopNav";
import TopNav2 from "./components/MaterialTopNav/TopNav2";

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
            <TopNav />

            {/* <TopNav2 /> */}

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
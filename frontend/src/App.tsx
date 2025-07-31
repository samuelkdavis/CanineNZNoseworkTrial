// App.js

import { useAuth } from "react-oidc-context";
import TopNav from "./components/TopNav/TopNav";
import LoginToken from "./components/LoginToken/LoginToken";

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
            <LoginToken />
        </>
    );
}

export default App;
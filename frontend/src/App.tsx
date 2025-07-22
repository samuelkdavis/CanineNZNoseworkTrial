// App.js

import { useAuth } from "react-oidc-context";
import Navbar from "./components/Navbar/Navbar";
function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "7sn205necoj0cmj5u3mrc1cjee";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://ap-southeast-2rgeisywkm.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }


  return (
    <>
      <Navbar auth={auth} signIn={auth.signinRedirect} signOut={auth.removeUser} />
      {auth.isAuthenticated?
        <div>
          <pre> Hello: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        </div>
        :<div></div>
      }
    </>
  );
}

export default App;
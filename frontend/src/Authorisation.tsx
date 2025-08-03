import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

//Authentication = are you who you say you are?
//Authorisation = do you have permission to do this?



function signOutRedirect(auth) {

    auth.removeUser();
    const clientId = "7sn205necoj0cmj5u3mrc1cjee";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://ap-southeast-2rgeisywkm.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

const cognitoAuthConfig = {
    authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_RGEisYwKM",
    client_id: "7sn205necoj0cmj5u3mrc1cjee",
    redirect_uri: "http://localhost:5173",
    response_type: "code",
    scope: "email openid phone",
    onSigninCallback: (_user) => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

export { signOutRedirect, cognitoAuthConfig };
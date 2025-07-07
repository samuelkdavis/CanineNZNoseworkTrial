import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import './index.css'
import App from './App.tsx'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_RGEisYwKM",
  client_id: "7sn205necoj0cmj5u3mrc1cjee",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "email openid phone",
  // onSigninCallback: (_user) => {
  //   window.history.replaceState({}, document.title, window.location.pathname);
  // }
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)

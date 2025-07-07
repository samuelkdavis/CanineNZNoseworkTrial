import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import './index.css'
import App from './App.tsx'

const cognitoAuthConfig = {
  authority: "domain-url",
  client_id: "client id",
  redirect_uri: "http://localhost:5173/",
  respnse_type: "code",
  scope: "email openid profile",
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)

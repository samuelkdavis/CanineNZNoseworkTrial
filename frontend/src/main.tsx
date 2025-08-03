import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import './index.css'
import App from './App.tsx'
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import TopNav from './components/TopNav/TopNav.tsx';
import { cognitoAuthConfig } from './Authorisation.tsx';



const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
                {/* <ThemePanel /> */}
                <App />
            </Theme>
        </AuthProvider>
    </StrictMode>,
)

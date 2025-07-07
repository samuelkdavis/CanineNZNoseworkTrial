import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import { useAuth } from "react-oidc-context";

function App() {
  const [count, setCount] = useState(0)
  const auth = useAuth();

  const signOut = async () => {
    await auth.removeUser();

    const clientId = "client id";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "cognito domain";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}$logout_uri=${encodeURIComponent(logoutUri)}`;
  }

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>
    case "signoutRedirect":
      return <div>Signing you out...</div>
  }

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>
  }

  return (
    <>
      <Navbar signOut={signOut} />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicQueue from './components/PublicQueue';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicQueue />} />
        <Route path="/location/:locationId" element={<PublicQueue />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

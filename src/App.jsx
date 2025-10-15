import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DataEntryForm from './components/DataEntryForm';
import Login from './components/Login';
import { setAuthToken } from './api/api';
import './App.css';

function App() {
  // Read the token from localStorage and immediately set it for all API requests
  const initialToken = localStorage.getItem("token");
  if (initialToken) {
    setAuthToken(initialToken);
  }

  const [token, setToken] = useState(initialToken);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const handleLoginSuccess = (newToken, newUserName) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newUserName);
    setToken(newToken);
    setUserName(newUserName);
    setAuthToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setToken(null);
    setUserName(null);
    setAuthToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <MainLayout userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const MainLayout = ({ userName, onLogout }) => (
  <div className="App">
    <header className="App-header">
      <h1>School Performance Tracker</h1>
      <div className="header-right">
        <span>Welcome, {userName}!</span>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </header>
    <main>
      <DataEntryForm />
      <Dashboard userName={userName} />
    </main>
  </div>
);

export default App;

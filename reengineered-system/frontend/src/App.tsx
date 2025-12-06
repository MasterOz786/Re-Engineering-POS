import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { authService } from './services/authService';

const Dashboard: React.FC = () => {
  const user = authService.getCurrentUser();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>POS System Dashboard</h1>
      <p>Welcome, {user?.name} ({user?.position})</p>
      <div>
        <h2>Available Features:</h2>
        <ul>
          <li>Sales Transactions</li>
          <li>Rental Management</li>
          <li>Return Processing</li>
          <li>Inventory Management</li>
          {user?.position === 'Admin' && <li>Employee Management</li>}
        </ul>
      </div>
      <button onClick={() => {
        authService.logout();
        window.location.reload();
      }}>
        Logout
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;


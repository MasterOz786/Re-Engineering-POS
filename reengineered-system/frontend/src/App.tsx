import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { InventoryPage } from './pages/InventoryPage';
import { SalesPage } from './pages/SalesPage';
import { RentalsPage } from './pages/RentalsPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { authService } from './services/authService';

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
        <Route
          path="/inventory"
          element={
            isAuthenticated ? (
              <InventoryPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/sales"
          element={
            isAuthenticated ? (
              <SalesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/rentals"
          element={
            isAuthenticated ? (
              <RentalsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/returns"
          element={
            isAuthenticated ? (
              <ReturnsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/employees"
          element={
            isAuthenticated ? (
              <EmployeesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? (
              <TransactionsPage />
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


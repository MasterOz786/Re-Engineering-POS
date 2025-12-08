import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import api from '../services/api';
import './Dashboard.css';

const features = [
  {
    id: 'sales',
    title: 'Sales Transactions',
    description: 'Process sales, apply discounts, and generate receipts',
    icon: '💰',
    available: true
  },
  {
    id: 'rentals',
    title: 'Rental Management',
    description: 'Manage item rentals, track due dates, and calculate fees',
    icon: '📦',
    available: true
  },
  {
    id: 'returns',
    title: 'Return Processing',
    description: 'Handle item returns and process refunds',
    icon: '↩️',
    available: true
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'View and manage product inventory and stock levels',
    icon: '📊',
    available: true
  },
  {
    id: 'employees',
    title: 'Employee Management',
    description: 'Manage employee accounts and permissions',
    icon: '👥',
    available: true,
    adminOnly: true
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    description: 'View all sales, rentals, and returns',
    icon: '📋',
    available: true
  }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.position === 'Admin';
  const [stats, setStats] = useState({
    totalSales: '--',
    totalSalesAmount: '--',
    activeRentals: '--',
    inventoryItems: '--'
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats({
        totalSales: response.data.totalSales.toString(),
        totalSalesAmount: `$${parseFloat(response.data.totalSalesAmount).toFixed(2)}`,
        activeRentals: response.data.activeRentals.toString(),
        inventoryItems: response.data.inventoryItems.toString()
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleFeatureClick = (featureId: string) => {
    const routes: { [key: string]: string } = {
      'sales': '/sales',
      'rentals': '/rentals',
      'returns': '/returns',
      'inventory': '/inventory',
      'employees': '/employees',
      'transactions': '/transactions'
    };
    const route = routes[featureId];
    if (route) {
      navigate(route);
    }
  };

  const availableFeatures = features.filter(f => f.available && (!f.adminOnly || isAdmin));

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>POS System Dashboard</h1>
            <p>Point of Sale Management System</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-badge">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>{user?.position}</div>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Manage your point of sale operations from this dashboard</p>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', color: '#2d3748', marginBottom: '16px' }}>
            Available Features
          </h2>
          <div className="features-grid">
            {availableFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`feature-card ${!feature.available ? 'disabled' : ''}`}
                onClick={() => {
                  if (feature.available) {
                    handleFeatureClick(feature.id);
                  }
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h4>Total Sales</h4>
            <div className="stat-value">{loadingStats ? '...' : stats.totalSalesAmount}</div>
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              {stats.totalSales} transactions
            </div>
          </div>
          <div className="stat-card">
            <h4>Active Rentals</h4>
            <div className="stat-value">{loadingStats ? '...' : stats.activeRentals}</div>
          </div>
          <div className="stat-card">
            <h4>Inventory Items</h4>
            <div className="stat-value">{loadingStats ? '...' : stats.inventoryItems}</div>
          </div>
        </div>
      </main>
    </div>
  );
};


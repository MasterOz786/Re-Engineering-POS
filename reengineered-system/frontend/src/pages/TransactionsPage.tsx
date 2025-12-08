import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PageStyles.css';

interface Transaction {
  id: number;
  transaction_type: 'Sale' | 'Rental' | 'Return';
  total_amount: string;
  tax_amount?: string;
  discount_amount?: string;
  coupon_code?: string;
  status: string;
  created_at: string;
  Employee?: {
    username: string;
    first_name: string;
    last_name: string;
  };
  Customer?: {
    phone_number: string;
    first_name?: string;
    last_name?: string;
  };
}

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Sale' | 'Rental' | 'Return'>('all');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' 
        ? '/transactions?limit=100'
        : `/transactions/type/${filter}?limit=100`;
      const response = await api.get(endpoint);
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Sale': return '💰';
      case 'Rental': return '📦';
      case 'Return': return '↩️';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sale': return '#22543d';
      case 'Rental': return '#2c5282';
      case 'Return': return '#c53030';
      default: return '#4a5568';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>📋 Transaction History</h1>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div style={{ padding: '20px 32px' }}>
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('all')}
          >
            All Transactions
          </button>
          <button
            className={filter === 'Sale' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('Sale')}
          >
            💰 Sales
          </button>
          <button
            className={filter === 'Rental' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('Rental')}
          >
            📦 Rentals
          </button>
          <button
            className={filter === 'Return' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('Return')}
          >
            ↩️ Returns
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Employee</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>
                      <span
                        className="transaction-type-badge"
                        style={{ backgroundColor: getTypeColor(transaction.transaction_type) }}
                      >
                        {getTypeIcon(transaction.transaction_type)} {transaction.transaction_type}
                      </span>
                    </td>
                    <td><strong>${parseFloat(transaction.total_amount).toFixed(2)}</strong></td>
                    <td>${transaction.tax_amount ? parseFloat(transaction.tax_amount).toFixed(2) : '0.00'}</td>
                    <td>
                      {transaction.discount_amount && parseFloat(transaction.discount_amount) > 0
                        ? `-$${parseFloat(transaction.discount_amount).toFixed(2)}`
                        : '-'
                      }
                    </td>
                    <td>
                      {transaction.Employee
                        ? `${transaction.Employee.first_name} ${transaction.Employee.last_name}`
                        : 'N/A'
                      }
                    </td>
                    <td>
                      {transaction.Customer
                        ? transaction.Customer.phone_number
                        : 'N/A'
                      }
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
                    <td>
                      <span className={transaction.status === 'Completed' ? 'status-active' : ''}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


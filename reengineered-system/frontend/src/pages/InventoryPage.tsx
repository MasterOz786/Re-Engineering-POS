import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { authService } from '../services/authService';
import './PageStyles.css';

interface Item {
  id: number;
  item_code: string;
  name: string;
  price: string;
  quantity: number;
  category?: string;
}

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const isAdmin = authService.getCurrentUser()?.position === 'Admin';

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items');
      setItems(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setError('');
      setSuccess('');
      await api.post('/items', {
        itemCode: formData.get('item_code'),
        name: formData.get('name'),
        price: parseFloat(formData.get('price') as string),
        quantity: parseInt(formData.get('quantity') as string),
        category: formData.get('category') || null
      });
      setSuccess('Item added successfully!');
      e.currentTarget.reset();
      setShowAddForm(false);
      loadItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError('');
      await api.delete(`/items/${id}`);
      setSuccess('Item deleted successfully!');
      loadItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete item');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>📊 Inventory Management</h1>
        {isAdmin && (
          <button className="primary-button" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="form-card">
          <h2>Add New Item</h2>
          <p style={{ color: '#718096', marginBottom: '20px', fontSize: '14px' }}>
            Fill in the details below to add a new item to inventory
          </p>
          <form onSubmit={handleAddItem}>
            <div className="form-row">
              <div className="form-group">
                <label>Item Code *</label>
                <input 
                  type="text" 
                  name="item_code" 
                  placeholder="e.g., ITEM001" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Item Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g., Laptop" 
                  required 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price" 
                  placeholder="0.00" 
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input 
                  type="number" 
                  name="quantity" 
                  placeholder="0" 
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category (Optional)</label>
                <input 
                  type="text" 
                  name="category" 
                  placeholder="e.g., Electronics" 
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="primary-button">Add Item</button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => {
                  setShowAddForm(false);
                  setError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAdmin && (
        <div className="info-message" style={{ margin: '20px 32px' }}>
          ℹ️ Only administrators can add items. Please contact an admin to add new inventory items.
        </div>
      )}

      {error && <div className="error-message">⚠️ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '40px' }}>
                    No items found. {isAdmin && 'Add your first item above!'}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item_code}</td>
                    <td>{item.name}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      <span className={item.quantity < 10 ? 'low-stock' : ''}>
                        {item.quantity}
                      </span>
                    </td>
                    <td>{item.category || 'N/A'}</td>
                    {isAdmin && (
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteItem(item.id)}
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
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


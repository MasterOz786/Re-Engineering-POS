import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PageStyles.css';

interface Item {
  id: number;
  item_code: string;
  name: string;
  price: string;
  quantity: number;
}

interface RentalItem {
  item: Item;
  quantity: number;
}

interface RentalRecord {
  id: number;
  item_id: number;
  customer_id: number;
  rental_date: string;
  due_date: string;
  return_date?: string | null;
  is_returned: boolean;
  quantity: number;
  Item?: {
    name: string;
    item_code: string;
  };
  Customer?: {
    phone_number: string;
  };
}

export const RentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rentalDate, setRentalDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeRentals, setActiveRentals] = useState<RentalRecord[]>([]);
  const [recentRentals, setRecentRentals] = useState<RentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rentalReceipt, setRentalReceipt] = useState<{
    id: number;
    items: string;
    dueDate?: string | Date;
  } | null>(null);

  useEffect(() => {
    loadItems();
    loadRentals();
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

  const loadRentals = async () => {
    try {
      setLoadingRentals(true);
      const [activeRes, recentRes] = await Promise.all([
        api.get('/rentals/active?limit=20'),
        api.get('/rentals?limit=20')
      ]);
      setActiveRentals(activeRes.data);
      setRecentRentals(recentRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load rentals');
    } finally {
      setLoadingRentals(false);
    }
  };

  const addItemToRental = (item: Item) => {
    const existing = rentalItems.find(ri => ri.item.id === item.id);
    if (existing) {
      setRentalItems(rentalItems.map(ri =>
        ri.item.id === item.id
          ? { ...ri, quantity: Math.min(ri.quantity + 1, item.quantity) }
          : ri
      ));
    } else {
      if (item.quantity > 0) {
        setRentalItems([...rentalItems, { item, quantity: 1 }]);
      } else {
        setError('Item is out of stock');
      }
    }
  };

  const removeItemFromRental = (itemId: number) => {
    setRentalItems(rentalItems.filter(ri => ri.item.id !== itemId));
  };

  const updateRentalQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromRental(itemId);
    } else {
      const item = items.find(i => i.id === itemId);
      if (item && quantity <= item.quantity) {
        setRentalItems(rentalItems.map(ri =>
          ri.item.id === itemId ? { ...ri, quantity } : ri
        ));
      } else {
        setError(`Maximum quantity available: ${item?.quantity || 0}`);
      }
    }
  };

  const calculateRentalTotal = () => {
    return rentalItems.reduce((sum, ri) => {
      return sum + (parseFloat(ri.item.price) * ri.quantity);
    }, 0);
  };

  const handleCreateRental = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rentalItems.length === 0) {
      setError('Please add at least one item to rent');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter customer phone number');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      const payload = {
        phoneNumber: phoneNumber.trim(),
        rentalDate: new Date(rentalDate).toISOString(),
        items: rentalItems.map(ri => ({
          itemId: ri.item.id,
          quantity: ri.quantity
        }))
      };

      const response = await api.post('/transactions/rental', payload);

      // Capture rental ID and info for the return step
      const rentalId = response.data?.id;
      const dueDate = response.data?.due_date || response.data?.dueDate;
      const itemSummary = rentalItems
        .map(ri => `${ri.item.name} x${ri.quantity}`)
        .join(', ');

      setRentalReceipt(rentalId ? { id: rentalId, items: itemSummary, dueDate } : null);
      setSuccess(
        rentalId
          ? `Rental created successfully! Rental ID: ${rentalId}. Keep this ID for returns.`
          : 'Rental created successfully!'
      );
      setRentalItems([]);
      setPhoneNumber('');
      setRentalDate(new Date().toISOString().split('T')[0]);
      loadRentals();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create rental');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>📦 Rental Management</h1>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {success && (
        <div className="success-message">
          ✅ {success}
          {rentalReceipt && (
            <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.6 }}>
              <div><strong>Rental ID:</strong> {rentalReceipt.id}</div>
              <div><strong>Items:</strong> {rentalReceipt.items}</div>
              {rentalReceipt.dueDate && (
                <div><strong>Due Date:</strong> {new Date(rentalReceipt.dueDate).toLocaleDateString()}</div>
              )}
              <div style={{ color: '#2c5282', marginTop: '6px' }}>
                Use this Rental ID when processing returns.
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rental-layout">
        <div className="items-section">
          <h2>Available Items for Rental</h2>
          {loading ? (
            <div className="loading">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <p>No items available for rental. Add items in Inventory Management first.</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => {
                const inCart = rentalItems.find(ri => ri.item.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`item-card ${inCart ? 'selected' : ''} ${item.quantity === 0 ? 'out-of-stock' : ''}`}
                    onClick={() => item.quantity > 0 && addItemToRental(item)}
                  >
                    <div className="item-name">{item.name}</div>
                    <div className="item-code">{item.item_code}</div>
                    <div className="item-price">${parseFloat(item.price).toFixed(2)}/day</div>
                    <div className={`item-stock ${item.quantity < 5 ? 'low-stock' : ''}`}>
                      Stock: {item.quantity}
                    </div>
                    {inCart && (
                      <div className="item-in-cart">In rental: {inCart.quantity}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rental-form-section">
          <h2>Create Rental</h2>
          <form className="form-card" onSubmit={handleCreateRental}>
            <div className="form-group">
              <label>Customer Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +1234567890"
                required
              />
              <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                Customer will be created automatically if not exists
              </small>
            </div>

            <div className="form-group">
              <label>Rental Date *</label>
              <input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                required
              />
              <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                Due date will be automatically set to 7 days from the rental date you pick
              </small>
            </div>

            {rentalItems.length > 0 && (
              <div className="rental-items-list">
                <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Rental Items:</h3>
                {rentalItems.map((ri) => (
                  <div key={ri.item.id} className="rental-item-row">
                    <div className="rental-item-info">
                      <strong>{ri.item.name}</strong>
                      <span>${parseFloat(ri.item.price).toFixed(2)} each</span>
                    </div>
                    <div className="rental-item-controls">
                      <button
                        type="button"
                        onClick={() => updateRentalQuantity(ri.item.id, ri.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{ri.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateRentalQuantity(ri.item.id, ri.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItemFromRental(ri.item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="rental-item-total">
                      ${(parseFloat(ri.item.price) * ri.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="rental-total">
                  <strong>Total Rental Fee: ${calculateRentalTotal().toFixed(2)}</strong>
                </div>
              </div>
            )}

            {rentalItems.length === 0 && (
              <div className="empty-state">
                <p>Click on items from the left to add them to the rental</p>
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={processing || rentalItems.length === 0}
              style={{ marginTop: '20px', width: '100%' }}
            >
              {processing ? 'Processing...' : 'Create Rental'}
            </button>
          </form>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <div style={{ padding: '16px' }}>
          <h2 style={{ margin: 0, color: '#2d3748' }}>Active Rentals</h2>
        </div>
        {loadingRentals ? (
          <div className="loading">Loading rentals...</div>
        ) : (
          <div className="table-container" style={{ boxShadow: 'none', margin: '0 0 16px 0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Customer Phone</th>
                  <th>Quantity</th>
                  <th>Rental Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeRentals.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                      No active rentals
                    </td>
                  </tr>
                ) : (
                  activeRentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>#{rental.id}</td>
                      <td>{rental.Item?.name || rental.item_id}</td>
                      <td>{rental.Customer?.phone_number || 'N/A'}</td>
                      <td>{rental.quantity}</td>
                      <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                      <td>{new Date(rental.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className="status-active">Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <div style={{ padding: '16px' }}>
          <h2 style={{ margin: 0, color: '#2d3748' }}>Recent Rentals</h2>
        </div>
        {loadingRentals ? (
          <div className="loading">Loading rentals...</div>
        ) : (
          <div className="table-container" style={{ boxShadow: 'none', margin: '0 0 16px 0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Customer Phone</th>
                  <th>Quantity</th>
                  <th>Rental Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRentals.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                      No rentals yet
                    </td>
                  </tr>
                ) : (
                  recentRentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>#{rental.id}</td>
                      <td>{rental.Item?.name || rental.item_id}</td>
                      <td>{rental.Customer?.phone_number || 'N/A'}</td>
                      <td>{rental.quantity}</td>
                      <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                      <td>{new Date(rental.due_date).toLocaleDateString()}</td>
                      <td>
                        {rental.is_returned ? (
                          <span className="status-inactive">Returned</span>
                        ) : (
                          <span className="status-active">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

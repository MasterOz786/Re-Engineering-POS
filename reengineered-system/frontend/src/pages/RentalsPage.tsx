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

export const RentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rentalDate, setRentalDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      await api.post('/transactions/rental', {
        phoneNumber: phoneNumber.trim(),
        rentalDate: new Date(rentalDate).toISOString(),
        items: rentalItems.map(ri => ({
          itemId: ri.item.id,
          quantity: ri.quantity
        }))
      });
      setSuccess('Rental created successfully!');
      setRentalItems([]);
      setPhoneNumber('');
      setRentalDate(new Date().toISOString().split('T')[0]);
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
      {success && <div className="success-message">✅ {success}</div>}

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
                max={new Date().toISOString().split('T')[0]}
                required
              />
              <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                Due date will be automatically set to 7 days from rental date
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
    </div>
  );
};

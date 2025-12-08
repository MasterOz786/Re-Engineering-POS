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

interface CartItem {
  item: Item;
  quantity: number;
  unitPrice: number;
}

export const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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

  const addToCart = (item: Item) => {
    const existingItem = cart.find(c => c.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(c => 
        c.item.id === item.id 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, { item, quantity: 1, unitPrice: parseFloat(item.price) }]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c => 
        c.item.id === itemId ? { ...c, quantity } : c
      ));
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.06; // 6% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      await api.post('/transactions/sale', {
        items: cart.map(c => ({
          itemId: c.item.id,
          quantity: c.quantity,
          unitPrice: c.unitPrice
        }))
      });
      alert('Sale completed successfully!');
      setCart([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process sale');
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
        <h1>💰 Sales Transactions</h1>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="sales-layout">
        <div className="items-section">
          <h2>Available Items</h2>
          {loading ? (
            <div className="loading">Loading items...</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card" onClick={() => addToCart(item)}>
                  <div className="item-name">{item.name}</div>
                  <div className="item-code">{item.item_code}</div>
                  <div className="item-price">${parseFloat(item.price).toFixed(2)}</div>
                  <div className="item-stock">Stock: {item.quantity}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-section">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <div className="empty-cart">Cart is empty. Add items to get started!</div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-name">{cartItem.item.name}</div>
                      <div className="cart-item-price">${cartItem.unitPrice.toFixed(2)} each</div>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}>
                        -
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}>
                        +
                      </button>
                      <button className="remove-btn" onClick={() => removeFromCart(cartItem.item.id)}>
                        Remove
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(cartItem.unitPrice * cartItem.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (6%):</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Complete Sale'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

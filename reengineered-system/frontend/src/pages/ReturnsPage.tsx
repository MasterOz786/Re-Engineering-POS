import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PageStyles.css';

interface ReturnResult {
  rentalId: number;
  returnDate: string;
  lateFee: number;
  itemReturned: string;
}

export const ReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rentalId, setRentalId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<ReturnResult | null>(null);
  const [loadingRental, setLoadingRental] = useState(false);
  const [rentalInfo, setRentalInfo] = useState<any>(null);

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalId) {
      setError('Please enter a rental ID');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      const response = await api.post('/transactions/return', {
        rentalId: parseInt(rentalId)
      });
      setSuccess(response.data);
      setRentalId('');
      setRentalInfo(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process return');
    } finally {
      setProcessing(false);
    }
  };

  const lookupRental = async () => {
    if (!rentalId) {
      setError('Please enter a rental ID');
      return;
    }

    try {
      setLoadingRental(true);
      setError('');
      // Note: This would require a GET endpoint for rentals
      // For now, we'll just validate the ID format
      const id = parseInt(rentalId);
      if (isNaN(id) || id <= 0) {
        setError('Please enter a valid rental ID');
        return;
      }
      setRentalInfo({ id, message: 'Enter rental ID and click Process Return' });
    } catch (err: any) {
      setError('Could not find rental information');
    } finally {
      setLoadingRental(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>↩️ Return Processing</h1>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {success && (
        <div className="success-message" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            ✅ Return Processed Successfully!
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Rental ID:</strong> {success.rentalId}</div>
            <div><strong>Item Returned:</strong> {success.itemReturned}</div>
            <div><strong>Return Date:</strong> {new Date(success.returnDate).toLocaleDateString()}</div>
            {success.lateFee > 0 && (
              <div style={{ color: '#c53030', marginTop: '8px' }}>
                <strong>Late Fee:</strong> ${success.lateFee.toFixed(2)}
              </div>
            )}
            {success.lateFee === 0 && (
              <div style={{ color: '#22543d', marginTop: '8px' }}>
                ✓ No late fees - returned on time
              </div>
            )}
          </div>
        </div>
      )}

      <div className="return-form-container">
        <div className="form-card">
          <h2>Process Item Return</h2>
          <p style={{ color: '#718096', marginBottom: '20px', fontSize: '14px' }}>
            Enter the rental ID to process the return. Late fees will be calculated automatically.
          </p>
          <form onSubmit={handleProcessReturn}>
            <div className="form-group">
              <label>Rental ID *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={rentalId}
                  onChange={(e) => {
                    setRentalId(e.target.value);
                    setRentalInfo(null);
                    setError('');
                  }}
                  placeholder="Enter rental ID"
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="secondary-button"
                  onClick={lookupRental}
                  disabled={loadingRental || !rentalId}
                >
                  {loadingRental ? '...' : 'Lookup'}
                </button>
              </div>
              {rentalInfo && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#f0f4ff', borderRadius: '4px', fontSize: '12px' }}>
                  Ready to process return
                </div>
              )}
            </div>

            <div className="info-box" style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
              <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px' }}>Return Processing Details:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4a5568' }}>
                <li>Item will be returned to inventory automatically</li>
                <li>Late fees calculated at 10% of rental price per day overdue</li>
                <li>Return date is set to today automatically</li>
                <li>A return transaction will be created</li>
              </ul>
            </div>

            <button type="submit" className="primary-button" disabled={processing || !rentalId} style={{ width: '100%' }}>
              {processing ? 'Processing Return...' : 'Process Return'}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3>How Return Processing Works</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#4a5568' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#2d3748' }}>Step 1:</strong> Enter the rental ID from the rental receipt
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#2d3748' }}>Step 2:</strong> Click "Process Return" to complete the return
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#2d3748' }}>Automatic Processing:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Item is returned to inventory</li>
                <li>Late fees are calculated if overdue</li>
                <li>Return transaction is recorded</li>
                <li>Customer account is updated</li>
              </ul>
            </div>
            <div style={{ padding: '12px', background: '#fff5f5', borderRadius: '6px', border: '1px solid #fed7d7' }}>
              <strong style={{ color: '#c53030' }}>Late Fee Calculation:</strong>
              <div style={{ marginTop: '4px', fontSize: '13px' }}>
                10% of rental price × number of days overdue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

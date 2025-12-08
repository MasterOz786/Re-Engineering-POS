import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { authService } from '../services/authService';
import './PageStyles.css';

interface Employee {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  position: 'Admin' | 'Cashier';
  is_active: boolean;
  created_at: string;
}

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const isAdmin = authService.getCurrentUser()?.position === 'Admin';

  useEffect(() => {
    if (isAdmin) {
      loadEmployees();
    } else {
      setError('Only administrators can access employee management');
      setLoading(false);
    }
  }, [isAdmin]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setError('');
      await api.post('/employees', {
        username: formData.get('username'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        position: formData.get('position')
      });
      setSuccess('Employee created successfully!');
      setShowAddForm(false);
      e.currentTarget.reset();
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create employee');
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmployee) return;
    
    const formData = new FormData(e.currentTarget);
    try {
      setError('');
      await api.put(`/employees/${editingEmployee.id}`, {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        position: formData.get('position'),
        password: formData.get('password') || undefined
      });
      setSuccess('Employee updated successfully!');
      setEditingEmployee(null);
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this employee?')) {
      return;
    }

    try {
      setError('');
      await api.delete(`/employees/${id}`);
      setSuccess('Employee deactivated successfully!');
      loadEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to deactivate employee');
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>👥 Employee Management</h1>
        </div>
        <div className="error-message" style={{ margin: '20px 32px' }}>
          ⚠️ Access Denied: Only administrators can manage employees.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>👥 Employee Management</h1>
        <button className="primary-button" onClick={() => {
          setShowAddForm(!showAddForm);
          setEditingEmployee(null);
        }}>
          {showAddForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      {showAddForm && (
        <div className="form-card">
          <h2>Add New Employee</h2>
          <form onSubmit={handleAddEmployee}>
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input type="text" name="username" required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" required />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <select name="position" required>
                  <option value="Cashier">Cashier</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="primary-button">Add Employee</button>
          </form>
        </div>
      )}

      {editingEmployee && (
        <div className="form-card">
          <h2>Edit Employee</h2>
          <form onSubmit={handleUpdateEmployee}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={editingEmployee.username} disabled />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input type="password" name="password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" defaultValue={editingEmployee.first_name} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" defaultValue={editingEmployee.last_name} required />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <select name="position" defaultValue={editingEmployee.position} required>
                  <option value="Cashier">Cashier</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="primary-button">Update Employee</button>
              <button type="button" className="secondary-button" onClick={() => setEditingEmployee(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    No employees found. Add your first employee above!
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.username}</td>
                    <td>{employee.first_name} {employee.last_name}</td>
                    <td>
                      <span className={`badge ${employee.position === 'Admin' ? 'badge-admin' : 'badge-cashier'}`}>
                        {employee.position}
                      </span>
                    </td>
                    <td>
                      <span className={employee.is_active ? 'status-active' : 'status-inactive'}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="edit-button"
                          onClick={() => {
                            setEditingEmployee(employee);
                            setShowAddForm(false);
                          }}
                        >
                          Edit
                        </button>
                        {employee.is_active && (
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
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


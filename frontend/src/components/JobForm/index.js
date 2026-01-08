import React, { useState } from 'react';
import api from '../../api';
import './index.css';

function JobForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    taskName: '',
    priority: 'Medium',
    payload: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.payload.trim()) {
      const confirmEmpty = window.confirm(
        'You have not entered a payload. Do you want to proceed with an empty payload?'
      );
      if (!confirmEmpty) return;
    }

    setLoading(true);

    try {
      await api.post('/jobs', {
        taskName: formData.taskName.trim(),
        payload: formData.payload ? JSON.parse(formData.payload) : {},
        priority: formData.priority
      });

      setFormData({ taskName: '', priority: 'Medium', payload: '' });
      onSuccess();
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid JSON in payload. Check your syntax.');
      } else {
        setError('Failed to create job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobform-card">
      <h2 className="jobform-title">Create New Job</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="taskName"
          type="text"
          placeholder="Task name (e.g., Send weekly report)"
          value={formData.taskName}
          onChange={handleChange}
          className="input"
          required
          disabled={loading}
        />

        <div className="form-row">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="select"
            disabled={loading}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <textarea
            name="payload"
            placeholder='{"email": "user@example.com", "template": "weekly"}'
            value={formData.payload}
            onChange={handleChange}
            className="input textarea"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !formData.taskName.trim()}
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}

export default JobForm;

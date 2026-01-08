import React from 'react';
import './index.css';

function JobFilters({ filters, jobs, onFilterChange }) {
  const handleStatusChange = (e) => {
    onFilterChange({ 
      ...filters, 
      status: e.target.value 
    });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ 
      ...filters, 
      priority: e.target.value 
    });
  };

  const clearFilters = () => {
    onFilterChange({ status: '', priority: '' });
  };

  const pendingCount = jobs ? jobs.filter(j => j.status === 'pending').length : 0;

  return (
    <div className="filters-card">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Filter by Status</label>
          <select 
            value={filters.status} 
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Filter by Priority</label>
          <select 
            value={filters.priority} 
            onChange={handlePriorityChange}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <button
          className="clear-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default JobFilters;

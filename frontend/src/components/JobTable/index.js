import React from 'react';
import './index.css';  // ✅ Import CSS

function JobTable({ jobs, onRun, filters }) {
  const getStatusConfig = (status) => {
    const config = {
      pending: { bg: '#f3f4f6', text: '#6b7280', label: 'Pending' },
      running: { bg: '#dbeafe', text: '#2563eb', label: 'Running' },
      completed: { bg: '#dcfce7', text: '#059669', label: 'Completed' }
    };
    return config[status] || config.pending;
  };

  const getPriorityConfig = (priority) => {
    const config = {
      Low: { bg: '#d1fae5', text: '#059669' },
      Medium: { bg: '#fef3c7', text: '#d97706' },
      High: { bg: '#fecaca', text: '#dc2626' }
    };
    return config[priority] || config.Low;
  };

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state h3">No jobs found</div>
        <div className="empty-state p">
          {filters.status || filters.priority 
            ? 'Try adjusting your filters or create a new job above' 
            : 'Create your first job above to get started'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="job-table-container">
      <table className="job-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const statusConfig = getStatusConfig(job.status);
            const priorityConfig = getPriorityConfig(job.priority);
            
            return (
              <tr key={job.id}>
                <td className="id-cell">{job.id}</td>
                <td className="task-name">{job.taskName}</td>
                <td>
                  <span 
                    className="badge" 
                    style={{ backgroundColor: priorityConfig.bg, color: priorityConfig.text }}
                  >
                    {job.priority}
                  </span>
                </td>
                <td>
                  <span 
                    className="badge status-badge"
                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="date-cell">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="date-cell">
                  {new Date(job.createdAt).toLocaleTimeString()}
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                  {job.status !== 'running' && job.status !== 'completed' ? (
                    <button
                      className="run-btn"
                      onClick={() => onRun(job.id)}
                      disabled={job.status === 'running'}
                      style={{ transform: job.status === 'running' ? 'none' : undefined }}
                    >
                      Run
                    </button>
                  ) : (
                    <span className="status-text">
                      {job.status === 'running' ? 'Running...' : 'Done'}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;

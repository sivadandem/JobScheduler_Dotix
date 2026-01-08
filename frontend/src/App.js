import React, { useState, useEffect } from "react";
import JobForm from "./components/JobForm";
import JobTable from "./components/JobTable";
import JobFilters from "./components/JobFilters";
import api from "./api";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const response = await api.get(`/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  // ✅ FIXED: Full path /jobs/run-job/:id
  const handleRunJob = async (jobId) => {
    try {
      await api.post(`/jobs/run-job/${jobId}`);  // ✅ CORRECT FULL PATH!
      // Auto-refresh via useEffect (filters unchanged)
    } catch (error) {
      console.error("Run job error:", error);
    }
  };

  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Job Scheduler Dashboard</h1>
        <p className="text-gray-600">Create, run, and track background jobs</p>
      </header>

      <JobForm onSuccess={fetchJobs} />

      <div className="filters-section mb-6">
        <JobFilters
          filters={filters}
          jobs={jobs}
          onFilterChange={setFilters}
        />
      </div>

      <div className="jobs-section">
        {loading ? (
          <div className="card text-center py-12">
            <div className="loading">Loading jobs...</div>
          </div>
        ) : (
          <JobTable 
            jobs={jobs} 
            onRun={handleRunJob} 
            filters={filters}  // ✅ Passes to JobTable
          />
        )}
      </div>
    </div>
  );
}

export default App;

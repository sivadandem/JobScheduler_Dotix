# Job Scheduler & Automation System

**Dotix Technologies — Full Stack Developer Skill Test**  
**Stack:** React, Node.js, Express, MySQL, Webhook Integration

A mini automation engine that allows users to create background jobs, store them in a database, execute them manually, track their status, and automatically trigger a webhook when a job completes.  
This project fulfills all requirements of the **Dotix Job Scheduler & Automation System** assignment, including frontend dashboard, backend APIs, persistent storage, and webhook integration.

---

## Table of Contents

- Project Overview  
- Features  
- Architecture  
- Tech Stack  
- Database Design  
- API Documentation  
- Webhook Behaviour  
- Project Structure  
- Setup & Installation  
- How to Run Locally  
- Testing the Flow  
- Deployment Notes  
- Screenshots  
- AI Usage Disclosure  

---

## Project Overview

The Job Scheduler & Automation System simulates how real-world systems manage background tasks such as sending emails, generating reports, or synchronizing data between services.

Users can:
- Create jobs with a task name, JSON payload, and priority
- Execute jobs manually
- Track job lifecycle states
- Automatically notify external systems via webhook when a job completes

The goal of this project is to demonstrate **end-to-end full-stack development**, covering frontend UI, backend APIs, database persistence, asynchronous processing, and external integrations.

---

## Features

- Job creation with:
  - `taskName` (string)
  - `payload` (JSON)
  - `priority` (`Low`, `Medium`, `High`)
- Persistent storage using MySQL
- Job lifecycle management:
  - `pending → running → completed`
- Dashboard UI:
  - View all jobs
  - Filter by status and priority
  - View job details
  - Run jobs manually
- Job execution simulation:
  - 3-second background processing delay
- Automatic webhook trigger on job completion

---

## Architecture

### High-Level Design

- **Frontend (React)**
  - Job creation form
  - Dashboard table with filters
  - Job detail view
  - Communicates with backend via REST APIs

- **Backend (Node.js + Express)**
  - REST endpoints for job creation, listing, execution
  - Simulated background job processing
  - Webhook triggering logic

- **Database (MySQL)**
  - Stores job metadata, payload, and status

- **Webhook Receiver**
  - External service (e.g., webhook.site) to receive job completion events

### Data Flow

User (Browser)  
↓  
React Frontend  
↓ HTTP  
Express Backend  
↓ SQL  
MySQL Database  
↓ HTTP  
Webhook Endpoint

---

## Tech Stack

| Layer       | Tools / Libraries |
|------------|------------------|
| Frontend   | React, Axios /|
| Backend    | Node.js, Express |
| Database   | MySQL |
| Dev Tools  | Nodemon, dotenv, Postman, Git, npm |
| Webhooks   | webhook.site |

---

## Database Design

### Database

```sql
CREATE DATABASE job_scheduler;
USE job_scheduler;

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskName VARCHAR(255) NOT NULL,
  payload JSON,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

```

### Field Descriptions

- **taskName** – A human-readable name that identifies the job
- **payload** – Flexible JSON data associated with the job
- **priority** – Job priority level (`Low`, `Medium`, `High`)
- **status** – Current job status (`pending`, `running`, `completed`)
- **timestamps** – Tracks job creation and last update times

> Indexes on `status` and `priority` can be added to improve query performance.


<h2>API Documentation</h2>

<h3>Base URL (Local)</h3>
<pre><code>http://localhost:3001</code></pre>

<hr />

<h2>1. Create Job</h2>

<h3>Endpoint</h3>
<pre><code>POST /jobs</code></pre>

<h3>Request Body</h3>
<pre><code class="language-json">
{
  "taskName": "Send Email",
  "payload": { "email": "a@b.com" },
  "priority": "High"
}
</code></pre>

<h3>Behavior</h3>
<ul>
  <li>Validates required fields</li>
  <li>Stores the job with status set to <code>pending</code></li>
</ul>

<h3>Response</h3>
<pre><code class="language-json">
{
  "message": "Job created successfully",
  "jobId": 1
}
</code></pre>

<hr />

<h2>2. List Jobs</h2>

<h3>Endpoint</h3>
<pre><code>GET /jobs</code></pre>

<h3>Query Parameters (Optional)</h3>
<ul>
  <li><strong>status</strong> – Filter by job status</li>
  <li><strong>priority</strong> – Filter by job priority</li>
</ul>

<h3>Example</h3>
<pre><code>GET /jobs?status=pending&amp;priority=High</code></pre>

<hr />

<h2>3. Job Details</h2>

<h3>Endpoint</h3>
<pre><code>GET /jobs/:id</code></pre>

<h3>Response</h3>
<pre><code class="language-json">
{
  "id": 1,
  "taskName": "Send Email",
  "payload": { "email": "a@b.com" },
  "priority": "High",
  "status": "completed",
  "createdAt": "2026-01-08T10:00:00.000Z",
  "updatedAt": "2026-01-08T10:00:10.000Z"
}
</code></pre>

<hr />

<h2>4. Run Job</h2>

<h3>Endpoint</h3>
<pre><code>POST /jobs/run-job/:id</code></pre>

<h3>Execution Flow</h3>
<ol>
  <li>Validate that the job exists</li>
  <li>Update job status to <code>running</code></li>
  <li>Simulate background work (3 seconds)</li>
  <li>Update job status to <code>completed</code></li>
  <li>Trigger webhook</li>
</ol>

<hr />

<h2>Webhook Behavior</h2>

<ul>
  <li>Webhook is triggered only when a job is completed</li>
  <li>An HTTP <strong>POST</strong> request is sent to <code>WEBHOOK_URL</code></li>
</ul>

<h3>Webhook Payload Example</h3>
<pre><code class="language-json">
{
  "jobId": 1,
  "taskName": "Send Email",
  "priority": "High",
  "payload": { "email": "a@b.com" },
  "completedAt": "2026-01-08T10:00:03.000Z"
}
</code></pre>

<h3>Webhook.site Behavior</h3>
<ul>
  <li><strong>GET</strong> requests – Manual browser visits</li>
  <li><strong>POST</strong> requests – Actual backend webhook calls</li>
</ul>

---
### Project Structure


``` dir
root-project/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   └── components/
│   │       ├── JobForm/index.js &index.css
│   │       ├── JobTable/index.js &index.css
│   │       └── JobFilters/index.js &index.css
│   ├── public/
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── jobs.js
│   ├── databaseconfig.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── screenshots/
│   ├── dashboard.png
│   ├── create-job.png
│   ├── webhook.png
│   └── detail-view.png
├── package.json        # Root scripts: install:all, dev
└── README.md
```


<h2>Setup &amp; Installation</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js (v18+)</li>
  <li>MySQL (or access to a MySQL server)</li>
  <li>npm</li>
  <li>Postman (optional, for API testing)</li>
  <li>A test webhook URL from <a href="https://webhook.site" target="_blank">https://webhook.site</a></li>
</ul>

<hr />

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/sivadandem/JobScheduler_Dotix.git
cd job-scheduler-dotix</code></pre>

<hr />

<h3>2. Install Dependencies (Root + Apps)</h3>

<p>Root <code>package.json</code> can contain scripts like:</p>

<pre><code class="language-json">
{
  "name": "job-scheduler-dotix",
  "version": "1.0.0",
  "scripts": {
    "install:all": "npm install --prefix backend && npm install --prefix frontend",
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\"",
    "start": "npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

</code></pre>

<p>Install dependencies:</p>
<pre><code>npm install
npm run install:all</code></pre>

<hr />

<h3>3. Configure Environment Variables</h3>

<p>Create <code>backend/.env</code> file:</p>

<pre><code>
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=job_scheduler
WEBHOOK_URL=https://webhook.site/your-unique-id
</code></pre>

<hr />

<h3>4. Setup Database</h3>
<p>In databaseconfig.js file , Database+ Table</p>
<pre><code>
CREATE DATABASE job_scheduler;
USE job_scheduler;

---
CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        taskName VARCHAR(255) NOT NULL,
        payload JSON,
        priority VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      )
</code></pre>



<p>Then run the <code>CREATE TABLE jobs</code> statement from the Database Design section.</p>

<hr />

<h2>How to Run Locally</h2>

<p>From the project root:</p>

<pre><code>npm run dev</code></pre>

<ul>
  <li>Backend: <code>http://localhost:3001</code></li>
  <li>Frontend: <code>http://localhost:3000</code></li>
</ul>

<hr />

<h2>Testing the Flow</h2>

<h3>Open Dashboard</h3>
<p>
Visit <code>http://localhost:3000</code>.  
On first load, the jobs table may be empty (GET /jobs).
</p>

<h3>Create a Job</h3>
<p>Fill the form with:</p>
<ul>
  <li><strong>taskName:</strong> Send Newsletter</li>
  <li><strong>priority:</strong> High</li>
  <li><strong>payload:</strong> {"emails":["a@b.com","c@d.com"]}</li>
</ul>
<p>
Click <strong>Create Job</strong>.  
This calls <code>POST /jobs</code> and the job appears as <code>pending</code>.
</p>

<h3>Filter Jobs</h3>
<p>
Use dropdown filters for status and priority.  
This triggers <code>GET /jobs?status=...&amp;priority=...</code>.
</p>

<h3>Run a Job</h3>
<p>
Click the <strong>Run</strong> button on a pending job.
</p>
<ul>
  <li>Frontend calls <code>POST /jobs/run-job/:id</code></li>
  <li>Status updates to <code>running</code></li>
  <li>After 3 seconds, status updates to <code>completed</code></li>
  <li>Webhook is triggered automatically</li>
</ul>

<h3>Verify Webhook</h3>
<p>
Open your <code>WEBHOOK_URL</code> on webhook.site.
</p>
<p>
Look for a new <strong>POST</strong> entry containing the job JSON payload.  
This confirms end-to-end integration.
</p>

<h3>View Job Details</h3>
<p>
Click a job row or navigate to <code>/jobs/:id</code> in the frontend (if implemented).
</p>
<p>
Frontend calls <code>GET /jobs/:id</code> and displays formatted JSON payload and timestamps.
</p>

<hr />



<h2>Screenshots</h2>
<ul>
  <li><code>screenshots/dashboard.png</code> – Job table with filters and statuses</li>
  <li><code>screenshots/create-job.png</code> – Create job form</li>
  <li><code>screenshots/detail-view.png</code> – Job detail view with formatted JSON</li>
  <li><code>screenshots/webhook.png</code> – webhook.site POST payload view</li>
</ul>

<hr />

<h2>AI Usage Disclosure</h2>

<p>
This project used AI tools as permitted by the Dotix assignment.  
All AI-generated content was reviewed, understood, and modified before final use.
</p>

<table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr>
      <th>Tool</th>
      <th>Model</th>
      <th>Used For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Perplexity</td>
      <td>2026 Model</td>
      <td>Requirement clarification, webhook logic, README structure</td>
    </tr>
    <tr>
      <td>ChatGPT</td>
      <td>GPT-4 class</td>
      <td>UI suggestions, documentation refinement</td>
    </tr>
  </tbody>
</table>

<h3>Scope of AI Usage</h3>
<ul>
  <li>Confirmed understanding of assignment requirements</li>
  <li>Suggested example code and documentation structure</li>
  <li>Final implementation, database schema, and testing were done manually</li>
</ul>

<hr />

<h2>Prerequisites &amp; Notes</h2>

<ul>
  <li>Basic knowledge of JavaScript, React, Node.js, and SQL is assumed</li>
  <li>Postman is useful for API verification before frontend integration</li>
  <li>Webhook testing uses webhook.site and requires no login</li>
</ul>

const express = require('express');
const pool = require('../databaseconfig');
const router = express.Router();

// 1. CREATE job (POST /jobs)
router.post('/', async (req, res) => {
  try {
    const { taskName, payload, priority } = req.body;
    
    if (!taskName || !priority) {
      return res.status(400).json({ error: 'taskName and priority required' });
    }

    const result = await pool.execute(
      'INSERT INTO jobs (taskName, payload, priority) VALUES (?, ?, ?)',
      [taskName, JSON.stringify(payload || {}), priority]
    );

    const [job] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [result[0].insertId]);
    res.status(201).json(job[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LIST jobs (GET /jobs?status=pending&priority=High)
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    let sql = 'SELECT * FROM jobs';
    const params = [];

    if (status || priority) {
      sql += ' WHERE ';
      if (status) {
        sql += 'status = ?';
        params.push(status);
      }
      if (priority) {
        sql += params.length ? ' AND ' : '';
        sql += 'priority = ?';
        params.push(priority);
      }
    }

    sql += ' ORDER BY createdAt ASC';
    const [jobs] = await pool.execute(sql, params);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET single job (GET /jobs/:id)
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(jobs[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. RUN job (POST /jobs/run/:id) ✅ FIXED
router.post('/run/:id', async (req, res) => {  // ✅ /run/:id instead of /run-job/:id
  try {
    const jobId = req.params.id;
    
    // Check exists + pending
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ error: 'Job not found' });
    if (jobs[0].status !== 'pending') return res.status(400).json({ error: 'Job already processed' });
    
    // Start running
    await pool.execute('UPDATE jobs SET status = "running" WHERE id = ?', [jobId]);
    res.json({ message: 'Job started' });
    
    // Simulate 3s work + webhook ✅ FIXED: 3000ms
    setTimeout(async () => {
      await pool.execute('UPDATE jobs SET status = "completed" WHERE id = ?', [jobId]);
      
      const [completedJob] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completedJob[0])
        });
        console.log('✅ Webhook sent!');
      } catch (e) {
        console.log('Webhook failed:', e.message);
      }
    }, 3000);  // ✅ 3 seconds
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

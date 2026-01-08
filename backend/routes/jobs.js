const express = require('express');
const pool = require('../databaseconfig');
const router = express.Router();

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

    sql += ' ORDER BY createdAt DESC';
    const [jobs] = await pool.execute(sql, params);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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


router.post('/run-job/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ error: 'Job not found' });
    if (jobs[0].status !== 'pending') return res.status(400).json({ error: 'Job already processed' });
    

    await pool.execute('UPDATE jobs SET status = "running" WHERE id = ?', [jobId]);
    res.json({ message: 'Job started' });
    
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
    }, 3000);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

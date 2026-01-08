require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jobsRouter = require('./routes/jobs');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/jobs', jobsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

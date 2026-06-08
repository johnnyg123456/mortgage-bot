require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mortgage Bot',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/arive-webhook',
      'GET  /api/gmail-watch'
    ]
  });
});

// Local stubs for API routes (Vercel functions run as serverless in prod)
app.post('/api/arive-webhook', (req, res) => {
  const handler = require('./api/arive-webhook');
  handler(req, res);
});

app.get('/api/gmail-watch', (req, res) => {
  const handler = require('./api/gmail-watch');
  handler(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Mortgage Bot running on http://localhost:${PORT}`);
});

import 'dotenv/config';
import express from 'express';
import welcomeHandler from './api/send-welcome.js';
import eventHandler from './api/send-event.js';
import testimonyHandler from './api/send-testimony.js';

const app = express();
app.use(express.json());

// Mock Vercel response helper
const mockRes = (res) => ({
  status: (code) => ({
    json: (data) => res.status(code).json(data),
  }),
});

app.post('/api/send-welcome', (req, res) => welcomeHandler(req, mockRes(res)));
app.post('/api/send-event', (req, res) => eventHandler(req, mockRes(res)));
app.post('/api/send-testimony', (req, res) => testimonyHandler(req, mockRes(res)));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Local test server running at http://localhost:${PORT}`);
  console.log(`Use this to test emails without Vercel CLI!`);
});

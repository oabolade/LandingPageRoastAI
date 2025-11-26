import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import emailRouter from './routes/email.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('bolt.new')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Backend API Server',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    },
    note: 'Frontend is available at http://localhost:5173'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', analyzeRouter);
app.use('/api', emailRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`[BACKEND] Running on http://localhost:${PORT}`);
  console.log(`[BACKEND] Health check: http://localhost:${PORT}/health`);
  console.log(`[BACKEND] API endpoints: http://localhost:${PORT}/api`);
  console.log('\n[FRONTEND] should be running on http://localhost:5173');
  console.log('========================================\n');
});

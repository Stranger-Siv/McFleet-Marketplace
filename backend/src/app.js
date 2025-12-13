import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Health check endpoint (public, no auth required)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Keep-alive endpoint (public, no auth required)
app.get('/ping', (req, res) => {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);

export default app;


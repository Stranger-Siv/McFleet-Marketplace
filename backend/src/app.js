import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// CORS configuration - only allow requests from frontend domain
const corsOptions = {
  origin: [
    'https://mcfleet.shop',
    'https://www.mcfleet.shop',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

export default app;


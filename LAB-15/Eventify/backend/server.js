import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import events from './routes/events.js';
import bookings from './routes/bookings.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => { console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`); next(); });
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Eventify API is running.' }));
app.use('/api/events', events);
app.use('/api/bookings', bookings);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`Eventify API listening on ${port}`))).catch(error => { console.error(error.message); process.exit(1); });

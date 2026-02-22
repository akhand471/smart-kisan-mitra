require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ─── Route imports ─────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cropRoutes = require('./routes/cropRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const mandiRoutes = require('./routes/mandiRoutes');

// ─── Connect to MongoDB ────────────────────────────────────────────────────
connectDB();

// ─── App setup ─────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🌾 Smart Kisan Mitra API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            expenses: '/api/expenses',
            crop: '/api/crop/calculate',
            weather: '/api/weather',
            mandi: '/api/mandi',
        },
    });
});

// ─── Mount routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/mandi', mandiRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ─── Central error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
// const PORT = 8000;
const server = app.listen(PORT, () => {
    console.log('');
    console.log('🌾 ═══════════════════════════════════════════════');
    console.log(`   Smart Kisan Mitra API`);
    console.log(`   Running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

// ─── Handle unhandled promise rejections ───────────────────────────────────
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports = app;

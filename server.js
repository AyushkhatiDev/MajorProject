const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true
}));

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listing');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-listing')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Serve static files and handle React routing in production
if (process.env.NODE_ENV === 'production') {
    // Render specific path
    const buildPath = process.env.RENDER ? '/opt/render/project/src/client/build' : path.join(__dirname, 'client', 'build');
    console.log('Build path:', buildPath);

    // Serve static files
    app.use(express.static(buildPath));
    
    // Handle React routing
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
            return next();
        }

        const indexPath = path.join(buildPath, 'index.html');
        console.log('Trying to serve:', indexPath);
        
        res.sendFile(indexPath, err => {
            if (err) {
                console.error('Error serving index.html:', err);
                res.status(500).json({
                    error: 'Error loading application',
                    details: err.message,
                    path: indexPath
                });
            }
        });
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode');
    });
}

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log('Build path:', process.env.RENDER ? '/opt/render/project/src/client/build' : path.join(__dirname, 'client', 'build'));
});

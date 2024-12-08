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
    // Set static folder
    const buildPath = path.join(__dirname, './client/build');
    
    // Verify if build directory exists
    const fs = require('fs');
    if (!fs.existsSync(buildPath)) {
        console.error('Build directory not found:', buildPath);
        fs.mkdirSync(buildPath, { recursive: true });
    }
    
    app.use(express.static(buildPath));
    
    app.get('*', (req, res, next) => {
        // Check if the request is for an API route
        if (req.url.startsWith('/api/')) {
            return next();
        }
        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error loading application');
            }
        });
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Error Handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

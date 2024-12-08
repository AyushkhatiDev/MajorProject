const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
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
    // Define build paths
    const clientBuildPath = path.resolve(__dirname, 'client', 'build');
    const indexHtml = path.join(clientBuildPath, 'index.html');

    // Log the paths for debugging
    console.log('Client Build Path:', clientBuildPath);
    console.log('Index.html Path:', indexHtml);

    // Check if build directory exists
    if (!fs.existsSync(clientBuildPath)) {
        console.error('Build directory not found at:', clientBuildPath);
        // Create build directory if it doesn't exist
        try {
            fs.mkdirSync(clientBuildPath, { recursive: true });
            console.log('Created build directory at:', clientBuildPath);
        } catch (err) {
            console.error('Failed to create build directory:', err);
        }
    }

    // Check if index.html exists
    if (!fs.existsSync(indexHtml)) {
        console.error('index.html not found at:', indexHtml);
    } else {
        console.log('index.html found at:', indexHtml);
    }

    // Serve static files
    app.use(express.static(clientBuildPath));

    // Handle React routing
    app.get('*', (req, res, next) => {
        if (req.url.startsWith('/api/')) {
            return next();
        }

        // Send index.html with error handling
        res.sendFile(indexHtml, (err) => {
            if (err) {
                console.error('Error sending index.html:', err);
                res.status(500).send('Error loading application. Build files not found.');
            }
        });
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).json({ 
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
});

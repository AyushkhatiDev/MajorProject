#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Print current directory
pwd

# Install dependencies for the server
echo "Installing server dependencies..."
npm install

# Navigate to client directory and install dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the React app
echo "Building React application..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "Build directory exists"
    if [ -f "build/index.html" ]; then
        echo "index.html exists in build directory"
    else
        echo "Error: index.html not found in build directory"
        exit 1
    fi
else
    echo "Error: build directory not found"
    exit 1
fi

# Navigate back to root
cd ..

# Start the server
echo "Starting server..."
npm start

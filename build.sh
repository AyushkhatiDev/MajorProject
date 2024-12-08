#!/bin/bash

# Exit on error
set -e

# Install dependencies for the server
npm install

# Navigate to client directory and install dependencies
cd client
npm install

# Build the React app
npm run build

# Navigate back to root
cd ..

# Start the server
npm start

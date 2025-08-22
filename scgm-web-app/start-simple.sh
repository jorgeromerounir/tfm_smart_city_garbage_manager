#!/bin/bash

echo "🚀 Starting Urban Waste Monitoring System (Simple Mode)..."
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "sensor-simulator/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

echo "Starting services individually..."
echo ""
echo "1. Backend: http://localhost:3001"
echo "2. Frontend: http://localhost:3000"
echo "3. Sensor Simulator: Sending data every 30s"
echo ""
echo "Open 3 terminals and run:"
echo "Terminal 1: cd backend && npm run start:dev"
echo "Terminal 2: cd frontend && npm run dev"
echo "Terminal 3: cd sensor-simulator && npm start"
echo ""
echo "Or use: npm run dev (requires 'concurrently' package)"
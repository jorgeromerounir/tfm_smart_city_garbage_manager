#!/bin/bash

echo "🚀 Starting Urban Waste Monitoring System..."
echo ""

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL & RabbitMQ)..."
docker compose up -d
echo "Waiting for databases to be ready..."
sleep 10

# Check if all dependencies are installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "sensor-simulator/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

echo "🔧 Starting all services..."
echo ""
echo "Backend (NestJS) will run on: http://localhost:3001"
echo "Frontend (React) will run on: http://localhost:3000"
echo "Auth Service (Spring Boot) will run on: http://localhost:8081"
echo "Accounts Service (Spring Boot) will run on: http://localhost:8082"
echo "PostgreSQL will run on: localhost:5432"
echo "RabbitMQ Management will run on: http://localhost:15672"
echo "Sensor simulator will start sending data every 30 seconds"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start Node.js services
npm run dev &

wait
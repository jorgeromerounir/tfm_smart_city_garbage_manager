#!/bin/bash

echo "🚀 Starting UWM Microservices..."
echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
docker compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 15

# Start Java services in separate terminals
echo "🔧 Starting Java microservices..."

# Auth Service
gnome-terminal --title="Auth Service" -- bash -c "cd auth-service && mvn spring-boot:run; exec bash"

# Accounts Service  
gnome-terminal --title="Accounts Service" -- bash -c "cd accounts-service && mvn spring-boot:run; exec bash"

# Node.js services
gnome-terminal --title="Backend" -- bash -c "cd backend && npm run start:dev; exec bash"
gnome-terminal --title="Frontend" -- bash -c "cd frontend && npm run dev; exec bash"
gnome-terminal --title="Sensor Simulator" -- bash -c "cd sensor-simulator && npm start; exec bash"

echo ""
echo "✅ All services started in separate terminals!"
echo ""
echo "Services running on:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:3001"
echo "- Auth Service: http://localhost:8081"
echo "- Accounts Service: http://localhost:8082"
echo "- RabbitMQ Management: http://localhost:15672"
echo ""
echo "To stop Docker services: docker compose down"
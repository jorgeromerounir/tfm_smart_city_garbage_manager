#!/bin/bash

echo "Waiting for accounts service to be ready..."

# Wait for accounts service to be available
for i in {1..30}; do
  if curl -s http://localhost:8082/accounts > /dev/null 2>&1; then
    echo "Accounts service is ready!"
    break
  fi
  echo "Waiting... ($i/30)"
  sleep 2
done

echo "Creating initial ADMIN user..."

response=$(curl -s -w "%{http_code}" -X POST http://localhost:8082/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator",
    "email": "admin@uwm.com",
    "password": "admin123",
    "profile": "ADMIN"
  }')

http_code=${response: -3}
if [ "$http_code" -eq 201 ]; then
  echo ""
  echo "✅ ADMIN user created successfully!"
  echo "Email: admin@uwm.com"
  echo "Password: admin123"
else
  echo ""
  echo "❌ Failed to create ADMIN user (HTTP $http_code)"
  echo "Service may not be running or user may already exist"
fi
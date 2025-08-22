#!/bin/bash

echo "🔧 Creating supervisor user..."

# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8081/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uwm.com","password":"admin123"}' | \
  grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# Create supervisor user
curl -X POST http://localhost:8082/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@uwm.com",
    "password": "supervisor123",
    "profile": "SUPERVISOR",
    "country": "Colombia"
  }'

echo ""
echo "✅ Supervisor user created successfully!"
echo "Email: john.doe@uwm.com"
echo "Password: supervisor123"
echo "Country: Colombia"
echo ""
echo "🔄 User should now be synchronized to auth service via RabbitMQ"
echo "You can now login with these credentials"
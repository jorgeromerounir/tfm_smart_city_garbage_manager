#!/bin/bash

echo "🔧 Updating user countries..."

# Update john.doe@uwm.com to be associated with Colombia
curl -X PUT http://localhost:8082/accounts/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:8081/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@uwm.com","password":"admin123"}' | \
    grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@uwm.com", 
    "profile": "SUPERVISOR",
    "country": "Colombia"
  }'

echo ""
echo "✅ User country updated successfully!"
echo "john.doe@uwm.com is now associated with Colombia and will see Bogotá D.C. containers"
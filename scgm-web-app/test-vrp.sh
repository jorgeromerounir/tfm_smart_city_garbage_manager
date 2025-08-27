#!/bin/bash

echo "Testing VRP Route Optimization..."

# Test route optimization for Bogotá
curl -X POST http://localhost:3001/routes/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "startLat": 4.6097,
    "startLng": -74.0817,
    "endLat": 4.6097,
    "endLng": -74.0817,
    "city": "Bogotá D.C., Colombia"
  }' | jq '.'

echo -e "\n\nTesting truck listing..."

# Test truck listing
curl -X GET "http://localhost:3001/routes/trucks?city=Bogotá D.C., Colombia" | jq '.'

echo -e "\n\nVRP testing completed!"
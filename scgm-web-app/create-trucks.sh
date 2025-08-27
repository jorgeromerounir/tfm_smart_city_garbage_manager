#!/bin/bash

echo "Creating sample trucks..."

# Bogotá trucks
curl -X POST http://localhost:3001/routes/trucks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Truck Bogotá 001",
    "licensePlate": "BOG-001",
    "capacity": 5.0,
    "city": "Bogotá D.C., Colombia"
  }'

curl -X POST http://localhost:3001/routes/trucks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Truck Bogotá 002",
    "licensePlate": "BOG-002", 
    "capacity": 7.5,
    "city": "Bogotá D.C., Colombia"
  }'

# Madrid trucks
curl -X POST http://localhost:3001/routes/trucks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Truck Madrid 001",
    "licensePlate": "MAD-001",
    "capacity": 6.0,
    "city": "Madrid, Spain"
  }'

curl -X POST http://localhost:3001/routes/trucks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Truck Madrid 002",
    "licensePlate": "MAD-002",
    "capacity": 8.0,
    "city": "Madrid, Spain"
  }'

echo "Sample trucks created successfully!"

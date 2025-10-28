#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Testing get habit with invalid ID (should return 404)..."
curl -X GET "http://localhost:3000/api/habits/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer $TOKEN"
echo ""


#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Testing list habits with filter (frequency=Semanal)..."
curl -X GET "http://localhost:3000/api/habits?frequency=Semanal" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""
echo "Testing list habits with filter (isActive=true)..."
curl -X GET "http://localhost:3000/api/habits?isActive=true" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""
echo "Testing list habits with filter (name=Academia)..."
curl -X GET "http://localhost:3000/api/habits?name=Academia" \
  -H "Authorization: Bearer $TOKEN"
echo ""


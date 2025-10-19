#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Testing protected route with valid token..."
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer $TOKEN"

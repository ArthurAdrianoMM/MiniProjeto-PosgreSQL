#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Testing create habit..."
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Academia",
    "description": "Treino de musculação 3x por semana",
    "frequency": "Semanal"
  }'
echo ""


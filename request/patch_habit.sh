#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get the habit ID
echo "Please provide the habit ID to update:"
read HABIT_ID

echo "Testing patch habit (PATCH) - partial update..."
curl -X PATCH "http://localhost:3000/api/habits/$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Descrição atualizada via PATCH",
    "isActive": false
  }'
echo ""


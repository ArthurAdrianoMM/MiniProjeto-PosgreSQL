#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get the first habit ID (you need to replace this with an actual ID from your database)
echo "Please provide the habit ID (get it from list_habits.sh response):"
read HABIT_ID

echo "Testing get habit by ID..."
curl -X GET "http://localhost:3000/api/habits/$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""


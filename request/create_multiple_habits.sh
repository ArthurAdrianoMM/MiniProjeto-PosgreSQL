#!/bin/bash

# First, get a valid token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Creating multiple habits for testing..."
echo ""

# Create Academia habit
echo "1. Creating 'Academia' habit..."
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Academia",
    "description": "Treino de musculação 3x por semana",
    "frequency": "Semanal"
  }'
echo ""
echo ""

# Create Meditação habit
echo "2. Creating 'Meditação' habit..."
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meditação",
    "description": "Praticar meditação diariamente pela manhã",
    "frequency": "Diário"
  }'
echo ""
echo ""

# Create Leitura habit
echo "3. Creating 'Leitura' habit..."
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leitura",
    "description": "Ler 30 minutos por dia",
    "frequency": "Diário"
  }'
echo ""
echo ""

# Create Exercício Cardio habit
echo "4. Creating 'Exercício Cardio' habit..."
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Exercício Cardio",
    "description": "Corrida ou caminhada 2x por semana",
    "frequency": "Semanal"
  }'
echo ""
echo ""

echo "All habits created successfully!"
echo "Use './request/list_habits.sh' to see all your habits."


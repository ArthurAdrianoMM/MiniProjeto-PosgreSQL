#!/bin/bash

echo "Testing protected route with invalid token..."
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer invalidtoken123"

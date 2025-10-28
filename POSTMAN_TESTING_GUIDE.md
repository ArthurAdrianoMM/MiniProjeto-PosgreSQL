# Postman Testing Guide - Habits API

This guide provides complete examples for testing all endpoints using Postman.

## 🔑 Getting Started

### Step 1: Get an Authentication Token

#### Endpoint: POST http://localhost:3000/api/login

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login realizado com sucesso"
}
```

**Copy the token** - you'll need it for all protected routes.

---

## 🎯 Habits Endpoints

### 1. Create a Habit (POST)

**Endpoint:** `POST http://localhost:3000/api/habits`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "message": "Hábito criado com sucesso"
}
```

**Other examples:**
```json
{
  "name": "Meditação",
  "description": "Praticar meditação diariamente",
  "frequency": "Diário"
}
```

```json
{
  "name": "Leitura",
  "description": "Ler 30 minutos por dia",
  "frequency": "Diário"
}
```

---

### 2. List All Habits (GET)

**Endpoint:** `GET http://localhost:3000/api/habits`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "habits": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Academia",
      "description": "Treino de musculação 3x por semana",
      "frequency": "Semanal",
      "isActive": true,
      "userId": "507f191e810c19729de860ea",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Meditação",
      "description": "Praticar meditação diariamente",
      "frequency": "Diário",
      "isActive": true,
      "userId": "507f191e810c19729de860ea",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ],
  "count": 2,
  "message": "Hábitos listados com sucesso"
}
```

---

### 3. List Habits with Filters (GET with Query Params)

#### Filter by Active Status
**Endpoint:** `GET http://localhost:3000/api/habits?isActive=true`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Filters available:**
- `?isActive=true` - Only active habits
- `?isActive=false` - Only inactive habits
- `?frequency=Semanal` - Filter by frequency
- `?frequency=Diário` - Filter by frequency
- `?name=Academia` - Search by name (partial match)
- `?name=Medita` - Search by name (partial match)

#### Multiple Filters
**Endpoint:** `GET http://localhost:3000/api/habits?isActive=true&frequency=Diário`

---

### 4. Get Habit by ID (GET)

**Endpoint:** `GET http://localhost:3000/api/habits/YOUR_HABIT_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```
GET http://localhost:3000/api/habits/507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Hábito não encontrado"
}
```

**Error Response (403 Forbidden) - Trying to access another user's habit:**
```json
{
  "error": "Você não tem permissão para acessar este recurso"
}
```

---

### 5. Update Habit Completely (PUT)

**Endpoint:** `PUT http://localhost:3000/api/habits/YOUR_HABIT_ID`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "name": "Academia - Atualizado",
  "description": "Treino de musculação 4x por semana",
  "frequency": "Semanal",
  "isActive": true
}
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia - Atualizado",
  "description": "Treino de musculação 4x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:45:00.000Z",
  "message": "Hábito atualizado com sucesso"
}
```

---

### 6. Update Habit Partially (PATCH)

**Endpoint:** `PATCH http://localhost:3000/api/habits/YOUR_HABIT_ID`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON) - Update only specific fields:**
```json
{
  "description": "Nova descrição atualizada",
  "isActive": false
}
```

**Other examples:**
```json
{
  "name": "Meditação Matinal"
}
```

```json
{
  "frequency": "Quinzenal"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Nova descrição atualizada",
  "frequency": "Semanal",
  "isActive": false,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:50:00.000Z",
  "message": "Hábito atualizado com sucesso"
}
```

---

### 7. Delete Habit (DELETE)

**Endpoint:** `DELETE http://localhost:3000/api/habits/YOUR_HABIT_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```
DELETE http://localhost:3000/api/habits/507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "message": "Hábito deletado com sucesso",
  "id": "507f1f77bcf86cd799439011"
}
```

---

## 🔐 Authentication Endpoints (for reference)

### Register User
**Endpoint:** `POST http://localhost:3000/api/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Get Protected Route (to test auth)
**Endpoint:** `GET http://localhost:3000/api/protected`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get User Profile
**Endpoint:** `GET http://localhost:3000/api/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 Postman Collection Setup

### Quick Setup Steps:

1. **Install Postman** (if not already installed)

2. **Create a new Environment:**
   - Click "Environments" → "Create Environment"
   - Name: "Local Development"
   - Add variable `baseUrl` = `http://localhost:3000`
   - Add variable `token` = (leave empty, will be set automatically)

3. **Create a new Collection:**
   - Name: "Habits API"
   - Add the requests below

4. **Set up Authorization Script for Login:**
   - Go to the Login request
   - Tab: Tests
   - Add this script:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
   }
   ```

5. **Add Authorization to all protected requests:**
   - Tab: Authorization
   - Type: Bearer Token
   - Token: `{{token}}`

---

## 🧪 Complete Request List for Postman

### Public Endpoints

1. **POST** `/api/register` - Register new user
2. **POST** `/api/login` - Login (saves token to environment)

### Protected Endpoints (require Bearer token)

3. **GET** `/api/protected` - Test authentication
4. **GET** `/api/profile` - Get user profile

### Habits CRUD Endpoints (all require Bearer token)

5. **POST** `/api/habits` - Create habit
6. **GET** `/api/habits` - List all habits
7. **GET** `/api/habits?isActive=true` - List with filter
8. **GET** `/api/habits?frequency=Semanal` - List with filter
9. **GET** `/api/habits/:id` - Get habit by ID
10. **PUT** `/api/habits/:id` - Update habit (complete)
11. **PATCH** `/api/habits/:id` - Update habit (partial)
12. **DELETE** `/api/habits/:id` - Delete habit

---

## 🎯 Testing Scenarios

### Scenario 1: Full CRUD Flow
1. Login to get token
2. Create a new habit (save the ID from response)
3. List all habits (verify your new habit appears)
4. Get the habit by ID
5. Update the habit completely (PUT)
6. Update the habit partially (PATCH)
7. Delete the habit
8. List all habits (verify it's gone)

### Scenario 2: Test Filters
1. Login
2. Create multiple habits with different frequencies
3. List with filter `?frequency=Diário`
4. List with filter `?frequency=Semanal`
5. List with filter `?isActive=true`
6. List with filter `?name=Academia`

### Scenario 3: Test Authorization
1. Login as User A
2. Create a habit (save the ID)
3. Login as User B
4. Try to GET habit from User A (should return 403 Forbidden)
5. Try to UPDATE habit from User A (should return 403 Forbidden)
6. Try to DELETE habit from User A (should return 403 Forbidden)

### Scenario 4: Test Validation Errors
1. Login
2. Try to create habit with empty name (400 Bad Request)
3. Try to create habit with name shorter than 2 chars (400 Bad Request)
4. Try to create habit with invalid frequency (400 Bad Request)
5. Try to get habit with invalid ID (404 Not Found)

---

## 🚨 Common Issues

### Issue 1: "Unauthorized"
**Problem:** Token not being sent or expired
**Solution:** Check Authorization header includes `Bearer YOUR_TOKEN`

### Issue 2: "Forbidden"
**Problem:** Trying to access another user's habit
**Solution:** Make sure you're using your own habit IDs

### Issue 3: "Not Found"
**Problem:** Invalid habit ID or habit doesn't exist
**Solution:** Verify the ID exists by listing all habits first

### Issue 4: "Validation Error"
**Problem:** Invalid data format
**Solution:** Check required fields and allowed values for frequency

---

## 💡 Pro Tips

1. **Use Collection Runner** to run all tests automatically
2. **Save responses** to quickly get IDs for subsequent requests
3. **Use Variables** for habit IDs - create a variable `habitId` and use `{{habitId}}` in URLs
4. **Export Collection** to share with teammates
5. **Use Postman Mock Server** for frontend development

---

## 📊 Expected Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

---

## 🔄 Environment Variables Reference

In Postman, use these variables:
- `{{baseUrl}}` - API base URL
- `{{token}}` - JWT authentication token
- `{{habitId}}` - ID of a habit (set manually after creation)

---

Ready to test! Start with logging in and then work through the CRUD operations.


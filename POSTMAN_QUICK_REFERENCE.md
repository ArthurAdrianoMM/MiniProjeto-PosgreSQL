# 🚀 Quick Reference - All API Endpoints

## 🔑 First: Get Your Token

**POST** `http://localhost:3000/api/login`
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```
→ Copy the `token` from response

---

## ✅ Valid Frequency Values
- `"Diário"`
- `"Semanal"`
- `"Quinzenal"`
- `"Mensal"`

---

## 📋 All Endpoints Summary

| Method | Endpoint | Requires Auth | Description |
|--------|----------|---------------|-------------|
| POST | `/api/login` | ❌ | Login and get token |
| POST | `/api/register` | ❌ | Create new user |
| GET | `/api/protected` | ✅ | Test authentication |
| GET | `/api/profile` | ✅ | Get user profile |
| POST | `/api/habits` | ✅ | Create habit |
| GET | `/api/habits` | ✅ | List all habits |
| GET | `/api/habits?filter` | ✅ | List with filters |
| GET | `/api/habits/:id` | ✅ | Get habit by ID |
| PUT | `/api/habits/:id` | ✅ | Update habit (complete) |
| PATCH | `/api/habits/:id` | ✅ | Update habit (partial) |
| DELETE | `/api/habits/:id` | ✅ | Delete habit |

---

## 🧪 Test Sequence (Copy & Paste Ready)

### 1️⃣ Login
```
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

### 2️⃣ Create Habit #1
```
POST http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal"
}
```

### 3️⃣ Create Habit #2
```
POST http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Meditação",
  "description": "Praticar meditação diariamente pela manhã",
  "frequency": "Diário"
}
```

### 4️⃣ Create Habit #3
```
POST http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Leitura",
  "description": "Ler 30 minutos por dia",
  "frequency": "Diário"
}
```

### 5️⃣ List All Habits
```
GET http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
```

### 6️⃣ List with Filter (Active only)
```
GET http://localhost:3000/api/habits?isActive=true
Authorization: Bearer YOUR_TOKEN
```

### 7️⃣ List with Filter (Daily habits)
```
GET http://localhost:3000/api/habits?frequency=Diário
Authorization: Bearer YOUR_TOKEN
```

### 8️⃣ Get Single Habit (Use ID from step 5)
```
GET http://localhost:3000/api/habits/HABIT_ID_HERE
Authorization: Bearer YOUR_TOKEN
```

### 9️⃣ Update Habit (PUT - complete update)
```
PUT http://localhost:3000/api/habits/HABIT_ID_HERE
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Academia - Atualizado",
  "description": "Treino de musculação 4x por semana",
  "frequency": "Semanal",
  "isActive": true
}
```

### 🔟 Update Habit (PATCH - partial update)
```
PATCH http://localhost:3000/api/habits/HABIT_ID_HERE
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "description": "Nova descrição via PATCH",
  "isActive": false
}
```

### 1️⃣1️⃣ Delete Habit
```
DELETE http://localhost:3000/api/habits/HABIT_ID_HERE
Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 Testing Different Scenarios

### Scenario A: Test Name Filtering
```
GET http://localhost:3000/api/habits?name=Academia
Authorization: Bearer YOUR_TOKEN
```

### Scenario B: Test Inactive Habits
```
GET http://localhost:3000/api/habits?isActive=false
Authorization: Bearer YOUR_TOKEN
```

### Scenario C: Test Weekly Habits
```
GET http://localhost:3000/api/habits?frequency=Semanal
Authorization: Bearer YOUR_TOKEN
```

---

## ❌ Test Error Cases

### Invalid Token
```
GET http://localhost:3000/api/habits
Authorization: Bearer invalid_token_here
```
→ Should return 401

### Invalid Habit ID
```
GET http://localhost:3000/api/habits/000000000000000000000000
Authorization: Bearer YOUR_TOKEN
```
→ Should return 404

### Invalid Frequency
```
POST http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test",
  "frequency": "Invalid"
}
```
→ Should return 400

### Name Too Short
```
POST http://localhost:3000/api/habits
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "A",
  "frequency": "Diário"
}
```
→ Should return 400

---

## 📊 Expected Response Formats

### Success (200/201)
```json
{
  "id": "...",
  "name": "...",
  "description": "...",
  "frequency": "...",
  "isActive": true,
  "message": "..."
}
```

### Error (400+)
```json
{
  "error": "Error message here"
}
```

---

## 🔧 Quick Troubleshooting

**Problem:** "Unauthorized" error
→ Add: `Authorization: Bearer YOUR_TOKEN`

**Problem:** Can't find habit
→ First list all habits to get the correct ID

**Problem:** "Forbidden" when accessing habit
→ You're trying to access another user's habit (which is correct behavior!)

**Problem:** Validation error
→ Check frequency value (Diário, Semanal, Quinzenal, Mensal)
→ Check name is at least 2 characters


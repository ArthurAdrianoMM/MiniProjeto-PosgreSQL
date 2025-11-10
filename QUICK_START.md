# 🚀 Quick Start Guide - Running & Testing with Postman

## 📋 Prerequisites

- Node.js installed (v16+)
- npm installed
- Postman installed ([Download Postman](https://www.postman.com/downloads/))
- Supabase database connection configured (already done ✅)

## 🏃 Running the Program

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Start the Server

**Option A: Development Mode (with auto-reload)**
```bash
npm run dev
```

**Option B: Production Mode**
```bash
npm run build
npm start
```

The server will start on **http://localhost:3000**

### Step 4: Verify Server is Running
Open your browser or Postman and visit:
```
GET http://localhost:3000/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...,
  "environment": "development"
}
```

---

## 📮 Testing with Postman

### Step 1: Create a Postman Environment (Recommended)

1. Open Postman
2. Click **"Environments"** in the left sidebar
3. Click **"+"** to create a new environment
4. Name it: **"Habits API Local"**
5. Add these variables:
   - `baseUrl` = `http://localhost:3000`
   - `token` = (leave empty for now)

6. Click **"Save"** and select this environment from the dropdown

### Step 2: Create a Postman Collection

1. Click **"Collections"** in the left sidebar
2. Click **"+"** to create a new collection
3. Name it: **"Habits API"**

### Step 3: Test Authentication (Get Token)

#### Request 1: Register a New User

1. Click **"+"** in your collection to add a request
2. Name it: **"Register User"**
3. Set method to **POST**
4. URL: `{{baseUrl}}/api/register`
5. Go to **Headers** tab:
   - Add: `Content-Type: application/json`
6. Go to **Body** tab:
   - Select **raw** and **JSON**
   - Paste:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123456"
   }
   ```
7. Click **Send**
8. You should get a 201 response with user data

#### Request 2: Login (Get Token)

1. Add another request: **"Login"**
2. Method: **POST**
3. URL: `{{baseUrl}}/api/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "test123456"
   }
   ```
6. Go to **Tests** tab and add this script to automatically save the token:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
       console.log("Token saved:", jsonData.token);
   }
   ```
7. Click **Send**
8. Check the response - you should see a `token` field
9. The token is now saved in your environment variable `{{token}}`

### Step 4: Test Protected Endpoints

#### Request 3: Get User Profile

1. Add request: **"Get Profile"**
2. Method: **GET**
3. URL: `{{baseUrl}}/api/profile`
4. Go to **Authorization** tab:
   - Type: **Bearer Token**
   - Token: `{{token}}`
5. Click **Send**

#### Request 5: Create a Habit

1. Add request: **"Create Habit"**
2. Method: **POST**
3. URL: `{{baseUrl}}/api/habits`
4. Authorization: Bearer Token `{{token}}`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON):
   ```json
   {
     "name": "Morning Exercise",
     "description": "30 minutes of exercise every morning",
     "frequency": "Diário"
   }
   ```
7. Click **Send**

**Valid frequency values:**
- `"Diário"`
- `"Semanal"`
- `"Quinzenal"`
- `"Mensal"`

#### Request 6: List All Habits

1. Add request: **"List Habits"**
2. Method: **GET**
3. URL: `{{baseUrl}}/api/habits`
4. Authorization: Bearer Token `{{token}}`
5. Click **Send**

#### Request 7: List Habits with Filters

1. Add request: **"List Habits (Filtered)"**
2. Method: **GET**
3. URL: `{{baseUrl}}/api/habits?isActive=true&frequency=Diário`
4. Authorization: Bearer Token `{{token}}`
5. Click **Send**

**Available filters:**
- `?isActive=true` or `?isActive=false`
- `?frequency=Diário` (or Semanal, Quinzenal, Mensal)
- `?name=Exercise` (partial match)

#### Request 8: Get Habit by ID

1. Add request: **"Get Habit by ID"**
2. Method: **GET**
3. URL: `{{baseUrl}}/api/habits/YOUR_HABIT_ID_HERE`
   - Replace `YOUR_HABIT_ID_HERE` with an actual ID from the list response
4. Authorization: Bearer Token `{{token}}`
5. Click **Send**

#### Request 9: Update Habit (PUT - Complete Update)

1. Add request: **"Update Habit (PUT)"**
2. Method: **PUT**
3. URL: `{{baseUrl}}/api/habits/YOUR_HABIT_ID_HERE`
4. Authorization: Bearer Token `{{token}}`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON):
   ```json
   {
     "name": "Updated Habit Name",
     "description": "Updated description",
     "frequency": "Semanal",
     "isActive": true
   }
   ```
7. Click **Send**

#### Request 10: Update Habit (PATCH - Partial Update)

1. Add request: **"Update Habit (PATCH)"**
2. Method: **PATCH**
3. URL: `{{baseUrl}}/api/habits/YOUR_HABIT_ID_HERE`
4. Authorization: Bearer Token `{{token}}`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON) - only include fields you want to update:
   ```json
   {
     "description": "New description only",
     "isActive": false
   }
   ```
7. Click **Send**

#### Request 11: Delete Habit

1. Add request: **"Delete Habit"**
2. Method: **DELETE**
3. URL: `{{baseUrl}}/api/habits/YOUR_HABIT_ID_HERE`
4. Authorization: Bearer Token `{{token}}`
5. Click **Send**

---

## 🎯 Quick Test Sequence

1. ✅ **Register** → Create a new user
2. ✅ **Login** → Get your token (saved automatically)
3. ✅ **Get Profile** → Verify authentication works
4. ✅ **Create Habit** → Create your first habit
5. ✅ **List Habits** → See all your habits
6. ✅ **Get Habit by ID** → Get specific habit details
7. ✅ **Update Habit (PUT)** → Full update
8. ✅ **Update Habit (PATCH)** → Partial update
9. ✅ **Delete Habit** → Remove a habit

---

## 🔧 Troubleshooting

### Server won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Make sure `.env` file exists with `DATABASE_URL`
- Verify Supabase connection is working

### "Unauthorized" errors
- Make sure you're using `{{token}}` in Authorization header
- Verify token is saved in environment (check after login)
- Token expires after 1 hour - login again to get a new one

### "Forbidden" errors
- You're trying to access another user's habit
- Make sure you're using habit IDs from your own account

### Connection errors
- Verify server is running: `curl http://localhost:3000/health`
- Check Supabase database is accessible
- Verify `DATABASE_URL` in `.env` is correct

---

## 📚 Additional Resources

- **Full API Documentation**: See [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)
- **Quick Reference**: See [POSTMAN_QUICK_REFERENCE.md](./POSTMAN_QUICK_REFERENCE.md)
- **API Details**: See [HABITS_API.md](./HABITS_API.md)

---

## 💡 Pro Tips

1. **Use Collection Variables**: Create a variable `habitId` in your collection and use `{{habitId}}` in URLs
2. **Save Responses**: Right-click on responses → Save as Example
3. **Use Collection Runner**: Run all requests in sequence automatically
4. **Export Collection**: Share your collection with teammates

---

## ✅ Success Checklist

- [ ] Server running on port 3000
- [ ] Health endpoint responds
- [ ] Can register a new user
- [ ] Can login and get token
- [ ] Token is saved in environment
- [ ] Can create a habit
- [ ] Can list habits
- [ ] Can get habit by ID
- [ ] Can update habit (PUT)
- [ ] Can update habit (PATCH)
- [ ] Can delete habit

Happy testing! 🎉


# 🔧 Supabase Connection Fix for Vercel

## Problem
Vercel can't reach Supabase database: `Can't reach database server at db.gtugzsbetehexuewotsr.supabase.co:5432`

## Root Causes
1. **Missing SSL in connection string** - Supabase requires SSL for external connections
2. **Supabase IP restrictions** - Firewall might be blocking Vercel IPs
3. **Connection pooling** - Supabase uses connection pooling

## Solution 1: Update DATABASE_URL with SSL (Required)

### Current Connection String (WRONG):
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres
```

### Correct Connection String with SSL:
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require
```

### For Production (Recommended - with connection pooling):
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require&connection_limit=1
```

## Steps to Fix

### Step 1: Update Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find `DATABASE_URL`
4. **Update** it to include SSL:

   **For Direct Connection:**
   ```
   postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require
   ```

   **OR For Connection Pooling (Recommended):**
   ```
   postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:6543/postgres?sslmode=require
   ```
   (Note: Port 6543 is for connection pooling, 5432 is direct)

5. Make sure it's set for **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 2: Check Supabase Settings

1. Go to your Supabase project dashboard
2. Click **Settings** → **Database**
3. Check **Connection Pooling**:
   - If enabled, use port **6543** instead of **5432**
   - Connection string should use the pooler URL

4. Check **Network Restrictions**:
   - Go to **Settings** → **Network**
   - Make sure **Allow connections from anywhere** is enabled
   - OR add Vercel's IP ranges (not recommended, changes frequently)

### Step 3: Get Correct Connection String from Supabase

1. Go to Supabase Dashboard
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string (it includes SSL parameters)
6. Replace `[YOUR-PASSWORD]` with your actual password: `Senhabancopsql`
7. Update in Vercel

### Step 4: Redeploy

After updating the environment variable:

1. Go to Vercel Dashboard → **Deployments**
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger redeploy

## Alternative: Use Supabase Connection Pooler

Supabase provides a connection pooler that's better for serverless:

### Connection Pooler URL Format:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

To find your pooler URL:
1. Supabase Dashboard → Settings → Database
2. Look for **Connection Pooling** section
3. Copy the **Session mode** or **Transaction mode** connection string

## Testing the Connection

After updating, test with:

```bash
# Test health endpoint
curl https://your-project.vercel.app/health

# Test registration
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

## Common Issues

### Issue 1: Still Can't Connect
**Solution**: 
- Verify password is correct (no brackets `[]` in password)
- Check Supabase project is active
- Verify database is not paused

### Issue 2: SSL Error
**Solution**: 
- Make sure `?sslmode=require` is in connection string
- Try `?sslmode=no-verify` for testing (not recommended for production)

### Issue 3: Connection Timeout
**Solution**:
- Use connection pooler (port 6543) instead of direct (port 5432)
- Check Supabase project status
- Verify network restrictions

## Quick Fix Summary

1. ✅ Update `DATABASE_URL` in Vercel to include `?sslmode=require`
2. ✅ Use connection pooler if available (port 6543)
3. ✅ Check Supabase network settings
4. ✅ Redeploy on Vercel

## Example Connection Strings

### Direct Connection (Port 5432):
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require
```

### Connection Pooler (Port 6543) - Recommended:
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:6543/postgres?sslmode=require
```

### With Additional Parameters:
```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require&connection_limit=1&pool_timeout=10
```

---

**After making these changes, your Vercel deployment should be able to connect to Supabase!** 🎉


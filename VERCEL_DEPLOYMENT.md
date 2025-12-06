# Vercel Deployment Guide - Supabase Database

## 🔧 Fix for Database Connection Error

The error `Can't reach database server` on Vercel is typically caused by:

1. **Missing SSL configuration** in the connection string
2. **Using direct connection (port 5432)** instead of connection pooler (port 6543) for serverless
3. **Incorrect DATABASE_URL format** in Vercel environment variables

## ✅ Solution

### **CRITICAL: Use Connection Pooler for Serverless**

**You MUST use the connection pooler (port 6543) with SSL for Vercel serverless functions.**

The direct connection (port 5432) has connection limits that don't work well with serverless environments where each function invocation may create a new connection.

### Option 1: Connection Pooler (REQUIRED for Serverless) ⭐

Use the connection pooler on port **6543** - this is optimized for serverless environments like Vercel:

```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:6543/postgres?sslmode=require
```

**Important Notes:**
- Port **6543** is the connection pooler (required for serverless)
- `?sslmode=require` is **mandatory** for Supabase connections
- This format works best with Prisma in serverless environments

### Option 2: Direct Connection (NOT Recommended for Serverless)

Only use this if the pooler doesn't work (unlikely):

```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require
```

**Warning:** Direct connections have connection limits that may cause issues in serverless environments.

## 📝 Steps to Fix in Vercel

### Step 1: Get Connection String from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string** section
4. Select **Connection pooling** tab (NOT Transaction mode)
5. Copy the connection string - it should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
6. **Important:** Make sure you're using the **Connection pooling** string (port 6543), NOT the direct connection (port 5432)
7. Add `?sslmode=require` to the end if it's not already there

### Step 2: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find or create the `DATABASE_URL` variable
4. **Paste the connection string from Supabase (with `?sslmode=require`):**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```
   **Key points:**
   - Must use port **6543** (connection pooler, NOT 5432)
   - Must include `?sslmode=require` at the end
   - Use the **pooler** URL from Supabase (contains "pooler" in the hostname)
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. **Save** the environment variable

### Step 3: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the **three dots** (⋯) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete
5. Check the deployment logs to verify Prisma Client is generated

## 🔍 Additional Configuration

### Required Environment Variables

Make sure these are set in Vercel:

- `DATABASE_URL` - With SSL parameters (see above)
- `JWT_SECRET` - Must be at least 32 characters
- `NODE_ENV` - Set to `production` (optional but recommended)

### Prisma Configuration

The project is configured with:
- ✅ `postinstall` script to generate Prisma Client
- ✅ `vercel-build` script for Vercel deployments
- ✅ Prisma in `dependencies` (required for Vercel)
- ✅ Optimized Prisma Client configuration for serverless
- ✅ Lazy connection handling for Vercel serverless functions
- ✅ Better error messages for database connection issues

## 🧪 Testing

After updating the environment variable, redeploy and test:

1. Check Vercel build logs - should see "Prisma Client generated"
2. Test the `/api/register` endpoint
3. Check Vercel function logs for any connection errors

## 🚨 Common Issues & Troubleshooting

### Still getting "Can't reach database server" error?

**Check these in order:**

1. **Verify DATABASE_URL format in Vercel:**
   - ✅ Must use port **6543** (connection pooler)
   - ✅ Must include `?sslmode=require` at the end
   - ✅ Check for typos in the connection string
   - ✅ Verify password is correct

2. **Redeploy after changing environment variables:**
   - Environment variable changes require a new deployment
   - Go to Vercel dashboard → Deployments → Redeploy

3. **Check Supabase dashboard:**
   - Ensure your database is running
   - Verify connection pooler is enabled
   - Check if there are any IP restrictions

4. **Check Vercel function logs:**
   - Go to Vercel dashboard → Your project → Functions → View logs
   - Look for detailed error messages
   - Check if Prisma Client was generated during build

5. **Verify environment variables are set:**
   - Make sure `DATABASE_URL` is set for the correct environment (Production/Preview)
   - Check that `JWT_SECRET` is also set

### OPTIONS 204 before 500 error?

This is normal! The OPTIONS request is a CORS preflight that succeeds. The 500 error on the actual POST request indicates the database connection issue. Fix the `DATABASE_URL` as described above.

### Prisma Client not generated?

- The `postinstall` script should handle this automatically
- If issues persist, check that `prisma` is in `dependencies` (not `devDependencies`)

## 📚 References

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)


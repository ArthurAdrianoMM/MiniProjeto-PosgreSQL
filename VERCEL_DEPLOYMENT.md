# Vercel Deployment Guide - Supabase Database

## 🔧 Fix for Database Connection Error

The error `Can't reach database server` on Vercel is caused by missing SSL configuration in the connection string.

## ✅ Solution

Update your `DATABASE_URL` environment variable in Vercel to include SSL parameters.

### Option 1: Connection Pooler (Recommended for Serverless)

Use the connection pooler on port **6543** - this is optimized for serverless environments like Vercel:

```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:6543/postgres?sslmode=require
```

### Option 2: Direct Connection

If the pooler doesn't work, use the direct connection on port **5432**:

```
postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres?sslmode=require
```

## 📝 Steps to Fix in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find or create the `DATABASE_URL` variable
4. Update it to include `?sslmode=require` at the end:
   ```
   postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:6543/postgres?sslmode=require
   ```
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. **Redeploy** your application

## 🔍 Additional Configuration

### Required Environment Variables

Make sure these are set in Vercel:

- `DATABASE_URL` - With SSL parameters (see above)
- `JWT_SECRET` - Must be at least 32 characters
- `NODE_ENV` - Set to `production` (optional but recommended)

### Prisma Configuration

The project is already configured with:
- ✅ `postinstall` script to generate Prisma Client
- ✅ `vercel-build` script for Vercel deployments
- ✅ Prisma moved to `dependencies` (required for Vercel)

## 🧪 Testing

After updating the environment variable, redeploy and test:

1. Check Vercel build logs - should see "Prisma Client generated"
2. Test the `/api/register` endpoint
3. Check Vercel function logs for any connection errors

## 🚨 Common Issues

### Still getting connection errors?

1. **Verify the connection string format** - Make sure `?sslmode=require` is at the end
2. **Check Supabase dashboard** - Ensure your database is running
3. **Try connection pooler** - Port 6543 is better for serverless
4. **Check Vercel logs** - Look for detailed error messages

### Prisma Client not generated?

- The `postinstall` script should handle this automatically
- If issues persist, check that `prisma` is in `dependencies` (not `devDependencies`)

## 📚 References

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deploying-to-vercel)


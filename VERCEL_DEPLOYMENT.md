# 🚀 Vercel Deployment Guide

This guide will help you deploy your Habits API to Vercel.

## ✅ Pre-Deployment Checklist

- [x] Project uses Express.js
- [x] TypeScript configured
- [x] Prisma ORM setup
- [x] Serverless entry point created (`api/index.ts`)
- [x] Vercel configuration file (`vercel.json`)
- [x] Database connection optimized for serverless
- [x] Environment variables documented

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: Your code needs to be in a Git repository
3. **Supabase Database**: Already configured ✅

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your code is committed and pushed to GitHub/GitLab/Bitbucket:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 3: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository
   - Click **"Import"**

4. **Configure Project Settings**:
   - **Framework Preset**: Leave as "Other" (or "Node.js")
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run vercel-build` (already set in vercel.json)
   - **Output Directory**: `dist` (already set in vercel.json)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**:
   Click **"Environment Variables"** and add:

   ```
   DATABASE_URL=postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres
   JWT_SECRET=meusegredo123
   NODE_ENV=production
   PORT=3000
   JWT_EXPIRES_IN=1h
   BCRYPT_ROUNDS=10
   CORS_ORIGIN=*
   ```

   **Important**: 
   - Make sure to add these for **Production**, **Preview**, and **Development** environments
   - Click **"Save"** after adding each variable

6. **Deploy**:
   - Click **"Deploy"**
   - Wait for the build to complete (usually 2-3 minutes)

### Step 4: Deploy via CLI (Alternative Method)

If you prefer using the CLI:

```bash
# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# For production deployment
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **Project name?** → habits-api (or your preferred name)
- **Directory?** → ./
- **Override settings?** → No

**Add environment variables via CLI:**
```bash
vercel env add DATABASE_URL production
# Paste: postgresql://postgres:Senhabancopsql@db.gtugzsbetehexuewotsr.supabase.co:5432/postgres

vercel env add JWT_SECRET production
# Paste: meusegredo123

vercel env add NODE_ENV production
# Paste: production
```

## 🔍 Verify Deployment

After deployment, Vercel will provide you with a URL like:
```
https://your-project-name.vercel.app
```

### Test Your Deployment:

1. **Health Check**:
   ```
   GET https://your-project-name.vercel.app/health
   ```

2. **Test Endpoint**:
   ```
   GET https://your-project-name.vercel.app/test
   ```

3. **Register User**:
   ```
   POST https://your-project-name.vercel.app/api/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

## 🛠️ Troubleshooting

### Issue: Build Fails

**Error**: "Cannot find module '@prisma/client'"

**Solution**: 
- Make sure `vercel-build` script runs `prisma generate`
- Check that `prisma` is in `dependencies`, not `devDependencies`

### Issue: Database Connection Errors

**Error**: "P1001: Can't reach database server"

**Solutions**:
1. Check Supabase connection string is correct
2. Verify Supabase allows connections from Vercel IPs
3. Check Supabase firewall settings
4. Ensure `DATABASE_URL` is set correctly in Vercel environment variables

### Issue: 500 Internal Server Error

**Solutions**:
1. Check Vercel function logs: Dashboard → Your Project → Functions → View Logs
2. Verify all environment variables are set
3. Check Prisma schema is pushed to database: `npx prisma db push`
4. Ensure `JWT_SECRET` is at least 32 characters (or update validation)

### Issue: CORS Errors

**Solution**: 
- Update `CORS_ORIGIN` environment variable in Vercel
- Set it to your frontend domain or `*` for development

## 📝 Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Supabase connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `3000` (Vercel sets this automatically) | ❌ No |
| `JWT_EXPIRES_IN` | `1h` | ❌ No |
| `BCRYPT_ROUNDS` | `10` | ❌ No |
| `CORS_ORIGIN` | `*` or your frontend URL | ❌ No |

## 🔄 Updating Your Deployment

### Method 1: Automatic (via Git)

Every push to your main branch will trigger a new deployment:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build the project
3. Deploy to production

### Method 2: Manual via CLI

```bash
vercel --prod
```

### Method 3: Manual via Dashboard

1. Go to your project on Vercel
2. Click **"Deployments"**
3. Click **"Redeploy"** on the latest deployment

## 🌍 Custom Domain (Optional)

1. Go to your project on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## 📊 Monitoring

- **Logs**: Dashboard → Your Project → Functions → View Logs
- **Analytics**: Dashboard → Your Project → Analytics
- **Performance**: Dashboard → Your Project → Speed Insights

## 🔐 Security Best Practices

1. **Never commit `.env` file** ✅ (already in .gitignore)
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **Set CORS_ORIGIN** to your specific frontend domain in production
4. **Use Vercel Environment Variables** for all secrets
5. **Enable Vercel Authentication** for your project (optional)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Guide](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## ✅ Post-Deployment Checklist

- [ ] Health endpoint responds
- [ ] Can register a new user
- [ ] Can login and get token
- [ ] Can create a habit
- [ ] Can list habits
- [ ] Database connection works
- [ ] Environment variables are set
- [ ] Logs are accessible
- [ ] Custom domain configured (if needed)

## 🎉 Success!

Your API is now live on Vercel! Share your API URL with your frontend team or use it in your applications.

**Example API Base URL:**
```
https://your-project-name.vercel.app/api
```

---

**Need Help?** Check Vercel's [Support Documentation](https://vercel.com/support) or your project's function logs.


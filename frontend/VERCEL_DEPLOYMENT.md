# Deploying Frontend to Vercel

## Step-by-Step Guide

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub/GitLab/Bitbucket.

### 2. Create Vercel Account

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub (recommended) or email
3. Import your repository

### 3. Configure Project Settings

When importing your project:

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend` (since your repo has frontend/server folders)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Set Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://ai-tryon-5sl2.onrender.com/api
```

**Important Notes:**
- The variable name must start with `VITE_` for Vite to expose it
- Use your actual Render backend URL
- Add this for all environments: Production, Preview, and Development

### 5. Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies
   - Build your application
   - Deploy to a production URL
3. Wait 1-3 minutes for deployment

### 6. Get Your Frontend URL

After deployment, Vercel will provide a URL like:
```
https://ai-tryon-frontend.vercel.app
```

### 7. Update Backend CORS

Go back to Render dashboard and update your backend environment variable:

```env
FRONTEND_URL=https://ai-tryon-frontend.vercel.app
```

Or if you have a custom domain:
```env
FRONTEND_URL=https://yourdomain.com
```

**Important:** After updating `FRONTEND_URL`, redeploy your backend on Render.

## Environment Variables Summary

### Frontend (Vercel):
```env
VITE_API_BASE_URL=https://ai-tryon-5sl2.onrender.com/api
```

### Backend (Render):
```env
FRONTEND_URL=https://ai-tryon-frontend.vercel.app
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Render with your custom domain

## Troubleshooting

### Build Fails:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure `npm run build` works locally

### API Calls Fail:
- Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` matches your Vercel URL
- Check that backend is running (Render free tier may spin down)

### CORS Errors:
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check backend CORS configuration
- Ensure no trailing slashes in URLs

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Root Directory set to `frontend`
- [ ] Environment variable `VITE_API_BASE_URL` set
- [ ] Frontend deployed successfully
- [ ] Frontend URL obtained
- [ ] Backend `FRONTEND_URL` updated in Render
- [ ] Backend redeployed (if needed)
- [ ] Tested API calls from frontend

## Free Tier Benefits

Vercel free tier includes:
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Custom domains
- Preview deployments for every PR
- No credit card required

Enjoy your deployed application! 🚀

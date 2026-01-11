# Deploying Backend to Render

## Step-by-Step Guide

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub/GitLab/Bitbucket.

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Select the repository containing your backend code

### 3. Configure Build Settings

- **Name**: `ai-tryon-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server` (if your backend is in a server folder)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Set Environment Variables

In the Render dashboard, go to **Environment** section and add:

#### Required Variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_URL=cloudinary://458684755797742:Vn1k6bDedFpB4Y3EYu0a9Lk_mzc@dbllsqowe
FRONTEND_URL=https://your-frontend-url.com
```

#### How to get MongoDB URI:

**Option 1: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with your database name (e.g., `ai-tryon`)

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-tryon?retryWrites=true&w=majority
```

**Option 2: Render MongoDB (Free)**
1. In Render dashboard, click **"New +"** → **"MongoDB"**
2. Create a free MongoDB instance
3. Copy the Internal Database URL
4. Use it as your `MONGO_URI`

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your application
   - Start your server
3. Wait for deployment to complete (usually 2-5 minutes)

### 6. Get Your Backend URL

After deployment, Render will provide a URL like:
```
https://ai-tryon-backend.onrender.com
```

### 7. Update Frontend

Update your frontend `.env` or environment variables:

```env
VITE_API_BASE_URL=https://ai-tryon-backend.onrender.com/api
```

## Important Notes

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for always-on if you upgrade)

### To Keep Service Always On (Free Tier):
- Upgrade to paid plan, OR
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your service every 5 minutes

### CORS Configuration:
Your `FRONTEND_URL` should match your frontend domain exactly:
- If frontend is on `https://myapp.com`, set `FRONTEND_URL=https://myapp.com`
- If frontend is on `http://localhost:5173` (local dev), set `FRONTEND_URL=http://localhost:5173`

### Database:
- Use MongoDB Atlas (free tier available) for production
- Or use Render's MongoDB service (free tier available)

## Troubleshooting

### Service Won't Start:
1. Check **Logs** tab in Render dashboard
2. Verify all environment variables are set
3. Check that `MONGO_URI` is correct
4. Ensure `JWT_SECRET` is set

### CORS Errors:
1. Verify `FRONTEND_URL` matches your frontend domain exactly
2. Check that CORS middleware is configured correctly

### Database Connection Issues:
1. Verify `MONGO_URI` is correct
2. If using MongoDB Atlas, ensure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)
3. Check that database user has correct permissions

## Quick Checklist

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `CLOUDINARY_URL`
  - [ ] `FRONTEND_URL`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
- [ ] Service deployed successfully
- [ ] Backend URL obtained
- [ ] Frontend updated with new API URL

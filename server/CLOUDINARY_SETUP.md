# Cloudinary Setup Instructions

## Error: "Unknown API key"

This error means your Cloudinary credentials are not properly configured. Follow these steps:

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. Once logged in, you'll see your **Dashboard**
4. On the dashboard, you'll find:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

## Step 2: Add Credentials to .env File

Create or edit `server/.env` file and add:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 3: Restart Your Server

After adding the credentials, restart your server:

```bash
cd server
npm run dev
```

## Important Notes

- **Never commit your `.env` file to Git** - it contains sensitive credentials
- The API key you provided (`gMWjcoBL8dyAvbw0Gp1MhFKpSP4`) is not valid
- You need all three values: `cloud_name`, `api_key`, and `api_secret`
- Make sure there are no spaces around the `=` sign in your `.env` file

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25 million transformations per month

This should be more than enough for development and testing!

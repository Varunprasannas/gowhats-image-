# Fix for Localhost URLs in Production

Your images are showing `localhost:5000` URLs in production because the environment variable wasn't set on Vercel. Here's how to fix it completely:

## Step 1: Update Vercel Environment Variables

Go to your Vercel dashboard → **Project Settings** → **Environment Variables**

Add or update this variable:
```
VITE_API_URL = https://your-backend-api-url.vercel.app/api
```

**Example values:**
- If backend is on same domain: `VITE_API_URL=/api`
- If backend is separate: `VITE_API_URL=https://your-api-project.vercel.app/api`
- For localhost testing: `VITE_API_URL=http://localhost:5000/api`

## Step 2: Redeploy Frontend

After adding the environment variable:
1. Go to Vercel dashboard
2. Select your project
3. Click **Redeploy** or push new commit to trigger auto-deploy

## Step 3: Fix Existing Image URLs

Old images in your database still have `localhost:5000` URLs. Fix them by:

### Option A: Using API (Recommended)

```bash
# Once deployed, call the fix-urls endpoint
curl -X POST https://gowhats-image.vercel.app/api/fix-urls
```

Or in frontend, add this temporary button:
```typescript
const fixUrls = async () => {
  try {
    const response = await fetch('/api/fix-urls', { method: 'POST' });
    const data = await response.json();
    alert(`Fixed ${data.updatedCount} image URLs`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Add to your page
<button onClick={fixUrls}>Fix Image URLs</button>
```

### Option B: Delete and Re-upload

1. Delete all old images
2. Upload them again - they'll get correct URLs

## Step 4: Verify

1. Upload a new image
2. Check the image URL - should be production domain, not localhost
3. Gallery page should show correct URLs

## Architecture for Production

The app now works in two modes:

### Local Development
```
Frontend (localhost:3000/5173) → Backend API (localhost:5000/api)
```

### Production (Vercel)
```
Frontend (gowhats-image.vercel.app) → Backend API (auto-detected from VITE_API_URL)
                                              ↓
                                    MongoDB Atlas
```

## Frontend API URL Detection Logic

The frontend now:
1. Checks `VITE_API_URL` environment variable first
2. If not set, uses relative `/api` path
3. Falls back to `http://localhost:5000/api` for local dev

## Backend Image URL Generation

When uploading images:
1. Backend uses `PUBLIC_URL` environment variable
2. If not set, uses current request domain
3. Stores full URL in MongoDB for CDN access

## Current Environment Variables Status

### Frontend (Vercel)
- ✅ `VITE_API_URL` - Set in your Vercel dashboard

### Backend (Vercel)
- ✅ `MONGODB_URI` - Set for database connection
- ✅ `PUBLIC_URL` - Should be set to production domain
- ✅ `NODE_ENV` - Set to production

## Troubleshooting

**Problem**: Still seeing localhost URLs
- **Solution**: 
  1. Wait 5 minutes for Vercel redeploy
  2. Clear browser cache (Ctrl+Shift+Delete)
  3. Clear cookies for the domain
  4. Hard refresh (Ctrl+F5)

**Problem**: 404 errors when uploading
- **Solution**: Check backend API URL in Vercel env vars

**Problem**: Images don't load
- **Solution**: Call `/api/fix-urls` endpoint to update database

---

**Next Steps:** 
1. Set `VITE_API_URL` in Vercel dashboard
2. Redeploy your frontend
3. Call `/api/fix-urls` to fix existing images
4. Upload new images - they should work correctly!

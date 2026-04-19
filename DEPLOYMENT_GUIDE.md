# GoWhats Image Host - Deployment Guide

## Project Structure

```
gowhats-image-tool-suite/
├── src/                    # Frontend (React + TypeScript + Vite)
├── server/                 # Backend (Node.js + Express)
├── package.json            # Frontend dependencies
├── server/package.json     # Backend dependencies
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel configuration
└── index.html              # Frontend entry point
```

## Deployment Setup

### Prerequisites
- MongoDB Atlas account and connection string
- Vercel account
- GitHub repository

### Frontend Deployment (Vercel)

1. **Connect your GitHub repo to Vercel**
   - Go to vercel.com/new
   - Import your GitHub repository
   - Select the root directory

2. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app/api
   ```
   Or if backend is on same domain:
   ```
   VITE_API_URL=/api
   ```

3. **Deploy**
   - Vercel will automatically build and deploy

### Backend Deployment

#### Option A: Deploy Backend Separately on Vercel

1. Create a separate Vercel project for the backend
2. In Vercel dashboard, set environment variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   NODE_ENV=production
   PUBLIC_URL=https://your-backend-domain.vercel.app
   ```

#### Option B: Deploy Backend with Frontend (API Routes)

Create a `api` folder in root with serverless functions.

### Fixing Image URLs After Deployment

If you see `localhost:5000` URLs in production images, run this:

```bash
# Call the fix-urls endpoint
curl -X POST https://your-api-domain.com/api/fix-urls
```

Or in your frontend, add a button that calls:
```typescript
await api.post('/fix-urls', {
  oldDomain: 'http://localhost:5000',
  newDomain: 'https://your-production-domain.com'
});
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NODE_ENV=development
PUBLIC_URL=http://localhost:5000
```

## Development

### Local Development
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm start
```

### Production URLs

The application dynamically detects URLs:
- **Frontend API**: Uses `VITE_API_URL` env var or current domain
- **Images**: Use `PUBLIC_URL` from backend or current request domain

## Troubleshooting

### Images showing localhost:5000 in production
1. Check `VITE_API_URL` is set in Vercel environment variables
2. Run `/api/fix-urls` endpoint to update database
3. Clear browser cache

### API connection errors
1. Verify `VITE_API_URL` matches your backend domain
2. Check backend CORS settings
3. Verify MongoDB connection on production

### Build failures on Vercel
1. Check `package.json` has all dependencies
2. Ensure `npm run build` works locally
3. Check build logs in Vercel dashboard

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB Atlas
- **Image Processing**: Sharp (compression & metadata)
- **Deployment**: Vercel

## Features

- 📤 Upload & compress images
- 🗂️ Organize by folders
- 🔍 Search & filter
- 📊 Stats & analytics
- 🖼️ Grid & list views
- 📥 Download images
- 🗑️ Delete management

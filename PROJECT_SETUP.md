# 🚀 GoWhats Image Host - Complete Setup Guide

## Project Overview

A complete image hosting platform with upload, compression, and management features.

**Live:** https://gowhats-image.vercel.app

## Architecture

```
┌─────────────────┐         ┌──────────────────┐      ┌──────────────┐
│  React Frontend │ ◄──────► │ Node.js Backend  │ ◄──► │ MongoDB Atlas│
│ (Vercel)        │         │ (Vercel/Own)     │     │              │
└─────────────────┘         └──────────────────┘      └──────────────┘
     Port 3000/80         Port 5000 (dev)
```

## Technologies

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ORM)
- Sharp (Image Compression)
- Multer (File Upload)

### Database
- MongoDB Atlas (Cloud)

### Deployment
- Vercel (Frontend & Backend)
- MongoDB Atlas (Database)

## Installation

### Prerequisites
```bash
node --version  # v18+
npm --version   # v9+
git --version   # Latest
```

### Step 1: Clone Repository
```bash
git clone https://github.com/Varunprasannas/gowhats-image-.git
cd gowhats-image-tool-suite
npm install
cd server && npm install && cd ..
```

### Step 2: Setup Environment Variables

**Frontend** - Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** - Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NODE_ENV=development
PUBLIC_URL=http://localhost:5000
```

### Step 3: MongoDB Setup

1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `server/.env` as `MONGODB_URI`

### Step 4: Run Locally

**Terminal 1 - Frontend:**
```bash
npm run dev
# Visit http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
# Server running on http://localhost:5000
```

## Features

### Image Management
- ✅ Upload single/multiple images
- ✅ Auto-compress (50-80% size reduction)
- ✅ Extract metadata (dimensions, MIME type)
- ✅ Organize by folders

### Gallery
- ✅ Grid view with hover effects
- ✅ List view with sorting
- ✅ Search by filename
- ✅ Filter by folder
- ✅ Download images
- ✅ Delete images

### Statistics
- ✅ Total images count
- ✅ Storage usage
- ✅ Compression savings
- ✅ Folder statistics

## API Endpoints

### Images
- `POST /api/upload` - Upload single image
- `POST /api/upload-bulk` - Upload multiple images
- `GET /api/images` - Get all images
- `DELETE /api/images/:id` - Delete image
- `PUT /api/images/:id` - Update image

### Organization
- `GET /api/folders` - Get all folders
- `GET /api/stats` - Get statistics

### Maintenance
- `POST /api/fix-urls` - Fix localhost URLs in database

## Folder Structure

```
.
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── ImageUploader.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── StatsCard.tsx
│   │   └── FolderSelector.tsx
│   ├── pages/
│   │   └── ImagesPage.tsx        # Gallery page with grid/list views
│   ├── services/
│   │   └── api.ts                # API client
│   ├── utils/
│   │   └── cn.ts                 # Utility functions
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
│
├── server/                       # Backend source
│   ├── routes/
│   │   └── imageRoutes.js        # Image endpoints
│   ├── models/
│   │   └── Image.js              # MongoDB schema
│   ├── middleware/
│   │   └── upload.js             # Multer config
│   ├── utils/
│   │   └── imageProcessor.js     # Sharp image processing
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── server.js                 # Main server file
│   └── package.json
│
├── package.json                  # Frontend deps
├── vite.config.ts                # Vite config
├── vercel.json                   # Vercel deploy config
├── .env.example                  # Frontend env template
├── .env.frontend                 # Frontend env
└── server/.env.example           # Backend env template
```

## Development Commands

### Frontend
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd server
npm start            # Start server on port 5000
npm run dev          # Watch mode
```

## Deployment to Vercel

### Step 1: Deploy Frontend
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from main branch
```

### Step 2: Set Environment Variables
1. Go to Vercel Project Settings
2. Add environment variables:
   - `VITE_API_URL` = Your backend API URL

### Step 3: Deploy Backend (Optional)
If using separate Vercel project:
1. Create new Vercel project for `server/`
2. Set environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `PUBLIC_URL` = Your backend domain

### Step 4: Fix Existing Images
```bash
# Call fix-urls endpoint to update old localhost URLs
curl -X POST https://your-domain/api/fix-urls
```

## Common Issues & Solutions

### "Cannot connect to server"
- [ ] Check backend is running (`http://localhost:5000`)
- [ ] Verify `VITE_API_URL` in `.env`
- [ ] Check firewall/antivirus

### "Images show localhost:5000 in production"
- [ ] Set `VITE_API_URL` in Vercel dashboard
- [ ] Call `/api/fix-urls` endpoint
- [ ] Clear browser cache

### "MongoDB connection timeout"
- [ ] Verify MongoDB URI in `server/.env`
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Increase connection timeout

### "File upload fails"
- [ ] Check `server/uploads/` directory exists
- [ ] Verify disk space
- [ ] Check file size limits in Multer config

## Performance Tips

1. **Image Optimization**
   - Sharp automatically compresses 50-80%
   - Images cached with proper headers

2. **Database**
   - Indexes on `folder` and `uploadedAt`
   - MongoDB Atlas auto-scaling

3. **Frontend**
   - Lazy loading in gallery
   - Optimized re-renders
   - Virtual scrolling for large lists

## Security

- ✅ File type validation
- ✅ File size limits
- ✅ MongoDB injection prevention (Mongoose)
- ✅ CORS enabled
- ✅ Input sanitization

## Monitoring

### Vercel Metrics
- Deployment history
- Build logs
- Function analytics
- Error tracking

### MongoDB Metrics
- Connection monitoring
- Query performance
- Storage usage
- Backup status

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/Varunprasannas/gowhats-image-/issues
- Email: support@gowhats.com

---

**Last Updated:** April 2026
**Version:** 1.0.0

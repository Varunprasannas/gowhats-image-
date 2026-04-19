# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Install MongoDB (if not already installed)

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Windows
Download from: https://www.mongodb.com/try/download/community

Or use **MongoDB Atlas** (cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `server/.env` with your connection string

### 2. Install Project Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Start the Application

#### Option A: Manual Start (2 terminals)

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

You should see:
```
🚀 GoWhats Image Host Server
📡 Server running on port 5000
🌐 API: http://localhost:5000/api
✅ MongoDB Connected: localhost
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

You should see:
```
VITE v7.2.4  ready in 234 ms
➜  Local:   http://localhost:5173/
```

#### Option B: Using npm scripts (create custom script)

You can also create a start script in the root `package.json`:

Add to `package.json` scripts:
```json
"dev:server": "cd server && npm start",
"dev:client": "vite",
"dev:all": "concurrently \"npm run dev:server\" \"npm run dev:client\""
```

Then install concurrently:
```bash
npm install -D concurrently
```

And run both:
```bash
npm run dev:all
```

### 4. Verify Installation

#### Check Backend Health
Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "GoWhats Image Host Server is running",
  "timestamp": "2024-..."
}
```

#### Check Frontend
Open browser:
```
http://localhost:5173
```

You should see the GoWhats Image Host interface.

### 5. Test Upload

1. Drag and drop an image or click to select
2. Click "Upload" button
3. You should see:
   - Success message
   - Image appears in gallery
   - Public URL generated
   - Stats updated

## 🔧 Configuration

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment Variables (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gowhats-image-host
NODE_ENV=development
```

### Change API Port
If port 5000 is in use:

1. Update `server/.env`:
   ```env
   PORT=3001
   ```

2. Update `.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

## 📁 Project Structure

```
gowhats-image-host/
├── server/                  # Backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   └── upload.js       # Multer configuration
│   ├── models/
│   │   └── Image.js        # Image schema
│   ├── routes/
│   │   └── imageRoutes.js  # API routes
│   ├── uploads/            # Uploaded images (auto-created)
│   ├── utils/
│   │   └── imageProcessor.js # Image compression
│   ├── .env                # Backend config
│   ├── package.json
│   └── server.js           # Entry point
│
├── src/                    # Frontend
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── StatsCard.tsx
│   │   └── FolderSelector.tsx
│   ├── services/
│   │   └── api.ts          # API client
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
│
├── .env                    # Frontend config
├── package.json
└── README.md
```

## 🎯 Common Issues & Solutions

### MongoDB Connection Error
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
1. Start MongoDB: `brew services start mongodb-community` (macOS)
2. Or use MongoDB Atlas (cloud) and update connection string

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Kill the process using port 5000:
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```
2. Or change port in `server/.env`

### CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure backend is running
- Check VITE_API_URL in `.env`
- Verify CORS is enabled in `server/server.js`

### Images Not Displaying
**Error:** Images upload but don't show in gallery

**Solution:**
1. Check browser console for errors
2. Verify `server/uploads` folder exists
3. Check image publicUrl format
4. Ensure backend is serving static files

### File Upload Error
**Error:** `Only image files are allowed!`

**Solution:**
- Only upload image files (.jpg, .jpeg, .png, .gif, .webp)
- File must be under 10MB

## 🧪 Test the API

### Using curl

**Upload Image:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/image.jpg" \
  -F "folder=test"
```

**Get All Images:**
```bash
curl http://localhost:5000/api/images
```

**Get Stats:**
```bash
curl http://localhost:5000/api/stats
```

**Delete Image:**
```bash
curl -X DELETE http://localhost:5000/api/images/IMAGE_ID
```

### Using Postman

1. Import endpoints from README
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint

## 🚀 Production Deployment

### Backend (Node.js)

Deploy to:
- Heroku
- DigitalOcean
- AWS EC2
- Railway
- Render

**Important:**
1. Set environment variables
2. Use MongoDB Atlas for database
3. Configure file storage (S3, Cloudinary, etc.)
4. Enable HTTPS

### Frontend (React)

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Build command:
```bash
npm run build
```

**Update .env for production:**
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 💡 Tips

1. **Development:** Use `npm run dev` for auto-reload
2. **File Storage:** For production, use cloud storage (AWS S3, Cloudinary)
3. **Database:** Use MongoDB Atlas for production
4. **Monitoring:** Add error tracking (Sentry, LogRocket)
5. **Security:** Add authentication for production use

## 📚 Next Steps

1. ✅ Complete setup
2. ✅ Test image upload
3. ✅ Test bulk upload
4. ✅ Test delete functionality
5. ✅ Test folder management
6. 🚀 Deploy to production

---

Need help? Check the main README.md or open an issue!

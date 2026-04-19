# GoWhats Image Host - Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS/Linux
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 3. Environment Variables
Copy `.env.example` to `.env` and configure:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gowhats-image-host
NODE_ENV=development
```

### 4. Start Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

Server will run on: http://localhost:5000

## API Endpoints

### Upload Images
- `POST /api/upload` - Upload single image
- `POST /api/upload-bulk` - Upload multiple images (max 50)

### Get Images
- `GET /api/images` - Get all images (with pagination)
- `GET /api/images/:id` - Get single image
- `GET /api/folders` - Get all folders
- `GET /api/stats` - Get statistics

### Update Images
- `PUT /api/images/:id` - Update image (rename/move folder)

### Delete Images
- `DELETE /api/images/:id` - Delete single image
- `POST /api/images/delete-bulk` - Delete multiple images

### Health Check
- `GET /health` - Server health status

## Features
✅ Image upload (single & bulk)
✅ Auto compression (maintains quality)
✅ MongoDB storage
✅ Folder organization
✅ Delete functionality
✅ Public URL generation
✅ Real-time API (no mock data)

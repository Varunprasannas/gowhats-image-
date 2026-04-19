# 🚀 GoWhats Image Host

**Simple & Powerful Image Hosting Platform**

A full-stack image hosting application built with React, Node.js, Express, and MongoDB. Upload images, get public URLs instantly, with auto-compression and folder organization.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-green)
![Tech Stack](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Tech Stack](https://img.shields.io/badge/TypeScript-Tailwind-purple)

## ✨ Features

### Core Features (Phase 1 MVP)
✅ **Image Upload** - Single & bulk upload (up to 50 images)  
✅ **Public URLs** - Instant HTTPS links for every image  
✅ **Copy Button** - One-click URL copying  
✅ **Auto Compression** - Reduce file size while maintaining quality  
✅ **Drag & Drop** - Easy file upload interface  
✅ **Instant Preview** - See images before uploading  

### Advanced Features
✅ **Folder Organization** - Organize images by client/project  
✅ **Rename Images** - Update image names on the fly  
✅ **Bulk Delete** - Select and delete multiple images  
✅ **Real-time Stats** - Track storage, compression savings  
✅ **Image Metadata** - View dimensions, file size, compression ratio  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

### Technical Features
✅ **Real-time API** - No mock data, all live database operations  
✅ **Image Compression** - Auto-optimize with Sharp (2MB → 200KB typical)  
✅ **MongoDB Integration** - Persistent storage with indexing  
✅ **RESTful API** - Clean, documented endpoints  
✅ **Error Handling** - Comprehensive error messages  
✅ **Type Safety** - Full TypeScript support  

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Dropzone** - Drag & drop upload
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File upload middleware
- **Sharp** - Image processing & compression
- **CORS** - Cross-origin support

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gowhats-image-host
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gowhats-image-host
NODE_ENV=development
```

### 5. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in server/.env)
```

### 6. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 🎯 Usage

### Upload Images
1. Drag & drop images or click to select
2. Choose a folder (or create new one)
3. Click "Upload" button
4. Get instant public URLs!

### Manage Images
- **Copy URL**: Click the copy button next to any image URL
- **Rename**: Click the edit icon to rename images
- **Delete**: Single delete or select multiple for bulk delete
- **Filter**: Use folder selector to view specific folders
- **Download**: Download original or compressed versions

### API Endpoints

#### Upload
- `POST /api/upload` - Upload single image
- `POST /api/upload-bulk` - Upload multiple images

#### Get Images
- `GET /api/images` - Get all images (with pagination)
- `GET /api/images/:id` - Get single image
- `GET /api/folders` - Get all folders
- `GET /api/stats` - Get statistics

#### Update
- `PUT /api/images/:id` - Update image (rename/move)

#### Delete
- `DELETE /api/images/:id` - Delete single image
- `POST /api/images/delete-bulk` - Delete multiple images

## 📊 Statistics Dashboard

The app tracks:
- Total images uploaded
- Number of folders
- Storage space used
- Compression savings (MB & percentage)

## 🔒 Security Features

- File type validation (images only)
- File size limits (10MB max)
- Unique filename generation
- MongoDB injection prevention
- CORS configuration

## 🚀 Future Enhancements (Phases 2 & 3)

### Phase 2
- [ ] Image background remover
- [ ] Watermark tool
- [ ] WebP conversion
- [ ] Image resizing presets
- [ ] WhatsApp-ready formatter

### Phase 3
- [ ] Product creator (image + price → product)
- [ ] Bulk link export (CSV)
- [ ] User authentication
- [ ] Custom domains
- [ ] CDN integration
- [ ] Analytics dashboard

## 📝 API Response Examples

### Upload Response
```json
{
  "success": true,
  "image": {
    "_id": "65abc123...",
    "originalName": "product.jpg",
    "fileName": "compressed-img-1234567890.jpg",
    "fileSize": 2048000,
    "compressedSize": 245000,
    "publicUrl": "http://localhost:5000/uploads/compressed-img-1234567890.jpg",
    "folder": "default",
    "width": 1920,
    "height": 1080
  }
}
```

### Bulk Upload Response
```json
{
  "success": true,
  "uploaded": 5,
  "failed": 0,
  "images": [...],
  "errors": []
}
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify .env configuration

### Images won't upload
- Check backend server is running
- Verify CORS settings
- Check file size (max 10MB)
- Ensure file is an image type

### Can't see images
- Check MongoDB connection
- Verify /uploads folder exists
- Check publicUrl format

## 📄 License

MIT License - feel free to use for personal or commercial projects!

## 🙏 Credits

Built with ❤️ for the GoWhats ecosystem

## 📞 Support

For issues or questions:
- Check the documentation
- Review API endpoints
- Check browser console for errors
- Verify MongoDB connection

---

**GoWhats Image Host** - Upload • Compress • Share 🚀

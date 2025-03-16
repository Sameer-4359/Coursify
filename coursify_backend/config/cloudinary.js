const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage setup for videos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "coursify_videos", // Folder name in Cloudinary
    resource_type: "video", // Important for videos
    allowedFormats: ["mp4", "mov", "avi"], // Allowed video formats
  },
});

// Multer setup for handling file uploads
const upload = multer({ storage });

module.exports = { cloudinary, upload };

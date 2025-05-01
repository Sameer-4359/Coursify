// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// require("dotenv").config(); // Load environment variables

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Cloudinary storage setup for videos
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "coursify_videos", // Folder name in Cloudinary
//     resource_type: "video", // Important for videos
//     allowedFormats: ["mp4", "mov", "avi"], // Allowed video formats
//   },
// });

// const pdfStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "coursify_pdfs",
//     resource_type: "raw", // Important for PDFs
//     allowedFormats: ["pdf"],
//   },
// });

// // Multer setup for handling file uploads
// const upload = multer({ storage });
// // const pdfStorage = multer.memoryStorage();
// const uploadPdf = multer({ storage: pdfStorage });

// module.exports = { cloudinary, upload, uploadPdf};

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "coursify_videos",
    resource_type: "video",
    allowedFormats: ["mp4", "mov", "avi"],
  },
});

// Use memory storage for PDFs
const pdfStorage = multer.memoryStorage();

const upload = multer({ storage: videoStorage });
const uploadPdf = multer({ storage: pdfStorage });

// Add this after videoStorage
// const imageStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "coursify_thumbnails", // Change folder name as you like
//     resource_type: "image",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//   },
// });

// const uploadImage = multer({ storage: imageStorage });

module.exports = { cloudinary, upload, uploadPdf };



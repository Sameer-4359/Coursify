const express = require("express");
const { uploadVideo } = require("../controllers/uploadController");
const { upload } = require("../config/cloudinary"); // Multer setup

const router = express.Router();

router.post("/upload-video", upload.single("video"), uploadVideo);


module.exports = router;

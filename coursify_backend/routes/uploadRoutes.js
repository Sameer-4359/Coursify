const express = require("express");
const { uploadVideo,uploadAssignment} = require("../controllers/uploadController");
const { upload ,uploadPdf} = require("../config/cloudinary"); // Multer setup




const router = express.Router();

router.post("/upload-video", upload.single("video"), uploadVideo);
router.post(
    "/upload-assignment", 
    uploadPdf.single("pdf"), 
    uploadAssignment
  );
// router.post("/upload-course-image", uploadImage.single("image"), uploadCourseImage);

module.exports = router;

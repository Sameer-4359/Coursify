const { cloudinary } = require("../config/cloudinary");
const streamifier= require("streamifier")
const pool = require("../config/db");

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            console.log("❌ No video file received in backend");
            return res.status(400).json({ error: "No video file uploaded" });
        }

        // ✅ Ensure lessonId is provided
        const { lessonId } = req.body;
        if (!lessonId) {
            return res.status(400).json({ error: "Missing lessonId in request" });
        }

        // ✅ Ensure lesson exists
        const lessonCheck = await pool.query("SELECT * FROM lessons WHERE id = $1", [lessonId]);
        if (lessonCheck.rows.length === 0) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        // ✅ Upload video to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "coursify_videos",
        });

        console.log("✅ Video uploaded to Cloudinary:", result.secure_url);

        // ✅ Save video URL to the database
        await pool.query("UPDATE lessons SET video_url = $1 WHERE id=$2", [result.secure_url, lessonId]);

        res.json({ video_url: result.secure_url, message: "Video uploaded successfully!" });
    } catch (error) {
        console.error("❌ Video upload failed:", error.message || error);
        res.status(500).json({ error: "Failed to upload video", details: error.message });
    }
};

// For PDF assignments
exports.uploadAssignment = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const { lessonId, description } = req.body;

    // Generate a custom filename
    const originalName = req.file.originalname;
    const publicId = originalName.replace(/\.pdf$/, "").replace(/\s+/g, "_");

    // Upload buffer as raw file to Cloudinary
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "coursify_pdfs",
            public_id: publicId,
            format: "pdf",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    // Save to DB
    await pool.query(
      "UPDATE lessons SET assignment_url = $1, assignment_description = $2 WHERE id = $3",
      [result.secure_url, description, lessonId]
    );

    res.json({
      pdf_url: result.secure_url,
      message: "Assignment uploaded successfully!",
    });
  } catch (error) {
    console.error("Assignment upload failed:", error);
    res.status(500).json({ error: "Failed to upload assignment" });
  }
};

// exports.uploadCourseImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No image file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "coursify_thumbnails",
//       resource_type: "image"
//     });

//     const imageUrl = result.secure_url;
//     const { courseId } = req.body;

//     // Update database if courseId provided
//     if (courseId) {
//       await pool.query(
//         "UPDATE courses SET image_url = $1 WHERE id = $2",
//         [imageUrl, courseId]
//       );
//     }

//     res.status(200).json({
//       image_url: imageUrl,
//       message: "Course image uploaded successfully!",
//     });
//   } catch (error) {
//     console.error("❌ Course image upload failed:", error);
//     res.status(500).json({ 
//       error: "Failed to upload course image",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };
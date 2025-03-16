const { cloudinary } = require("../config/cloudinary");
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

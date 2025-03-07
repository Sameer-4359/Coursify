const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { toPng } = require("html-to-image");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const communityRoutes = require("./routes/communityRoutes");
const instructorCourseRoutes = require('./routes/instructorCourseRoute');
const courseRoutes = require('./routes/courseRoutes');
const cartRoute = require("./routes/cartRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const adminRoutes = require("./routes/adminRoute");
const path = require("path");



require("dotenv").config();

const app = express();
app.use(express.static("public")); 

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow your frontend to send requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use('/api/instructor', instructorCourseRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", enrollRoutes);
app.use("/api/admin", adminRoutes);

// API to save certificate image
app.post("/api/save-certificate", async (req, res) => {
  const { image } = req.body; // The base64 image string from frontend

  if (!image) {
    return res.status(400).send({ message: "No image provided" });
  }

  try {
    // Decode base64 string and save to a file
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const certificatePath = path.join(__dirname, "public", "certificates", `${Date.now()}.png`);

    // Ensure certificates directory exists
    if (!fs.existsSync(path.dirname(certificatePath))) {
      fs.mkdirSync(path.dirname(certificatePath), { recursive: true });
    }

    fs.writeFileSync(certificatePath, buffer);

    // Return the URL of the saved certificate
    const certificateUrl = `http://localhost:${port}/certificates/${path.basename(certificatePath)}`;
    res.status(200).send({ certificateUrl });
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).send({ message: "Failed to save certificate." });
  }
});

// Sample route to serve static files like certificate images
app.use("/certificates", express.static(path.join(__dirname, "public", "certificates")));


app.get("/", (req, res) => {
  res.send("Server is running! Try hitting the API endpoints.");
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



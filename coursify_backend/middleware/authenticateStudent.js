const jwt = require("jsonwebtoken");

const authenticateStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the student ID to the request object
    req.studentId = decoded.id; // Ensure the token payload includes the student's ID
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

module.exports = authenticateStudent;

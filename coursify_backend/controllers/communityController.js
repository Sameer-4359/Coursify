const pool = require("../config/db");

// Subscribe to community
async function subscribeToCommunity(req, res) {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    try {
        // Insert email into the community_members table
        const result = await pool.query(
            "INSERT INTO community_members (email) VALUES ($1) RETURNING *",
            [email]
        );

        res.status(201).json({
            message: "Successfully subscribed!",
            member: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23505") {
            // Duplicate email error
            return res.status(400).json({ message: "Email is already subscribed." });
        }
        console.error("Error subscribing to community:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { subscribeToCommunity };

const express = require("express");
const { subscribeToCommunity } = require("../controllers/communityController");

const router = express.Router();

// Subscribe route
router.post("/subscribe", subscribeToCommunity);

module.exports = router;

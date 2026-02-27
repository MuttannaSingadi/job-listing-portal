const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

// Get all profiles (Admin)
router.get("/profiles", protect, async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.error("ADMIN FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
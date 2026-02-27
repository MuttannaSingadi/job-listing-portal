const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

/* ================= GET ALL PROFILES (ADMIN) ================= */
router.get("/profiles", protect, async (req, res) => {
  try {
    console.log("Admin route hit by user:", req.user);

    const profiles = await Profile.find().sort({ createdAt: -1 });

    res.status(200).json(profiles);
  } catch (error) {
    console.error("ADMIN FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
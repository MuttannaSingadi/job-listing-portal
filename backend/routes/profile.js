const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

/* ================= GET PROFILE ================= */
router.get("/", protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await Profile.create({ userId: req.user.id });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/", protect, async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
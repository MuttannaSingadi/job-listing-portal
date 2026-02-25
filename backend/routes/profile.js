const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

router.put(
  "/",
  protect,
  upload.single("resume"), // ✅ Added upload middleware
  async (req, res) => {
    try {
      const updateData = req.body;

      // If resume uploaded, save path
      if (req.file) {
        updateData.resume = `/uploads/${req.file.filename}`;
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        updateData,
        { new: true, upsert: true }
      );

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
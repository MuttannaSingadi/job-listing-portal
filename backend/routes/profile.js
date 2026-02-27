const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // important for pdf
    allowed_formats: ["pdf", "doc", "docx"],
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
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put("/", protect, upload.single("resume"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    const fieldsToParse = [
      "skills",
      "education",
      "experience",
      "projects",
      "certifications",
      "links",
      "personal",
    ];

    fieldsToParse.forEach((field) => {
      if (updateData[field]) {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (err) {
          // ignore
        }
      }
    });

    if (req.file) {
     updateData.resume = req.file.path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      { new: true, upsert: true }
    );

    res.json(updatedProfile);

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
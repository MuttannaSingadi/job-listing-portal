const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* ================= CLOUDINARY STORAGE SETUP ================= */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const nameWithoutExt =
      originalName.substring(0, originalName.lastIndexOf(".")) ||
      originalName;

    return {
      folder: "resumes",
      resource_type: "image",  // treat PDF properly
      allowed_formats: ["pdf"],

      type: "upload",          // ✅ make it public
      access_mode: "public",   // ✅ prevent 401 error

      public_id: nameWithoutExt,
    };
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

    // Safely parse JSON fields
    fieldsToParse.forEach((field) => {
      if (updateData[field]) {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (err) {
          console.log(`Skipping parse for ${field}`);
        }
      }
    });

    // If resume uploaded
    if (req.file) {
      updateData.resume = req.file.path; // Cloudinary URL
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
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

    const extension = originalName.split(".").pop();

    return {
      folder: "resumes",
      resource_type: "raw",
      allowed_formats: ["pdf"],
      public_id: nameWithoutExt,
      format: extension,
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
    console.error("GET PROFILE ERROR:");
    console.error(error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put("/", protect, upload.single("resume"), async (req, res) => {
  try {
    const updateData = {};

    // Normal text fields
    updateData.name = req.body.name || "";
    updateData.role = req.body.role || "";
    updateData.location = req.body.location || "";
    updateData.email = req.body.email || "";
    updateData.phone = req.body.phone || "";
    updateData.summary = req.body.summary || "";

    // Safely parse JSON fields
    const parseField = (field) => {
      if (!req.body[field]) return [];
      try {
        return JSON.parse(req.body[field]);
      } catch {
        return [];
      }
    };

    updateData.skills = parseField("skills");
    updateData.education = parseField("education");
    updateData.experience = parseField("experience");
    updateData.projects = parseField("projects");
    updateData.certifications = parseField("certifications");

    // Objects
    try {
      updateData.links = req.body.links
        ? JSON.parse(req.body.links)
        : {};
    } catch {
      updateData.links = {};
    }

    try {
      updateData.personal = req.body.personal
        ? JSON.parse(req.body.personal)
        : {};
    } catch {
      updateData.personal = {};
    }

    // If resume uploaded
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
    console.error("UPDATE PROFILE ERROR:");
    console.error(error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
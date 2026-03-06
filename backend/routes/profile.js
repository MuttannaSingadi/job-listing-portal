const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isResume = file.fieldname === "resume";
    return {
      folder: isResume ? "resumes" : "profile_images",
      resource_type: isResume ? "raw" : "image",
      public_id: `${Date.now()}-${file.fieldname}`,
    };
  },
});

const upload = multer({ storage });

// GET Profile
router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Profile
router.put("/", protect, upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profileImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({ userId: req.user.id });

    // Safe JSON Parsing helper
    const safeParse = (data, fallback) => {
      try { return data ? JSON.parse(data) : fallback; } 
      catch (e) { return fallback; }
    };

    const updateData = {
      name: req.body.name,
      role: req.body.role,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
      summary: req.body.summary,
      skills: safeParse(req.body.skills, []),
      education: safeParse(req.body.education, []),
      experience: safeParse(req.body.experience, []),
      certifications: safeParse(req.body.certifications, []),
      links: safeParse(req.body.links, {}),
      personal: safeParse(req.body.personal, {}),
    };

    // Handle File Paths from Cloudinary
    if (req.files?.resume) {
      updateData.resume = req.files.resume[0].path;
    }
    if (req.files?.profileImage) {
      updateData.profileImage = req.files.profileImage[0].path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
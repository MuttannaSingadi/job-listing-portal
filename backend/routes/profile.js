const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile"); 
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: file.fieldname === "resume" ? "resumes" : "profile_images",
    resource_type: file.fieldname === "resume" ? "raw" : "image",
    public_id: Date.now() + "-" + file.fieldname,
  }),
});

const upload = multer({ storage });

router.put("/", protect, upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profileImage", maxCount: 1 }
]), async (req, res) => {
  try {
    // SAFETY CHECK: If this triggers, your 'require' at the top is wrong
    if (!Profile || typeof Profile.findOne !== 'function') {
      console.error("CRITICAL ERROR: Profile Model not loaded correctly. Check models/Profile.js exports.");
      return res.status(500).json({ message: "Backend Configuration Error: Model not found" });
    }

    const existingProfile = await Profile.findOne({ userId: req.user.id });

    const safeParse = (value, defaultValue) => {
      try { return value ? JSON.parse(value) : defaultValue; } 
      catch { return defaultValue; }
    };

    const updateData = {
      name: req.body.name || "",
      role: req.body.role || "",
      location: req.body.location || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      summary: req.body.summary || "",
      skills: safeParse(req.body.skills, []),
      education: safeParse(req.body.education, []),
      experience: safeParse(req.body.experience, []),
      certifications: safeParse(req.body.certifications, []),
      links: safeParse(req.body.links, {}),
      personal: safeParse(req.body.personal, {}),
      resume: existingProfile?.resume || "",
      profileImage: existingProfile?.profileImage || ""
    };

    if (req.files?.resume) updateData.resume = req.files.resume[0].path;
    if (req.files?.profileImage) updateData.profileImage = req.files.profileImage[0].path;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error("500 ERROR DETAILS:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
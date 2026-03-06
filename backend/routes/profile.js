const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* ================= CLOUDINARY STORAGE ================= */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "uploads";
    let resourceType = "auto";

    if (file.fieldname === "resume") {
      folderName = "resumes";
      resourceType = "raw"; 
    } else if (file.fieldname === "profileImage") {
      folderName = "profile_images";
      resourceType = "image";
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      public_id: Date.now() + "-" + file.fieldname,
    };
  },
});

const upload = multer({ storage });

/* ================= GET PROFILE ================= */

router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.json({});
    res.json(profile);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put(
  "/",
  protect,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existingProfile = await Profile.findOne({ userId: req.user.id });

      const safeParse = (value, defaultValue) => {
        try {
          return value ? JSON.parse(value) : defaultValue;
        } catch {
          return defaultValue;
        }
      };

      // Construct update object
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
        projects: safeParse(req.body.projects, []),
        certifications: safeParse(req.body.certifications, []),
        links: safeParse(req.body.links, {}),
        personal: safeParse(req.body.personal, {}),
      };

      // Keep existing file URLs by default
      updateData.resume = existingProfile?.resume || "";
      updateData.profileImage = existingProfile?.profileImage || "";

      // Update with new file paths if uploaded
      if (req.files && req.files.resume) {
        updateData.resume = req.files.resume[0].path;
      }
      if (req.files && req.files.profileImage) {
        updateData.profileImage = req.files.profileImage[0].path;
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: updateData },
        { new: true, upsert: true }
      );

      res.json(updatedProfile);
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);

module.exports = router;
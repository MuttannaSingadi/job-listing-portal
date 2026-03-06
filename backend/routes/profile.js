const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* ================= CLOUDINARY STORAGE SETUP ================= */

/* ================= CLOUDINARY STORAGE ================= */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {

    if (file.fieldname === "resume") {
      return {
        folder: "resumes",
        resource_type: "raw",
        public_id: Date.now() + "-resume"
      };
    }

    if (file.fieldname === "profileImage") {
      return {
        folder: "profile_images",
        resource_type: "image",
        public_id: Date.now() + "-profile"
      };
    }

    return {
      folder: "uploads"
    };

  }
});

const upload = multer({ storage });

/* ================= GET PROFILE ================= */

router.get("/", protect, async (req, res) => {
  try {

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.json({});
    }

    res.json(profile);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put(
  "/",
  protect,
  (req, res, next) => {

    const uploadFields = upload.fields([
      { name: "resume", maxCount: 1 },
      { name: "profileImage", maxCount: 1 }
    ]);

    uploadFields(req, res, function (err) {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(500).json({ message: err.message });
      }
      next();
    });

  },

  async (req, res) => {

    try {

      console.log("BODY RECEIVED:", req.body);
      console.log("FILES RECEIVED:", req.files);

      /* GET EXISTING PROFILE */

      const existingProfile = await Profile.findOne({ userId: req.user.id });

      const updateData = {
        resume: existingProfile?.resume || "",
        profileImage: existingProfile?.profileImage || ""
      };

      /* NORMAL FIELDS */

      updateData.name = req.body.name || "";
      updateData.role = req.body.role || "";
      updateData.location = req.body.location || "";
      updateData.email = req.body.email || "";
      updateData.phone = req.body.phone || "";
      updateData.summary = req.body.summary || "";

      /* SAFE JSON PARSER */

      const safeParse = (value, defaultValue) => {
        try {
          return value ? JSON.parse(value) : defaultValue;
        } catch {
          return defaultValue;
        }
      };

      updateData.skills = safeParse(req.body.skills, []);
      updateData.education = safeParse(req.body.education, []);
      updateData.experience = safeParse(req.body.experience, []);
      updateData.projects = safeParse(req.body.projects, []);
      updateData.certifications = safeParse(req.body.certifications, []);
      updateData.links = safeParse(req.body.links, {});
      updateData.personal = safeParse(req.body.personal, {});

      /* RESUME FILE */

      if (req.files?.resume) {
        updateData.resume = req.files.resume[0].path;
      }

      /* PROFILE IMAGE */

      if (req.files?.profileImage) {
        updateData.profileImage = req.files.profileImage[0].path;
      }

      /* UPDATE DATABASE */

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        updateData,
        { new: true, upsert: true }
      );

      res.json(updatedProfile);

    } catch (error) {

      console.error("UPDATE PROFILE ERROR:", error.message);
      res.status(500).json({ message: error.message });

    }

  }
);

module.exports = router;
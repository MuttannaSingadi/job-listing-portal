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
    return {
      folder: "resumes",
      resource_type: "raw",
      allowed_formats: ["pdf"],
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
      format: file.originalname.split(".").pop(),
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
    console.error("GET PROFILE ERROR:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put(
  "/",
  protect,
  (req, res, next) => {
    upload.single("resume")(req, res, function (err) {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(500).json({ message: "File upload failed" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("BODY RECEIVED:", req.body);
      console.log("FILE RECEIVED:", req.file);

      const updateData = {};

      // Normal fields
      updateData.name = req.body.name || "";
      updateData.role = req.body.role || "";
      updateData.location = req.body.location || "";
      updateData.email = req.body.email || "";
      updateData.phone = req.body.phone || "";
      updateData.summary = req.body.summary || "";

      // Safe JSON parser
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

      // Resume upload
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
      console.error("UPDATE PROFILE ERROR:", error.message);
      console.error(error.stack);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
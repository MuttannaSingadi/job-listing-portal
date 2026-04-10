const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// CLOUDINARY STORAGE

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: file.fieldname === "resume" ? "resumes" : "profile_images",
    resource_type: "auto",
    public_id: Date.now() + "-" + file.originalname.split(".")[0],
  }),
});

const upload = multer({ storage });

// GET PROFILE

router.get("/", protect, async (req, res) => {
  try {

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.json({});
    }

    res.json(profile);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE

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
};


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
      console.error("PROFILE UPDATE ERROR:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
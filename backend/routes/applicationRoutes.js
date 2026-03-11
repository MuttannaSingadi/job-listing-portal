const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/apply", upload.single("resume"), async (req, res) => {

  try {

    if (!req.body) {
      return res.status(400).json({ msg: "No form data received" });
    }

    const { jobId, jobTitle, applicantName, applicantEmail, phone } = req.body;

    if (!jobId || !applicantName || !applicantEmail) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    let resumeUrl = "";

    // Upload resume to Cloudinary
    if (req.file) {

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "resumes",
          resource_type: "auto"
        }
      );

      resumeUrl = uploadResult.secure_url;
    }

    const application = new Application({
      jobId,
      jobTitle,
      applicantName,
      applicantEmail,
      phone,
      resumeUrl
    });

    await application.save();

    res.json({ msg: "Application submitted successfully" });

  } catch (error) {

    console.log("APPLICATION ERROR:", error);
    res.status(500).json({ msg: "Server error" });

  }

});


// GET ALL APPLICATIONS (for employer dashboard)
router.get("/", async (req, res) => {

  try {

    const applications = await Application
      .find()
      .populate("jobId");

    res.json(applications);

  } catch (error) {

    console.log(error);
    res.status(500).json({ msg: "Server error" });

  }

});

module.exports = router;
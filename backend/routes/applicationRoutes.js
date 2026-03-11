const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/apply", upload.single("resume"), async (req, res) => {

  try {

    if (!req.body) {
      return res.status(400).json({ msg: "No form data received" });
    }

    const jobId = req.body.jobId;
    const jobTitle = req.body.jobTitle;
    const applicantName = req.body.applicantName;
    const applicantEmail = req.body.applicantEmail;
    const phone = req.body.phone;

    if (!jobId || !applicantName || !applicantEmail) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const resumeUrl = req.file ? req.file.originalname : "";

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

module.exports = router;
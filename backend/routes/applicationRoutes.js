const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// APPLY JOB
router.post("/apply", async (req, res) => {

  try {

    const { jobId, jobTitle, applicantName, applicantEmail, phone, resume } = req.body;

    if (!jobId || !jobTitle || !applicantName || !applicantEmail) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const newApplication = new Application({
      jobId,
      jobTitle,
      applicantName,
      applicantEmail,
      phone,
      resume
    });

    await newApplication.save();

    res.json({ msg: "Application submitted successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ msg: "Server Error" });

  }

});


// GET ALL APPLICATIONS
router.get("/", async (req, res) => {

  try {

    const applications = await Application.find().populate("jobId");

    res.json(applications);

  } catch (error) {

    res.status(500).json({ msg: "Server Error" });

  }

});

module.exports = router;
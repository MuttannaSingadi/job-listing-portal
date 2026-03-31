const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET recommended jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isRecommended: true });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommended jobs" });
  }
});

// TOGGLE recommended
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.isRecommended = !job.isRecommended;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
});

module.exports = router;
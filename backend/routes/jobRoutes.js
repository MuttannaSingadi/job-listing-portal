const express = require("express");
const router = express.Router();

const { createJob, getJobs, searchJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/search", searchJobs);


//  ADD THESE 

router.delete("/:id", protect, async (req, res) => {
  try {
    const Job = require("../models/Job");

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting job" });
  }
});


// UPDATE JOB
router.put("/:id", protect, async (req, res) => {
  try {
    const Job = require("../models/Job");

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating job" });
  }
});

module.exports = router;
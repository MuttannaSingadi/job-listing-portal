const express = require("express");
const router = express.Router();
router.get("/", getJobs);
router.get("/search", searchJobs);

const { createJob, getJobs, searchJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Create Job
router.post("/create", createJob);

// ✅ Get All Jobs
router.get("/", getJobs);

// ✅ Search Jobs
router.get("/search", searchJobs);

module.exports = router;
const express = require("express");
const router = express.Router();

const { createJob, getJobs, searchJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// ✅ FIXED ROUTES
router.post("/", protect, createJob);   // now matches frontend
router.get("/", getJobs);
router.get("/search", searchJobs);

module.exports = router;
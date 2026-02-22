const express = require("express");
const router = express.Router();

// ✅ IMPORT FIRST
const { createJob, getJobs, searchJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// ✅ ROUTES
router.post("/create", protect, createJob);   // protected create
router.get("/", getJobs);
router.get("/search", searchJobs);

module.exports = router;
const express = require("express");
const router = express.Router();

// ✅ IMPORT FIRST (VERY IMPORTANT)
const { createJob, getJobs, searchJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// ✅ ROUTES AFTER IMPORT
router.post("/create", createJob);
router.get("/", getJobs);
router.get("/search", searchJobs);

module.exports = router;
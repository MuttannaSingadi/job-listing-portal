const Job = require("../models/Job");

// ✅ Create Job (Admin only)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating job" });
  }
};

// ✅ Get All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

// ✅ Search Jobs
exports.searchJobs = async (req, res) => {
  try {
    const { title, location, experience, skills } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (experience) {
      query.experience = Number(experience);
    }

    if (skills) {
      query.skills = { $regex: skills, $options: "i" };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error searching jobs" });
  }
};
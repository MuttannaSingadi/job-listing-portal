const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// GET profile
router.get("/profile/:email", async (req, res) => {
  try {

    const employee = await Employee.findOne({
      email: req.params.email
    });

    res.json(employee);

  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE profile
router.put("/profile", async (req, res) => {
  try {

    const updated = await Employee.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
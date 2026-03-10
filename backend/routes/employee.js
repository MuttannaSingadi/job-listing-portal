const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");


// CREATE or UPDATE PROFILE
router.put("/profile", async (req, res) => {
  try {

    let employee = await Employee.findOne({ email: req.body.email });

    if (employee) {

      employee = await Employee.findOneAndUpdate(
        { email: req.body.email },
        req.body,
        { new: true }
      );

    } else {

      employee = new Employee(req.body);
      await employee.save();

    }

    res.json(employee);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
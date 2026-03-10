const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

router.put("/profile", async (req, res) => {
  try {

    const { email } = req.body;

    let employee = await Employee.findOne({ email });

    if (employee) {

      employee = await Employee.findOneAndUpdate(
        { email },
        req.body,
        { new: true }
      );

    } else {

      employee = new Employee(req.body);
      await employee.save();

    }

    res.json(employee);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server Error" });

  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const upload = require("../middleware/upload");

// PUT /api/employee/profile
router.put("/profile", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, name, phone, role, company, location, website } = req.body;

    let employee = await Employee.findOne({ email });

    let profileImagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (employee) {
      employee = await Employee.findOneAndUpdate(
        { email },
        {
          name,
          phone,
          role,
          company,
          location,
          website,
          ...(profileImagePath && { profileImage: profileImagePath }),
        },
        { new: true }
      );
    } else {
      employee = new Employee({
        email,
        name,
        phone,
        role,
        company,
        location,
        website,
        profileImage: profileImagePath,
      });
      await employee.save();
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
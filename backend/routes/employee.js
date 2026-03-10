const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth"); // JWT auth middleware

// Serve uploads folder statically in server.js/app.js
// app.use('/uploads', express.static('uploads'));

// PUT /api/employee/profile
router.put("/profile", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    // Get logged-in user from auth middleware
    const userEmail = req.user.email; 

    const { name, phone, role, company, location, website } = req.body;
    let profileImagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    let employee = await Employee.findOne({ email: userEmail });

    if (employee) {
      // Update existing employee
      employee = await Employee.findOneAndUpdate(
        { email: userEmail },
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
      // Create new employee profile if not exists
      employee = new Employee({
        email: userEmail,
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
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
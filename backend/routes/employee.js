// backend/routes/employee.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth"); // JWT auth middleware

// Use memory storage to avoid disk issues on Render
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email; // set by authMiddleware
    const employee = await Employee.findOne({ email });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= PUT PROFILE ================= */
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, phone, role, company, location, website } = req.body;

      const email = req.user.email;

      let employee = await Employee.findOne({ email });

      let profileImageData = employee?.profileImage || "";

      if (req.file) {
        profileImageData = req.file.buffer.toString("base64");
      }

      const employeeData = {
        name,
        phone,
        role,
        company,
        location,
        website,
        profileImage: profileImageData,
      };

      if (employee) {
        // Update existing employee
        employee = await Employee.findOneAndUpdate({ email }, employeeData, {
          new: true,
        });
      } else {
        // Create new employee
        employee = new Employee({ email, ...employeeData });
        await employee.save();
      }

      res.json(employee);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;

// backend/routes/employee.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth"); // your JWT auth middleware

// Use memory storage to avoid disk issues on Render
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Assuming authMiddleware sets req.user.email
    const email = req.user.email;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= PUT PROFILE ================= */
router.put("/profile", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, role, company, location, website } = req.body;

    // Optional: store image as Base64 for Render
    let profileImageData = req.file ? req.file.buffer.toString("base64") : undefined;

    let employee = await Employee.findOne({ email });

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
          ...(profileImageData && { profileImage: profileImageData }),
        },
        { new: true }
      );
    } else {
      employee = new Employee({
        name,
        email,
        phone,
        role,
        company,
        location,
        website,
        profileImage: profileImageData,
      });
      await employee.save();
    }

    res.json(employee);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
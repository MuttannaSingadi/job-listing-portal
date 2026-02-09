const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// ===============================
// EMAIL TRANSPORTER
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// SIGNUP
// ===============================
router.post("/signup", async (req, res) => {
  try {
    console.log("✅ Signup API called");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("✅ User saved in DB");

    // ===============================
    // SEND CONFIRMATION EMAIL
    // ===============================
    console.log("📩 Sending email to:", email);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Registration Successful ✅",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Hello ${name} 👋</h2>
          <p>Your registration has been completed successfully.</p>
          <p>You can now login to your account.</p>
          <br/>
          <p>Regards,<br/><b>Job Portal Team</b></p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");

    res.json({ msg: "Signup successful. Confirmation email sent." });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    res.status(500).json({ msg: "Email failed or server error" });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong Password" });

    res.json({ msg: "Login successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===============================
// RESET PASSWORD
// ===============================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

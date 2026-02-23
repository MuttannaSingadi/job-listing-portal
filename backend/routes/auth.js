const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const User = require("../models/User");

const router = express.Router();

// ✅ Safe Resend Initialization
let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.log("⚠️ RESEND_API_KEY not found. Email sending disabled.");
}


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    let {
      role,
      name,
      email,
      password,
      phone,
      location,
      companyName,
      contactPerson,
      companyLocation,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password required" });
    }

    // Employer uses company name
    if (role === "employer") {
      name = companyName;
    }

    if (!name) {
      return res.status(400).json({ msg: "Name required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      role,
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      companyName,
      contactPerson,
      companyLocation,
    });

    await user.save();

    res.status(201).json({ msg: "Registration successful ✅" });

    // ✅ Send email only if resend exists
    if (resend) {
      setImmediate(async () => {
        try {
          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Registration Successful ✅",
            html: `
              <div style="font-family: Arial; padding:20px;">
                <h2>Hello ${name} 👋</h2>
                <p>Your account has been created successfully.</p>
                <p>You can now login.</p>
                <br/>
                <p><b>Job Portal Team</b></p>
              </div>
            `,
          });
        } catch (err) {
          console.log("Email error:", err.message);
        }
      });
    }

  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong Password" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (error) {
    console.log("Reset Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
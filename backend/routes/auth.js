const express = require("express");
const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const User = require("../models/User");

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    console.log("✅ Signup API called");

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

    // ⭐ employer → use company name as main name
    if (role === "employer") {
      name = companyName;
    }

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
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
    console.log("✅ User saved");

    res.json({ msg: "Registration successful ✅" });

    // send mail in background
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

        console.log("✅ Email sent");
      } catch (err) {
        console.log("⚠ Email error:", err.message);
      }
    });

  } catch (error) {
    console.log("❌ SERVER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong Password" });

    res.json({
      msg: "Login successful",
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= RESET =================
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
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

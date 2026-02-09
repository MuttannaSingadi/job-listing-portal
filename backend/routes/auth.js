const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// SIGNUP

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ msg: "Signup successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN

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

// RESET PASSWORD

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

const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res) => {

  try {

    const email = req.query.email;

    const notifications = await Notification.find({
      userEmail: email
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    console.log(error);
    res.status(500).json({ msg: "Server error" });

  }

});

module.exports = router;
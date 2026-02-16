const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["jobseeker", "employer"],
      default: "jobseeker",
    },

    // main display name
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // extra profile fields
    phone: String,
    location: String,
    companyName: String,
    contactPerson: String,
    companyLocation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

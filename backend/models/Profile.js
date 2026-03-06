const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  location: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  summary: { type: String, default: "" },
  resume: { type: String, default: "" },
  profileImage: { type: String, default: "" }, // Ensure this is here!
  skills: [String],
  education: [Object],
  experience: [Object],
  projects: [Object],
  certifications: [Object],
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
  personal: {
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    languages: { type: String, default: "" },
  },
}, { timestamps: true });

// CRITICAL: This must be exactly this line. 
// Do not wrap it in an object like { Profile: ... }
module.exports = mongoose.model("Profile", ProfileSchema);
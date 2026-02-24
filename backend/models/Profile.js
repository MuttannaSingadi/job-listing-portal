const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        title: String,
        company: String,
        year: String,
      },
    ],

    education: [
      {
        level: String,
        university: String,
        course: String,
        specialization: String,
        courseType: String,
        startDate: Date,
        endDate: Date,
        completed: Boolean,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        skills: [String],
        status: String,
      },
    ],

    certifications: [
      {
        name: String,
        organization: String,
      },
    ],

    links: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    personal: {
      dob: Date,
      gender: String,
      languages: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
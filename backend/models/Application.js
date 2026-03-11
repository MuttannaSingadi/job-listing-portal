const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    applicantName: {
      type: String,
      required: true,
    },

    applicantEmail: {
      type: String,
      required: true,
    },

    phone: String,

    resumeUrl: {
      type: String
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
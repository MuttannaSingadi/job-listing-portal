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

    phone: {
      type: String,
    },

    resumeUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Interview", "SecondRound", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);

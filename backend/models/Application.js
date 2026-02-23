const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // MUST match Job model name
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
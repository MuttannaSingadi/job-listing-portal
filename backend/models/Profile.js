import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  role: String,
  location: String,
  phone: String,
  email: String,
  skills: [String],
  education: [
    {
      degree: String,
      university: String,
      year: String,
    }
  ],
  experience: [
    {
      title: String,
      company: String,
      year: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
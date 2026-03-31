const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  phone: String,
  role: String,
  company: String,
  location: String,
  website: String,

  profileImage: String

},
{ timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
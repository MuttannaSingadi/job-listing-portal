const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  role: {
    type: String
  },

  company: {
    type: String
  },

  location: {
    type: String
  },

  website: {
    type: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
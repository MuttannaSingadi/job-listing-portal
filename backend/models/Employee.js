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

/* ================= GET ALL PROFILES (CANDIDATES) ================= */
router.get("/profiles", async (req, res) => {
  try {
    const profiles = await Employee.find();

    res.json(profiles);

  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
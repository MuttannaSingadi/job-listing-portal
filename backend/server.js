const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-listing-portal-755q.vercel.app",
    ],
    credentials: true,
  })
);

/* ================= STATIC UPLOADS ================= */
// 🔥 FIXED (absolute path)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================= TEST ================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/admin", require("./routes/admin"));
/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


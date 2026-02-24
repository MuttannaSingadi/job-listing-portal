import profileRoutes from "./routes/profile.js";


const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use("/api/profile", profileRoutes);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-listing-portal-755q.vercel.app",
    ],
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
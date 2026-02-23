import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  useEffect(() => {
    axios.get(`${API}/api/jobs`).then(res => setJobs(res.data));
  }, []);

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="brand">DevHire</h2>

        <ul>
          <li onClick={() => setActive("dashboard")}>Dashboard</li>
          <li onClick={() => setActive("post")}>Post Job</li>
          <li onClick={() => setActive("manage")}>Applications</li>
          <li>Messages</li>
          <li>Statistics</li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* MAIN AREA */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <input type="text" placeholder="Search something here..." />
          <div className="top-icons">
            <span>🔔</span>
            <span>💬</span>
            <div className="profile-mini">A</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {active === "dashboard" && (
            <div className="cards">
              <div className="card">
                <h3>Total Jobs</h3>
                <p>{jobs.length}</p>
              </div>
              <div className="card">
                <h3>Total Users</h3>
                <p>124</p>
              </div>
              <div className="card">
                <h3>Applications</h3>
                <p>45</p>
              </div>
            </div>
          )}

          {active === "manage" && (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <p>₹ {job.salary}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* RIGHT PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-avatar">A</div>
        <h3>Admin User</h3>
        <p>System Administrator</p>

        <div className="profile-stats">
          <div>
            <strong>{jobs.length}</strong>
            <span>Jobs</span>
          </div>
          <div>
            <strong>124</strong>
            <span>Users</span>
          </div>
        </div>
      </div>

    </div>
  );
}
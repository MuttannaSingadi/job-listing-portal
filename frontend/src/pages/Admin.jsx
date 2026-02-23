import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [jobs, setJobs] = useState([]);

  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
    experience: "",
    skills: "",
  });

  // Protect Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API}/api/jobs/create`, job, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job posted successfully ✅");

      setJob({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: "",
        experience: "",
        skills: "",
      });

      fetchJobs();
      setActive("manage");
    } catch (err) {
      alert("Unauthorized ❌");
    }
  };

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="brand">DevHire</h2>

        <ul>
          <li onClick={() => setActive("dashboard")}>Dashboard</li>
          <li onClick={() => setActive("post")}>Post Job</li>
          <li onClick={() => setActive("manage")}>Manage Jobs</li>
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

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="cards">
            <div className="card">
              <h3>Total Jobs</h3>
              <p>{jobs.length}</p>
            </div>
            <div className="card">
              <h3>System Status</h3>
              <p>Active</p>
            </div>
            <div className="card">
              <h3>Platform</h3>
              <p>DevHire Portal</p>
            </div>
          </div>
        )}

        {/* POST JOB */}
        {active === "post" && (
          <div className="post-section">
            <h2>Post New Job</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
              <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
              <input name="company" placeholder="Company Name" value={job.company} onChange={handleChange} required />
              <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
              <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
              <input name="experience" placeholder="Experience (0 = Fresher)" value={job.experience} onChange={handleChange} required />
              <input name="skills" placeholder="Skills (React, Node, MongoDB)" value={job.skills} onChange={handleChange} required />
              <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
              <button type="submit">Post Job</button>
            </form>
          </div>
        )}

        {/* MANAGE JOBS */}
        {active === "manage" && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p>₹ {job.salary}</p>
                <p>{job.location}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* PROFILE CARD */}
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
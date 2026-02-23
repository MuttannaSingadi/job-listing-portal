import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
    experience: "",
    skills: "",
  });

  const [jobs, setJobs] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");

  // 🔐 Protect admin page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/auth");
    }
  }, [navigate]);

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);
      setJobs(res.data);
    } catch (error) {
      console.log(error.message);
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

    try {
      const token = localStorage.getItem("token");

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
      setActiveSection("manage");
    } catch (error) {
      alert("Unauthorized ❌");
    }
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <div className="sidebar-menu">
          <button onClick={() => setActiveSection("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setActiveSection("post")}>
            Post Job
          </button>

          <button onClick={() => setActiveSection("manage")}>
            Manage Jobs
          </button>

          <button onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">

        {activeSection === "dashboard" && (
          <div className="dashboard-section">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Jobs</h3>
                <p>{jobs.length}</p>
              </div>

              <div className="stat-card">
                <h3>System Status</h3>
                <p>Active</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "post" && (
          <div className="post-section">
            <h1>Post New Job</h1>

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

        {activeSection === "manage" && (
          <div className="manage-section">
            <h1>Manage Jobs</h1>

            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <p>₹ {job.salary}</p>
                  <p>{job.location}</p>
                  <p>{job.experience} Years</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
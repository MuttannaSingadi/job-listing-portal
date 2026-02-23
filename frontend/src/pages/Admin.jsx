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

  const adminName = "Admin User";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/auth");
    }
  }, [navigate]);

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
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API}/api/jobs/create`, job, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job posted successfully ✅");
      fetchJobs();
      setActiveSection("manage");

      setJob({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: "",
        experience: "",
        skills: "",
      });
    } catch (error) {
      alert("Unauthorized ❌");
    }
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2 className="logo">DevHire Admin</h2>

        <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveSection("post")}>Post Job</button>
        <button onClick={() => setActiveSection("manage")}>Manage Jobs</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">

        {/* TOPBAR */}
        <div className="admin-topbar">
          <h1>{activeSection.toUpperCase()}</h1>
          <div className="profile-box">
            <div className="profile-circle">A</div>
            <span>{adminName}</span>
          </div>
        </div>

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="dashboard-cards">
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
        {activeSection === "post" && (
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
        )}

        {/* MANAGE JOBS */}
        {activeSection === "manage" && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>₹ {job.salary}</p>
                <p>{job.location}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
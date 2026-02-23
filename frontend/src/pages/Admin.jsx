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
      console.log("Fetch error:", error.response?.data || error.message);
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
      if (!token) {
        alert("Login required");
        return;
      }

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
    } catch (error) {
      alert(error.response?.data?.msg || "Unauthorized ❌");
    }
  };

  return (
    <div className="admin-page">

      {/* DASHBOARD HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Total Jobs Posted: {jobs.length}</p>
      </div>

      {/* POST JOB SECTION */}
      <div className="dashboard-card">
        <h2>Post New Job</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
          <input type="text" name="company" placeholder="Company Name" value={job.company} onChange={handleChange} required />
          <input type="text" name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
          <input type="number" name="experience" placeholder="Experience (0 = Fresher)" value={job.experience} onChange={handleChange} required />
          <input type="text" name="skills" placeholder="Skills (React, Node, MongoDB)" value={job.skills} onChange={handleChange} required />
          <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
          <button type="submit">Post Job</button>
        </form>
      </div>

      {/* JOB LIST SECTION */}
      <div className="dashboard-card">
        <h2>All Posted Jobs</h2>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p>No jobs available 🚀</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>

                <div className="details">
                  <div>💰 ₹{job.salary}</div>
                  <div>📍 {job.location}</div>
                  <div>
                    👨‍💻 {job.experience === 0 ? "Fresher" : `${job.experience} Years`}
                  </div>
                </div>

                <p className="desc">{job.description}</p>

                <div className="skill-tags">
                  {job.skills
                    ? job.skills.split(",").map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))
                    : "Not specified"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
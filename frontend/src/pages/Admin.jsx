import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/admin.css";
import AdminNavbar from "../components/AdminNavbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API =
  import.meta.env.VITE_API_URL ||
  "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
    experience: "",
    skills: "",
  });

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  /* ================= FETCH DATA ================= */
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/admin/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchProfiles();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API}/api/jobs`, job, {
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
      alert("Error posting job ❌");
    }
  };

  /* ================= DATA ================= */
  const statsData = [
    { name: "Jobs", value: jobs.length },
    { name: "Applications", value: applications.length },
    { name: "Candidates", value: profiles.length },
  ];

  const colors = ["#4f46e5", "#22c55e", "#f59e0b"];

  return (
    <div className="admin-wrapper">

      {/* ✅ Navbar */}
      <AdminNavbar
        navigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setActive={setActive}
      />

      <div className="main">

        {/* ================= DASHBOARD ================= */}
        {active === "dashboard" && (
          <div className="dashboard">

            <div className="cards">
              <div className="card">
                <h3>Total Jobs</h3>
                <p>{jobs.length}</p>
              </div>

              <div className="card">
                <h3>Total Applications</h3>
                <p>{applications.length}</p>
              </div>

              <div className="card">
                <h3>Total Candidates</h3>
                <p>{profiles.length}</p>
              </div>
            </div>

            <div className="dashboard-graphs">

              {/* BAR */}
              <div className="graph-card">
                <h3>Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE */}
              <div className="graph-card">
                <h3>Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statsData} dataKey="value" outerRadius={100}>
                      {statsData.map((_, i) => (
                        <Cell key={i} fill={colors[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {/* ================= POST JOB ================= */}
        {active === "post" && (
          <div className="post-section">
            <h2>Post Job</h2>
            <form onSubmit={handleSubmit}>
              <input name="title" placeholder="Title" value={job.title} onChange={handleChange} required />
              <input name="company" placeholder="Company" value={job.company} onChange={handleChange} required />
              <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
              <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
              <input name="experience" placeholder="Experience" value={job.experience} onChange={handleChange} required />
              <input name="skills" placeholder="Skills" value={job.skills} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={job.description} onChange={handleChange} required />
              <button type="submit">Post Job</button>
            </form>
          </div>
        )}

        {/* ================= MANAGE JOBS ================= */}
        {active === "manage" && (
          <div className="jobs-grid">
            {jobs.map((j) => (
              <div key={j._id} className="job-card">
                <h4>{j.title}</h4>
                <p>{j.company}</p>
                <p>₹ {j.salary}</p>
                <p>{j.location}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= APPLICATIONS ================= */}
        {active === "applications" && (
          <div className="jobs-grid">
            {applications.length === 0 ? (
              <p>No applications</p>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="job-card">
                  <h4>{app.jobId?.title}</h4>
                  <p>{app.applicantEmail}</p>
                  <p>{app.jobId?.company}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= PROFILES ================= */}
        {active === "profiles" && (
          <div className="jobs-grid">
            {profiles.length === 0 ? (
              <p>No candidates</p>
            ) : (
              profiles.map((p) => (
                <div key={p._id} className="job-card">
                  <h3>{p.name}</h3>
                  <p>{p.email}</p>
                  <p>{p.location}</p>
                  <p>{p.skills?.join(", ")}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
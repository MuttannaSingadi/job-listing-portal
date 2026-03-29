import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/admin.css";
import profile from "../assets/image.png";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/image.png";
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

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(res.data);
    } catch (err) {
      console.log("Jobs fetch error:", err.response?.data || err.message);
    }
  };

  const statsData = [
    { name: "Jobs", value: jobs?.length || 0 },
    { name: "Applications", value: applications?.length || 0 },
    { name: "Candidates", value: profiles?.length || 0 }
  ];

  const pieColors = ["#4f46e5", "#22c55e", "#f59e0b"];

  /* ================= FETCH APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data);
    } catch (err) {
      console.log(
        "Applications fetch error:",
        err.response?.data || err.message
      );
    }
  };

  /* ================= FETCH PROFILES ================= */
  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/admin/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfiles(res.data);
    } catch (err) {
      console.log(
        "Profiles fetch error:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchProfiles();
  }, []);

  /* ================= POST JOB ================= */
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
      alert(err.response?.data?.message || "Unauthorized ❌");
    }
  };


  return (
    <div className="admin-wrapper">

      {/* ===== TOP NAVBAR ===== */}
      <div className="top-navbar">

        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>


          {/* Logo */}
          <div className="brand">
            <Link to="/">
              <img src={logo} alt="DevHire Logo" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>

        <div className={`nav-center ${menuOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => { setActive("dashboard"); setMenuOpen(false); }}>Dashboard</li>
            <li onClick={() => { setActive("post"); setMenuOpen(false); }}>Post Job</li>
            <li onClick={() => { setActive("manage"); setMenuOpen(false); }}>Manage Jobs</li>
            <li onClick={() => { setActive("applications"); setMenuOpen(false); }}>Applications</li>
            <li onClick={() => { setActive("profiles"); setMenuOpen(false); }}>Candidates</li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="profile-img">
            <img src={profile} alt="Profile" />
          </div>
          <button className="logout-btn">Logout</button>
        </div>

      </div>

      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}


      {/* MAIN */}
      <div className="main">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="dashboard">

            {/* STATS CARDS */}
            <div className="cards">

              <div className="card">
                <h3>Total Jobs</h3>
                <p>{jobs?.length || 0}</p>
              </div>

              <div className="card">
                <h3>Total Applications</h3>
                <p>{applications?.length || 0}</p>
              </div>

              <div className="card">
                <h3>Total Candidates</h3>
                <p>{profiles?.length || 0}</p>
              </div>

            </div>


            {/* GRAPH DATA */}
            {(() => {
              const statsData = [
                { name: "Jobs", value: jobs?.length || 0 },
                { name: "Applications", value: applications?.length || 0 },
                { name: "Candidates", value: profiles?.length || 0 }
              ];

              const colors = ["#4f46e5", "#22c55e", "#f59e0b"];

              return (

                <div className="dashboard-graphs">

                  {/* BAR CHART */}
                  <div className="graph-card">
                    <h3>Platform Statistics</h3>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>


                  {/* PIE CHART */}
                  <div className="graph-card">
                    <h3>Distribution</h3>

                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statsData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          label
                        >
                          {statsData.map((entry, index) => (
                            <Cell key={index} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                </div>

              );
            })()}

          </div>
        )}

        {/* POST JOB */}
        {active === "post" && (
          <div className="post-section">
            <h2>Post New Job</h2>
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

        {/* MANAGE JOBS */}
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

        {/* APPLICATIONS */}
        {active === "applications" && (
          <div className="jobs-grid">
            {applications.length === 0 ? (
              <p>No applications yet</p>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="job-card">
                  <h4>{app.jobId?.title}</h4>
                  <p>Applicant: {app.applicantEmail}</p>
                  <p>Company: {app.jobId?.company}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* CANDIDATES */}
        {active === "profiles" && (
          <div className="jobs-grid">
            {profiles.length === 0 ? (
              <p>No candidates yet</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile._id} className="job-card">
                  <h3>{profile.name}</h3>
                  <p>Email: {profile.email}</p>
                  <p>Role: {profile.role}</p>
                  <p>Location: {profile.location}</p>

                  <h4>Skills</h4>
                  <p>{profile.skills?.join(", ")}</p>

                  {profile.resume && (
                    <a
                      href={profile.resume.replace(
                        "/upload/",
                        "/upload/fl_attachment/"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
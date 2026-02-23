import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

// Backend API
const API =
  import.meta.env.VITE_API_URL ||
  "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
  const navigate = useNavigate();

  // ================= STATES =================
  const [activeSection, setActiveSection] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
    experience: "",
    skills: "",
  });

  // ================= AUTH PROTECTION =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/auth");
    }
  }, [navigate]);

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);
      setJobs(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= FORM HANDLING =================
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    try {
      await axios.post(`${API}/api/jobs/create`, job, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job Posted Successfully ✅");

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

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= DELETE JOB =================
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchJobs();
    } catch (error) {
      alert("Delete Failed ❌");
    }
  };

  // ================= RENDER =================
  return (
    <div className="admin-dashboard">

      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => setActiveSection("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setActiveSection("post")}>
            Post Job
          </button>

          <button onClick={() => setActiveSection("manage")}>
            Manage Jobs
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-main">

        {/* ===== DASHBOARD SECTION ===== */}
        {activeSection === "dashboard" && (
          <section className="dashboard-section">
            <h1>System Overview</h1>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Jobs</h3>
                <p>{jobs.length}</p>
              </div>

              <div className="stat-card">
                <h3>System Status</h3>
                <p>Active</p>
              </div>

              <div className="stat-card">
                <h3>Last Updated</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </section>
        )}

        {/* ===== POST JOB SECTION ===== */}
        {activeSection === "post" && (
          <section className="post-section">
            <h1>Post New Job</h1>

            <form className="admin-form" onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
              <input type="text" name="company" placeholder="Company Name" value={job.company} onChange={handleChange} required />
              <input type="text" name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
              <input type="text" name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
              <input type="number" name="experience" placeholder="Experience (0 = Fresher)" value={job.experience} onChange={handleChange} required />
              <input type="text" name="skills" placeholder="Skills" value={job.skills} onChange={handleChange} required />
              <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
              <button type="submit">Post Job</button>
            </form>
          </section>
        )}

        {/* ===== MANAGE JOBS SECTION ===== */}
        {activeSection === "manage" && (
          <section className="manage-section">
            <h1>Manage Jobs</h1>

            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs available 🚀</p>
            ) : (
              <div className="jobs-grid">
                {jobs.map((item) => (
                  <div key={item._id} className="job-card">
                    <h3>{item.title}</h3>
                    <p>{item.company}</p>
                    <p>₹ {item.salary}</p>
                    <p>{item.location}</p>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
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
  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState([]);

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

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="brand">DevHire</h2>
        <ul>
          <li onClick={() => setActive("dashboard")}>Dashboard</li>
          <li onClick={() => setActive("post")}>Post Job</li>
          <li onClick={() => setActive("manage")}>Manage Jobs</li>
          <li onClick={() => setActive("applications")}>Applications</li>
          <li onClick={() => setActive("profiles")}>Candidates</li>
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

      {/* MAIN */}
      <div className="main">

        {/* DASHBOARD */}
        {active === "dashboard" && (
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
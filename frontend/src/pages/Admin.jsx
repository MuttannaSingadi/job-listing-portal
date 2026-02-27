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

  /* ================= FETCH DATA ================= */

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/api/applications`);
      setApplications(res.data);
    } catch (err) {
      console.log(err.message);
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
      console.log("Profile fetch error:", err.message);
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

      {/* MAIN SECTION */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <input type="text" placeholder="Search..." />
          <div className="profile-mini">A</div>
        </div>

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
            <form className="admin-form" onSubmit={handleSubmit}>
              <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
              <input name="company" placeholder="Company Name" value={job.company} onChange={handleChange} required />
              <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
              <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
              <input name="experience" placeholder="Experience" value={job.experience} onChange={handleChange} required />
              <input name="skills" placeholder="Skills" value={job.skills} onChange={handleChange} required />
              <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
              <button type="submit">Post Job</button>
            </form>
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
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Role:</strong> {profile.role}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>

                  <hr />

                  <h4>Summary</h4>
                  <p>{profile.summary}</p>

                  <h4>Skills</h4>
                  <p>{profile.skills?.join(", ")}</p>

                  <h4>Education</h4>
                  {profile.education?.map((edu, i) => (
                    <div key={i}>
                      <strong>{edu.level}</strong> - {edu.university}
                    </div>
                  ))}

                  <h4>Experience</h4>
                  {profile.experience?.map((exp, i) => (
                    <div key={i}>
                      {exp.title} at {exp.company}
                    </div>
                  ))}

                  <h4>Certifications</h4>
                  {profile.certifications?.map((cert, i) => (
                    <div key={i}>
                      {cert.name} - {cert.organization}
                    </div>
                  ))}

                  <h4>Personal</h4>
                  <p>DOB: {profile.personal?.dob}</p>
                  <p>Gender: {profile.personal?.gender}</p>
                  <p>Languages: {profile.personal?.languages}</p>

                  {profile.resume && (
                    <a
                      href={`${API}${profile.resume}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📄 View Resume
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
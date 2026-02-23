import { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/image.png";
import profile from "./assets/image.png";

export default function Home() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    skills: ""
  });

  // ✅ CHECK TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ FETCH JOBS (FIXED URL)
  useEffect(() => {
    axios
      .get("https://job-listing-portal-iu9g.onrender.com/api/jobs")
      .then((res) => {
        setJobs(res.data);   // show all jobs
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
      });
  }, []);

  // ✅ HANDLE SEARCH INPUT
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SEARCH FUNCTION (FIXED URL)
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        "https://job-listing-portal-iu9g.onrender.com/api/jobs/search",
        { params: filters }
      );

      setJobs(res.data);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // ✅ APPLY
  const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to apply");
      navigate("/auth");
      return;
    }

    alert("Application submitted successfully ✅");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="top-header">
        <div className="brand">
          <Link to="/">
            <img src={logo} alt="DevHire Logo" />
          </Link>
        </div>

        <div className="nav-right">
          <div className="nav-buttons">
            <Link to="/jobs"><button>Jobs</button></Link>
            <Link to="/companies"><button>Companies</button></Link>
            <Link to="/admin"><button>Admin</button></Link>

            {!isLoggedIn && (
              <Link to="/auth"><button>Login</button></Link>
            )}
          </div>

          {isLoggedIn && (
            <div className="profile-section">
              <img src={profile} alt="Profile" className="profile-img" />
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="search-wrapper">
          <h1>Find Your Dream Job</h1>
          <p>Search thousands of jobs from top companies</p>

          <div className="search-box">
            <input
              type="text"
              name="title"
              placeholder="Job title"
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
            />

            <select name="experience" onChange={handleChange}>
              <option value="">Experience</option>
              <option value="0">Fresher</option>
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="3">3 Years</option>
            </select>

            <input
              type="text"
              name="skills"
              placeholder="Skills (React, Node...)"
              onChange={handleChange}
            />

            <button onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ================= JOB SECTION ================= */}
      <section className="jobs-section">
        <h2 className="section-title">Recommended Jobs</h2>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p>No jobs found 🚀</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>

                <div className="details">
                  <div className="detail-item">
                    💰 <strong>Salary:</strong> ₹{job.salary}
                  </div>

                  <div className="detail-item">
                    📍 <strong>Location:</strong> {job.location}
                  </div>

                  <div className="detail-item">
                    👨‍💻 <strong>Experience:</strong>{" "}
                    {job.experience === 0
                      ? "Fresher"
                      : `${job.experience} Years`}
                  </div>
                </div>

                <p className="desc">
                  <strong>Description:</strong> {job.description}
                </p>

                <p className="skills">
                  <strong>Skills:</strong> {job.skills || "Not specified"}
                </p>

                <button
                  className="apply-btn"
                  onClick={handleApply}
                >
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        © 2026 DevHire. All rights reserved.
      </footer>
    </>
  );
}
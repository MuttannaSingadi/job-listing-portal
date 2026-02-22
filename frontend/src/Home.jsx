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

  // ✅ CHECK TOKEN ON LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ FETCH JOBS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        setJobs(res.data.slice(0, 6));
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
      });
  }, []);

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
      {/* NAVBAR */}
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

      {/* HERO */}
      <section className="hero">
        <div className="search-wrapper">
          <h1>Find Your Dream Job</h1>
          <p>Search thousands of jobs from top companies</p>

          <div className="search-box">
            <input type="text" placeholder="Search job title, skills..." />
            <input type="text" placeholder="Location" />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* JOB SECTION */}
      <section className="jobs-section">
        <h2 className="section-title">Recommended Jobs</h2>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p>No jobs available 🚀</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>

                <div className="details">
                  <span>{job.salary}</span>
                  <span>{job.location}</span>
                </div>

                <p className="desc">{job.description}</p>

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
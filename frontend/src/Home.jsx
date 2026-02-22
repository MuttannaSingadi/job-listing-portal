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

  // ✅ NEW SEARCH STATE
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    skills: ""
  });

  // ✅ CHECK TOKEN ON LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ FETCH JOBS (DEFAULT LOAD)
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

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SEARCH FUNCTION
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/search",
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

            <select
              name="experience"
              onChange={handleChange}
            >
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

      {/* JOB SECTION */}
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
                  <span>{job.salary}</span>
                  <span>{job.location}</span>
                  <span>
                    {job.experience === 0
                      ? "Fresher"
                      : `${job.experience} Years`}
                  </span>
                </div>

                <p className="desc">{job.description}</p>
                <p><strong>Skills:</strong> {job.skills}</p>

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
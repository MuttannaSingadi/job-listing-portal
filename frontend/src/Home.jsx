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
  const [menuOpen, setMenuOpen] = useState(false);
  const [followedCompanies, setFollowedCompanies] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    skills: "",
  });

  // Check Login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch Jobs
  useEffect(() => {
    axios
      .get("https://job-listing-portal-iu9g.onrender.com/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        "https://job-listing-portal-iu9g.onrender.com/api/jobs/search",
        { params: filters }
      );
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleApply = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to apply");
      navigate("/auth");
      return;
    }
    alert("Application submitted successfully ✅");
  };

  const handleFollow = (company) => {
    if (followedCompanies.includes(company)) {
      setFollowedCompanies(
        followedCompanies.filter((c) => c !== company)
      );
    } else {
      setFollowedCompanies([...followedCompanies, company]);
    }
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

        {/* Mobile Profile (Outside Menu) */}
        {isLoggedIn && (
          <div className="mobile-profile">
            <img src={profile} alt="Profile" />
          </div>
        )}

        {/* Hamburger */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <Link to="/jobs">Jobs</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/admin">Admin</Link>
          {!isLoggedIn && <Link to="/auth">Login</Link>}

          {/* Desktop Profile Only */}
          {isLoggedIn && (
            <div className="profile-section desktop-profile">
              <img src={profile} alt="Profile" />
              <button onClick={handleLogout}>Logout</button>
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
              name="title"
              placeholder="Job title"
              onChange={handleChange}
            />
            <input
              name="location"
              placeholder="Location"
              onChange={handleChange}
            />
            <select name="experience" onChange={handleChange}>
              <option value="">Experience</option>
              <option value="0">Fresher</option>
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
            </select>
            <input
              name="skills"
              placeholder="Skills"
              onChange={handleChange}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>

      {/* ================= JOBS ================= */}
      <section className="jobs-section">
        <h2 className="section-title">Recommended Jobs</h2>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>

              <div className="details">
                <span>₹ {job.salary}</span>
                <span>{job.location}</span>
                <span>
                  {job.experience === 0
                    ? "Fresher"
                    : `${job.experience} Years`}
                </span>
              </div>

              <p className="desc">{job.description}</p>

              <div className="card-actions">
                <button onClick={handleApply}>Apply</button>

                <button
                  className={
                    followedCompanies.includes(job.company)
                      ? "follow active"
                      : "follow"
                  }
                  onClick={() => handleFollow(job.company)}
                >
                  {followedCompanies.includes(job.company)
                    ? "Following"
                    : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>© 2026 DevHire. All rights reserved.</footer>
    </>
  );
}
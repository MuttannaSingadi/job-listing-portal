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

  // ✅ ADD THIS FUNCTION (THIS WAS MISSING)
  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

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

        {/* Mobile Profile */}
        {isLoggedIn && (
          <div className="mobile-profile">
            <img
              src={profile}
              alt="Profile"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
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

          {isLoggedIn && (
            <button className="mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          )}

          {isLoggedIn && (
            <div className="profile-section desktop-profile">
              <img
                src={profile}
                alt="Profile"
                onClick={handleProfileClick}
                style={{ cursor: "pointer" }}
              />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* REST OF YOUR CODE UNCHANGED */}
    </>
  );
}
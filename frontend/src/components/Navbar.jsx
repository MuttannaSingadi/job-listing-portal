import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/image.png";
import "../style/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(
          "https://job-listing-portal-iu9g.onrender.com/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      } catch (error) {
        console.log("Profile image fetch error:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const handleJobsClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/auth");
    } else {
      navigate("/jobs");
    }
    setMenuOpen(false);
  };

  return (
    <>
      <div className="top-header">
        <div className="nav-left">
          <Link to="/" className="brand">
            <img src={logo} alt="DevHire" />
          </Link>
        </div>

        <div className="nav-right desktop-menu">
          <Link to="#" onClick={handleJobsClick}>
            Jobs
          </Link>

          <Link
            to="/"
            onClick={() => {
              setTimeout(() => {
                const section = document.getElementById("companies");
                section?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Companies
          </Link>

          {!isLoggedIn && <Link to="/auth">Employer/Job Seekers</Link>}

          {isLoggedIn && (
            <>
              <div className="desktop-profile">
                <img
                  src={profileImage || logo}
                  alt="profile"
                  onClick={handleProfileClick}
                />
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {isLoggedIn && (
          <div className="mobile-profile">
            <img
              src={profileImage || logo}
              alt="profile"
              onClick={handleProfileClick}
            />
          </div>
        )}

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>

      {/* ✅ OVERLAY FIRST */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ✅ MENU AFTER OVERLAY */}
      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Link to="#" onClick={handleJobsClick}>
          Jobs
        </Link>

        <Link
          to="/"
          onClick={() => {
            setTimeout(() => {
              const section = document.getElementById("companies");
              section?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          Companies
        </Link>

        {!isLoggedIn && (
          <Link to="/auth" className="logout-btn" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}

        {isLoggedIn && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import "../style/home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/image.png";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [profileImage, setProfileImage] = useState("");

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    skills: "",
  });


  
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

  
  const handleProfileClick = () => {
    navigate("/profile");
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

        
        <div className="nav-left">

          
          <Link to="/" className="brand">
            <img src={logo} alt="DevHire" />
          </Link>

        </div>


        {/* DESKTOP MENU */}
        <div className="nav-right desktop-menu">

          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");

              if (!token) {
                alert("Please login first");
                navigate("/auth");
              } else {
                navigate("/jobs");
              }
            }}
          >
            Jobs
          </Link>

          <a href="#companies">Companies</a>

          {!isLoggedIn && (
            <Link to="/auth">Employer/Job Seekers</Link>
          )}

          {isLoggedIn && (
            <>
              <div className="desktop-profile">
                <img
                  src={profileImage || logo}
                  alt="profile"
                  onClick={handleProfileClick}
                />
              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>


        {/* MOBILE PROFILE */}
        {isLoggedIn && (
          <div className="mobile-profile">
            <img
              src={profileImage || logo}
              alt="profile"
              onClick={handleProfileClick}
            />
          </div>
        )}


        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "☰" : "☰"}
        </div>

      </div>

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >

        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            const token = localStorage.getItem("token");

            if (!token) {
              alert("Please login first");
              navigate("/auth");
            } else {
              navigate("/jobs");
            }
          }}
        >
          Jobs
        </Link>

        <a href="#companies" onClick={() => setMenuOpen(false)}>
          Companies
        </a>

        

        {!isLoggedIn && (
          <Link to="/auth" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}

        {isLoggedIn && (
          <button
            className="logout-btn"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        )}

      </div>


      {/* ================= OVERLAY ================= */}

      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* ================= MODERN HERO SECTION ================= */}
      <section className="hero-modern">

        <div className="hero-content">

          <div className="hero-left">
            <h1>
              Unlock Your <span className="gradient-text">Career</span>
            </h1>

            <p>
              Discover top opportunities from leading companies and take
              the next step in your professional journey.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-cta"
                onClick={() => {
                  const token = localStorage.getItem("token");

                  if (!token) {
                    alert("Please login first");
                    navigate("/auth");
                  } else {
                    navigate("/jobs");
                  }
                }}
              >
                Explore Jobs
              </button>

              <button className="secondary-cta" onClick={() => navigate("/profile")}>
                Build Your Profile
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <h3>10K+</h3>
                <p>Active Jobs</p>
              </div>
              <div>
                <h3>5K+</h3>
                <p>Companies</p>
              </div>
              <div>
                <h3>25K+</h3>
                <p>Job Seekers</p>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <h3> Trending Skills</h3>
              <ul>
                <li>React Developer</li>
                <li>Node.js Engineer</li>
                <li>Data Analyst</li>
                <li>AI / ML Engineer</li>
              </ul>
            </div>

            <div className="hero-card small">
              <h4>✨ Get Hired Faster</h4>
              <p>
                Complete your profile and let recruiters discover you.
              </p>
            </div>
          </div>

        </div>

      </section>
      
      <section className="features-section">

        
        <div className="features-header">
          <h2>Why Choose <span>DevHire</span>?</h2>
          <p>
            Powerful tools designed to connect job seekers with top employers
            and make hiring faster, smarter, and more efficient.
          </p>
        </div>

        <div className="features-container">

  
          <div className="features-column seekers">
            <h3 className="features-title blue">
              For Job Seekers
            </h3>

            <div className="feature-card">
              <div className="icon blue-bg">🔍</div>
              <div>
                <h4>Smart Job Matching</h4>
                <p>Sophisticated algorithms match you with jobs that fit your skills and preferences.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon blue-bg">📄</div>
              <div>
                <h4>Resume Uploader</h4>
                <p>Easily upload your resume and let employers find you.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon blue-bg">💬</div>
              <div>
                <h4>Direct Communication</h4>
                <p>Communicate directly with employers.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon blue-bg">🏅</div>
              <div>
                <h4>Skill Assessments</h4>
                <p>Showcase your skills with verified assessments.</p>
              </div>
            </div>
          </div>


  
          <div className="features-column employers">
            <h3 className="features-title purple">
              For Employers
            </h3>

            <div className="feature-card">
              <div className="icon purple-bg">👥</div>
              <div>
                <h4>Access to Talent Pool</h4>
                <p>Find and connect with top talent in your industry.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon purple-bg">📊</div>
              <div>
                <h4>Advanced Analytics</h4>
                <p>Get insights on job postings and candidate engagement.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon purple-bg">🛡</div>
              <div>
                <h4>Verified Candidates</h4>
                <p>All candidates undergo background verification to ensure quality hires.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="icon purple-bg">⏱</div>
              <div>
                <h4>Quick Hiring Process</h4>
                <p>Streamline your hiring process with efficient tools.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      
      <section id="companies" className="company-section">
        <h2 className="section-title">Top Hiring Companies</h2>

        <div className="company-marquee">
          <div className="company-track">

            {/* Row 1 */}
            <div className="company-card">
              <img src="https://cdn.brandfetch.io/google.com/w/400/h/400" alt="Google" />
              <h3>Google</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/microsoft.com/w/400/h/400" alt="Microsoft" />
              <h3>Microsoft</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/amazon.com/w/400/h/400" alt="Amazon" />
              <h3>Amazon</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/meta.com/w/400/h/400" alt="Meta" />
              <h3>Meta</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/netflix.com/w/400/h/400" alt="Netflix" />
              <h3>Netflix</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/infosys.com/w/400/h/400" alt="Infosys" />
              <h3>Infosys</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/tcs.com/w/400/h/400" alt="TCS" />
              <h3>TCS</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/wipro.com/w/400/h/400" alt="Wipro" />
              <h3>Wipro</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/accenture.com/w/400/h/400" alt="Accenture" />
              <h3>Accenture</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

            <div className="company-card">
              <img src="https://cdn.brandfetch.io/oracle.com/w/400/h/400" alt="Oracle" />
              <h3>Oracle</h3>
              <button className="view-btn">View Open Roles</button>
            </div>

          </div>
        </div>
      </section>
    
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-column">
            <h3>DevHire</h3>
            <p>
              DevHire is a modern job portal connecting talented
              developers with top companies across India.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/jobs">Jobs</a></li>
              <li><a href="/companies">Companies</a></li>
              <li><a href="/auth">Login</a></li>
              <li><a href="/auth">Employer/Job Seekers</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: support@devhire.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Bangalore, India</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} DevHire. All Rights Reserved.
        </div>
      </footer>
      <footer>© 2026 DevHire. All rights reserved.</footer>
    </>
  );
}
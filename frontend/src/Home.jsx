import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/image.png";
import profile from "./assets/image.png";

export default function Home() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="top-header">

        {/* LOGO */}
        <div className="brand">
          <Link to="/">
            <img src={logo} alt="DevHire Logo" />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          <div className="nav-buttons">
            <Link to="/"><button>Home</button></Link>
            <Link to="/jobs"><button>Jobs</button></Link>
            <Link to="/companies"><button>Companies</button></Link>

            {!isLoggedIn && (
              <Link to="/auth"><button>Login</button></Link>
            )}
          </div>

          {/* PROFILE SECTION */}
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
            <input type="text" placeholder="Search job title, skills..." />
            <input type="text" placeholder="Location" />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* ================= JOB SECTION ================= */}
      <section className="jobs-section">
        <h2 className="section-title">Recommended Jobs</h2>

        <div className="jobs-grid">

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <h3>Frontend Developer</h3>
            <p className="company">Tech Solutions ⭐ 4.2</p>
            <div className="details">
              <span>2-4 Years</span>
              <span>₹ 5-8 LPA</span>
              <span>Bangalore</span>
            </div>
            <p className="desc">
              Looking for a React Developer with strong knowledge of JavaScript, HTML, CSS.
            </p>
            <div className="tags">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        © 2026 DevHire. All rights reserved.
      </footer>
    </>
  );
}
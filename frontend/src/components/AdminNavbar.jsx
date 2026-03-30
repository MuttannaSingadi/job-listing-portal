import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../style/adminnavbar.css";

export default function AdminNavbar({
  navigate,
  menuOpen,
  setMenuOpen,
  setActive
}) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <div className="top-navbar">

        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>

          <div className="brand">
            <Link to="/">
              <img src="/logo.png" alt="Logo" />
            </Link>
          </div>
        </div>

        <div
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* DESKTOP */}
        <div className="nav-right desktop-only">
          <div className="profile-img">
            <img src="/profile.png" alt="Profile" />
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        <ul>

          <li onClick={() => { setActive("dashboard"); setMenuOpen(false); }}>
            Dashboard
          </li>

          <li onClick={() => { setActive("post"); setMenuOpen(false); }}>
            Post Job
          </li>

          <li onClick={() => { setActive("manage"); setMenuOpen(false); }}>
            Manage Jobs
          </li>

          <li onClick={() => { setActive("applications"); setMenuOpen(false); }}>
            Applications
          </li>

          <li onClick={() => { setActive("profiles"); setMenuOpen(false); }}>
            Candidates
          </li>

          {/* MOBILE LOGOUT */}
          <li className="logout-item" onClick={handleLogout}>
            Logout
          </li>

        </ul>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
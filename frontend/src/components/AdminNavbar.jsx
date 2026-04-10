import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../style/adminnavbar.css";
import profileImg from "../assets/image.png";

export default function AdminNavbar({
  navigate,
  menuOpen,
  setMenuOpen,
  setActive,
  profileImage
}) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setMenuOpen(false);
  };

  const handleMenuClick = (page) => {
    setActive(page);
    setMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">

        {/* LEFT */}
        <div className="admin-nav-left">
          <button
            className="admin-back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* LOGO */}
        <div className="admin-nav-logo">
          <Link to="/">
            <img src={profileImg} alt="Logo" />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="admin-nav-links">
          <button onClick={() => setActive("dashboard")}>Dashboard</button>
          <button onClick={() => setActive("post")}>Post Job</button>
          <button onClick={() => setActive("manage")}>Manage Jobs</button>
          <button onClick={() => setActive("applications")}>Applications</button>
          <button onClick={() => setActive("profiles")}>Candidates</button>
        </div>

        {/* RIGHT PROFILE */}
        <div className="admin-nav-right">
          <div className="admin-profile-dropdown">

            <div className="admin-profile-img">
              <img
                src={
                  profileImage && profileImage !== ""
                    ? `data:image/png;base64,${profileImage}`
                    : profileImg
                }
                alt="Profile"
              />
            </div>

            <div className="admin-dropdown-menu">
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  setActive("profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </p>

              <p onClick={handleLogout}>Logout</p>
            </div>

          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div
          className="admin-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </div>

      {/* MOBILE MENU */}
      <div className={`admin-nav-center ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => handleMenuClick("dashboard")}>Dashboard</li>
          <li onClick={() => handleMenuClick("post")}>Post Job</li>
          <li onClick={() => handleMenuClick("manage")}>Manage Jobs</li>
          <li onClick={() => handleMenuClick("applications")}>Applications</li>
          <li onClick={() => handleMenuClick("profiles")}>Candidates</li>

          <li onClick={() => handleMenuClick("profile")}>Profile</li>

          <li className="admin-logout-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="admin-menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
import { useEffect, useState } from "react";
import "./profile.css";
import profileImg from "../assets/image.png";

export default function Profile() {
  const [user] = useState({
    name: "Muttanna Singadi",
    role: "Full Stack Developer | AI/ML Enthusiast",
    location: "Bengaluru, India",
    phone: "+91 9176761966",
    email: "muttufs67@gmail.com",
  });

  const [skills] = useState([
    "React",
    "Node.js",
    "MongoDB",
    "Java",
    "Python",
    "Machine Learning",
  ]);

  useEffect(() => {
    // Future: Fetch user data from backend
    // axios.get("/api/profile")
  }, []);

  return (
    <div className="profile-dashboard">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="profile-sidebar">
        <h2>Quick Links</h2>
        <ul>
          <li>Resume</li>
          <li>Resume Headline</li>
          <li>Key Skills</li>
          <li>Education</li>
          <li>IT Skills</li>
          <li>Projects</li>
          <li>Profile Summary</li>
          <li>Accomplishments</li>
          <li>Career Profile</li>
          <li>Personal Details</li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="profile-main">

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-left">
            <img src={profileImg} alt="Profile" className="profile-avatar" />
            <div>
              <h2>{user.name}</h2>
              <p className="role">{user.role}</p>
              <p className="location">{user.location}</p>
            </div>
          </div>

          <div className="profile-right">
            <p>📞 {user.phone}</p>
            <p>✉️ {user.email}</p>
          </div>
        </div>

        {/* RESUME */}
        <div className="profile-card">
          <div className="card-header">
            <h3>Resume</h3>
            <button className="primary-btn">Upload Resume</button>
          </div>
        </div>

        {/* SKILLS */}
        <div className="profile-card">
          <h3>Key Skills</h3>
          <div className="tags">
            {skills.map((skill, index) => (
              <span key={index} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="profile-card">
          <h3>Employment</h3>
          <div className="profile-item">
            <h4>AI/ML Intern</h4>
            <p>Tech Company | 2025</p>
          </div>
          <div className="profile-item">
            <h4>Full Stack Developer Intern</h4>
            <p>Startup Company | 2024</p>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="profile-card">
          <h3>Education</h3>
          <div className="profile-item">
            <h4>MCA</h4>
            <p>VTU University | 2023–2025</p>
          </div>
          <div className="profile-item">
            <h4>BCA</h4>
            <p>Karnataka University | 2020–2023</p>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="profile-card">
          <h3>Projects</h3>
          <div className="profile-item">
            <h4>MERN Job Portal</h4>
            <p>Frontend: Vercel | Backend: Render</p>
          </div>
          <div className="profile-item">
            <h4>Driver Distraction Alert System</h4>
            <p>AI-based Mobile Detection System</p>
          </div>
        </div>

      </main>
    </div>
  );
}
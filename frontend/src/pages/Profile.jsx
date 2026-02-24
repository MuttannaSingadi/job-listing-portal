import { useState } from "react";
import "./profile.css";

export default function Profile() {
  const [active, setActive] = useState("resume");
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    { name: "Resume", id: "resume" },
    { name: "Profile Summary", id: "summary" },
    { name: "Experience", id: "experience" },
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" },
    { name: "Projects", id: "projects" },
    { name: "Certifications", id: "certifications" },
    { name: "Online Links", id: "links" },
    { name: "Personal Details", id: "personal" }
  ];

  const handleScroll = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>

      {/* TOPBAR */}
      <header className="topbar">
        <h2>My Profile</h2>

        <div className="top-actions">
          <button onClick={() => setEditMode(!editMode)} className="edit-btn">
            {editMode ? "View Mode" : "Edit Mode"}
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="dark-btn">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="avatar">M</div>
        </div>
      </header>

      <div className="dashboard-body">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Profile Sections</h3>
          <ul>
            {sections.map((item) => (
              <li
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => handleScroll(item.id)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">

          {/* PROFILE HEADER */}
          <div className="profile-header">
            <div className="header-left">
              <div className="big-avatar">M</div>
              <div>
                <h3>Muttanna Singadi</h3>
                <p>Fresher</p>
                <p>Bengaluru</p>
                <p>muttufs67@gmail.com</p>
                <p>9176761966</p>
              </div>
            </div>

            <div className="completion">
              <p>Profile Completion</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
              <span>65% Completed</span>
            </div>
          </div>

          {/* RESUME */}
          <section id="resume" className="card">
            <h3>Resume</h3>
            <div className="resume-box">
              <p>Upload your latest resume (PDF)</p>
              <label className="upload-btn">
                Choose File
                <input type="file" hidden />
              </label>
            </div>
          </section>

          {/* PROFILE SUMMARY */}
          <section id="summary" className="card">
            <h3>Profile Summary</h3>
            <textarea placeholder="Write your professional summary..." />
            <button className="primary-btn">Save Summary</button>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="card">
            <h3>Experience</h3>

            <div className="timeline">
              <div className="timeline-item">
                <div className="dot"></div>
                <div>
                  <h4>AI Intern</h4>
                  <p>Tech Company • 2025</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="dot"></div>
                <div>
                  <h4>Full Stack Intern</h4>
                  <p>Startup • 2024</p>
                </div>
              </div>
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" className="card">
            <h3>Skills</h3>
            <div className="row">
              <input placeholder="Add Skill" />
              <button className="primary-btn">Save</button>
            </div>
          </section>

          {/* EDUCATION */}
          <section id="education" className="card">
            <h3>Education</h3>

            <div className="grid-3">
              <select>
                <option>Post Graduation</option>
                <option>Graduation</option>
              </select>
              <input placeholder="University" />
              <input placeholder="Course" />
            </div>

            <div className="grid-3">
              <input placeholder="Specialization" />
              <input placeholder="Course Type" />
              <input type="date" />
            </div>

            <div className="grid-2">
              <input type="date" />
              <label className="checkbox">
                <input type="checkbox" /> Completed
              </label>
            </div>

            <button className="primary-btn">Add Education</button>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="card">
            <h3>Projects</h3>
            <div className="grid-2">
              <input placeholder="Project Title" />
              <select>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>
            <textarea placeholder="Project Description"></textarea>
            <button className="primary-btn">Save Project</button>
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <h3>Certifications</h3>
            <input placeholder="Certification Name" />
            <input placeholder="Issuing Organization" />
            <button className="primary-btn">Save Certification</button>
          </section>

          {/* ONLINE LINKS */}
          <section id="links" className="card">
            <h3>Online Profiles</h3>
            <input placeholder="LinkedIn URL" />
            <input placeholder="GitHub URL" />
            <button className="primary-btn">Save Links</button>
          </section>

          {/* PERSONAL */}
          <section id="personal" className="card">
            <h3>Personal Details</h3>
            <input type="date" />
            <select>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input placeholder="Languages Known" />
            <button className="primary-btn">Save Info</button>
          </section>

        </main>
      </div>
    </div>
  );
}
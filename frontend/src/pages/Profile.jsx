import { useState } from "react";
import "./profile.css";

export default function Profile() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [basic, setBasic] = useState({
    roleType: "",
    experienceYears: "",
    address: "",
    email: "",
    phone: "",
    available: false,
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="mobile-header">
        <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h2>My Profile</h2>
      </div>

      <div className="profile-dashboard">

        <aside className={`profile-sidebar ${menuOpen ? "active" : ""}`}>
          <h2>Sections</h2>
          <ul>
            <li><a href="#basic">Basic Details</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#projects">Projects</a></li>
          </ul>
        </aside>

        <main className="profile-main">

          {/* BASIC DETAILS */}
          <div id="basic" className="profile-card">
            <h3>Basic Details</h3>

            <select onChange={(e) => setBasic({ ...basic, roleType: e.target.value })}>
              <option value="">Role Type</option>
              <option>Fresher</option>
              <option>Experienced</option>
            </select>

            <input type="text" placeholder="Experience Years" />
            <input type="text" placeholder="Address" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone" />

            <button className="primary-btn">Save Basic</button>
          </div>

          {/* SKILLS */}
          <div id="skills" className="profile-card">
            <h3>Skills</h3>

            <div className="skill-input">
              <input
                type="text"
                placeholder="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button onClick={addSkill}>Add</button>
            </div>

            <div className="tags">
              {skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill}
                  <button onClick={() => removeSkill(index)}>×</button>
                </span>
              ))}
            </div>

            <button className="primary-btn">Save Skills</button>
          </div>

          {/* EDUCATION */}
          <div id="education" className="profile-card">
            <h3>Education</h3>
            <input type="text" placeholder="University" />
            <input type="text" placeholder="Course" />
            <button className="primary-btn">Save Education</button>
          </div>

          {/* PROJECTS */}
          <div id="projects" className="profile-card">
            <h3>Projects</h3>
            <input type="text" placeholder="Project Title" />
            <button className="primary-btn">Save Project</button>
          </div>

        </main>
      </div>
    </>
  );
}
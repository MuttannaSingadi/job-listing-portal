import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  const [active, setActive] = useState("resume");
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    links: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
    personal: {
      dob: "",
      gender: "",
      languages: "",
    },
  });

  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });
  const [newCertification, setNewCertification] = useState({
    title: "",
    organization: "",
    year: "",
  });

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(BACKEND_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setProfile(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(BACKEND_URL, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile Saved Successfully ✅");
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= ADD FUNCTIONS ================= */

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfile({
        ...profile,
        education: [...profile.education, newEducation],
      });
      setNewEducation({ degree: "", institution: "", year: "" });
    }
  };

  const addProject = () => {
    if (newProject.title) {
      setProfile({
        ...profile,
        projects: [...profile.projects, newProject],
      });
      setNewProject({ title: "", description: "" });
    }
  };

  const addCertification = () => {
    if (newCertification.title) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertification],
      });
      setNewCertification({ title: "", organization: "", year: "" });
    }
  };

  const handleScroll = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const sections = [
    { name: "Resume", id: "resume" },
    { name: "Profile Summary", id: "summary" },
    { name: "Experience", id: "experience" },
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" },
    { name: "Projects", id: "projects" },
    { name: "Certifications", id: "certifications" },
    { name: "Online Links", id: "links" },
    { name: "Personal Details", id: "personal" },
  ];

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* TOPBAR */}
      <header className="topbar">
        <h2>My Profile</h2>

        <div className="top-actions">
          <button
            onClick={() => setEditMode(!editMode)}
            className="edit-btn"
          >
            {editMode ? "View Mode" : "Edit Mode"}
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="dark-btn"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button onClick={saveProfile} className="primary-btn">
            Save Profile
          </button>

          <div className="avatar">
            {profile.name ? profile.name[0] : "M"}
          </div>
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

        {/* MAIN */}
        <main className="main">

          {/* PROFILE HEADER */}
          <section id="resume" className="profile-header card">
            <div className="big-avatar">
              {profile.name ? profile.name[0] : "M"}
            </div>

            <div>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Full Name"
              />
              <input
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                placeholder="Role"
              />
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="Location"
              />
              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Email"
              />
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="Phone"
              />
            </div>
          </section>

          {/* SUMMARY */}
          <section id="summary" className="card">
            <h3>Profile Summary</h3>
            <textarea
              value={profile.summary}
              onChange={(e) =>
                setProfile({ ...profile, summary: e.target.value })
              }
              placeholder="Write your professional summary..."
            />
          </section>

          {/* SKILLS */}
          <section id="skills" className="card">
            <h3>Skills</h3>

            <div className="row">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add Skill"
              />
              <button
                className="primary-btn"
                onClick={addSkill}
              >
                Add
              </button>
            </div>

            {profile.skills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
          </section>

          {/* EDUCATION */}
          <section id="education" className="card">
            <h3>Education</h3>

            <input
              placeholder="Degree"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
            />
            <input
              placeholder="Institution"
              value={newEducation.institution}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  institution: e.target.value,
                })
              }
            />
            <input
              placeholder="Year"
              value={newEducation.year}
              onChange={(e) =>
                setNewEducation({ ...newEducation, year: e.target.value })
              }
            />
            <button onClick={addEducation} className="primary-btn">
              Add Education
            </button>

            {profile.education.map((edu, index) => (
              <div key={index}>
                {edu.degree} - {edu.institution} ({edu.year})
              </div>
            ))}
          </section>

          {/* PROJECTS */}
          <section id="projects" className="card">
            <h3>Projects</h3>

            <input
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
            />
            <button onClick={addProject} className="primary-btn">
              Add Project
            </button>

            {profile.projects.map((proj, index) => (
              <div key={index}>
                <strong>{proj.title}</strong> - {proj.description}
              </div>
            ))}
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <h3>Certifications</h3>

            <input
              placeholder="Title"
              value={newCertification.title}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  title: e.target.value,
                })
              }
            />
            <input
              placeholder="Organization"
              value={newCertification.organization}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  organization: e.target.value,
                })
              }
            />
            <input
              placeholder="Year"
              value={newCertification.year}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  year: e.target.value,
                })
              }
            />
            <button onClick={addCertification} className="primary-btn">
              Add Certification
            </button>

            {profile.certifications.map((cert, index) => (
              <div key={index}>
                {cert.title} - {cert.organization} ({cert.year})
              </div>
            ))}
          </section>

        </main>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  const [active, setActive] = useState("resume");
  const [darkMode, setDarkMode] = useState(false);
  const [editSection, setEditSection] = useState(null);

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

        if (res.data) setProfile(res.data);
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
      setEditSection(null);
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
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" },
    { name: "Projects", id: "projects" },
    { name: "Certifications", id: "certifications" },
  ];

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* TOPBAR */}
      <header className="topbar">
        <h2>My Profile</h2>

        <div className="top-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="dark-btn">
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

          {/* SUMMARY */}
          <section id="summary" className="card">
            <div className="section-header">
              <h3>Profile Summary</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditSection(
                    editSection === "summary" ? null : "summary"
                  )
                }
              >
                {editSection === "summary" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editSection === "summary" ? (
              <textarea
                value={profile.summary}
                onChange={(e) =>
                  setProfile({ ...profile, summary: e.target.value })
                }
              />
            ) : (
              <p>{profile.summary || "No summary added."}</p>
            )}
          </section>

          {/* SKILLS */}
          <section id="skills" className="card">
            <div className="section-header">
              <h3>Skills</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditSection(editSection === "skills" ? null : "skills")
                }
              >
                {editSection === "skills" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editSection === "skills" && (
              <div className="row">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button onClick={addSkill} className="primary-btn">
                  Add
                </button>
              </div>
            )}

            {profile.skills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
          </section>

          {/* EDUCATION */}
          <section id="education" className="card">
            <div className="section-header">
              <h3>Education</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditSection(
                    editSection === "education" ? null : "education"
                  )
                }
              >
                {editSection === "education" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editSection === "education" && (
              <>
                <input
                  placeholder="Degree"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      degree: e.target.value,
                    })
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
                    setNewEducation({
                      ...newEducation,
                      year: e.target.value,
                    })
                  }
                />
                <button
                  onClick={addEducation}
                  className="primary-btn"
                >
                  Add Education
                </button>
              </>
            )}

            {profile.education.map((edu, index) => (
              <div key={index}>
                {edu.degree} - {edu.institution} ({edu.year})
              </div>
            ))}
          </section>

          {/* PROJECTS */}
          <section id="projects" className="card">
            <div className="section-header">
              <h3>Projects</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditSection(
                    editSection === "projects" ? null : "projects"
                  )
                }
              >
                {editSection === "projects" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editSection === "projects" && (
              <>
                <input
                  placeholder="Title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      title: e.target.value,
                    })
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
                <button
                  onClick={addProject}
                  className="primary-btn"
                >
                  Add Project
                </button>
              </>
            )}

            {profile.projects.map((proj, index) => (
              <div key={index}>
                <strong>{proj.title}</strong> - {proj.description}
              </div>
            ))}
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <div className="section-header">
              <h3>Certifications</h3>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditSection(
                    editSection === "certifications"
                      ? null
                      : "certifications"
                  )
                }
              >
                {editSection === "certifications" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editSection === "certifications" && (
              <>
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
                <button
                  onClick={addCertification}
                  className="primary-btn"
                >
                  Add Certification
                </button>
              </>
            )}

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
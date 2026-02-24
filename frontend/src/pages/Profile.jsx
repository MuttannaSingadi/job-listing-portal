import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  const [active, setActive] = useState("resume");
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* ================= PROFILE STATE ================= */

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

  /* ================= ADD SKILL ================= */

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
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
          <div className="profile-header">
            <div className="header-left">
              <div className="big-avatar">
                {profile.name ? profile.name[0] : "M"}
              </div>

              <div>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  placeholder="Full Name"
                />

                <input
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      role: e.target.value,
                    })
                  }
                  placeholder="Role"
                />

                <input
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: e.target.value,
                    })
                  }
                  placeholder="Location"
                />

                <input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email"
                />

                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                />
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <section id="summary" className="card">
            <h3>Profile Summary</h3>
            <textarea
              value={profile.summary}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  summary: e.target.value,
                })
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

            <div className="tags">
              {profile.skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* LINKS */}
          <section id="links" className="card">
            <h3>Online Links</h3>

            <input
              placeholder="LinkedIn URL"
              value={profile.links.linkedin}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  links: {
                    ...profile.links,
                    linkedin: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="GitHub URL"
              value={profile.links.github}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  links: {
                    ...profile.links,
                    github: e.target.value,
                  },
                })
              }
            />
          </section>

          {/* PERSONAL */}
          <section id="personal" className="card">
            <h3>Personal Details</h3>

            <input
              type="date"
              value={profile.personal.dob}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  personal: {
                    ...profile.personal,
                    dob: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="Gender"
              value={profile.personal.gender}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  personal: {
                    ...profile.personal,
                    gender: e.target.value,
                  },
                })
              }
            />

            <input
              placeholder="Languages Known"
              value={profile.personal.languages}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  personal: {
                    ...profile.personal,
                    languages: e.target.value,
                  },
                })
              }
            />
          </section>
        </main>
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {

  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  /* ================= DEFAULT PROFILE ================= */

  const defaultProfile = {
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    summary: "",
    resume: "",
    profileImage: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    links: { linkedin: "", github: "", portfolio: "" },
    personal: { dob: "", gender: "", languages: "" },
  };

  /* ================= STATES ================= */

  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
    const [active, setActive] = useState("resume");

  const [resumeFile, setResumeFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [newSkill, setNewSkill] = useState("");

  const [newEducation, setNewEducation] = useState({
    level: "",
    university: "",
    course: "",
    specialization: "",
    courseType: "",
    startDate: "",
    endDate: "",
    completed: false,
  });

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    year: "",
  });

  const [newCertification, setNewCertification] = useState({
    name: "",
    organization: "",
  });

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        // Merge with defaultProfile so missing fields don't break the UI
        setProfile({ ...defaultProfile, ...res.data });
      }
    } catch (error) {
      console.log("FETCH ERROR:", error.response?.data || error);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Automatically append all fields, stringifying objects/arrays
      Object.keys(profile).forEach((key) => {
        if (Array.isArray(profile[key]) || (typeof profile[key] === "object" && profile[key] !== null)) {
          formData.append(key, JSON.stringify(profile[key]));
        } else {
          formData.append(key, profile[key]);
        }
      });

      if (resumeFile) formData.append("resume", resumeFile);
      if (profileImageFile) formData.append("profileImage", profileImageFile);

      const res = await axios.put(BACKEND_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setProfile({ ...defaultProfile, ...res.data }); // Sync local state with DB
        alert("Profile Saved Successfully ✅");
        setEditMode(false);
        setProfileImageFile(null);
        setResumeFile(null);
      }
    } catch (error) {
      console.error(error);
      alert("Save failed");
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

    if (newEducation.level && newEducation.university) {

      setProfile({
        ...profile,
        education: [...profile.education, newEducation],
      });

      setNewEducation({
        level: "",
        university: "",
        course: "",
        specialization: "",
        courseType: "",
        startDate: "",
        endDate: "",
        completed: false,
      });
    }
  };

  const addExperience = () => {

    if (newExperience.title) {

      setProfile({
        ...profile,
        experience: [...profile.experience, newExperience],
      });

      setNewExperience({
        title: "",
        company: "",
        year: "",
      });

    }
  };

  const addCertification = () => {

    if (newCertification.name) {

      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertification],
      });

      setNewCertification({
        name: "",
        organization: "",
      });

    }
  };

  /* ================= SCROLL ================= */

  const handleScroll = (id) => {

    setActive(id);

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });

  };

  const sections = [
    { name: "Resume", id: "resume" },
    { name: "Summary", id: "summary" },
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" },
    { name: "Experience", id: "experience" },
    { name: "Certifications", id: "certifications" },
  ];

  return (
    <div className="dashboard">

      <header className="topbar">

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <h2>My Profile</h2>

        <div className="top-actions">
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "View Mode" : "Edit Mode"}
          </button>

          {editMode && (
            <button onClick={saveProfile}>
              Save Profile
            </button>
          )}
        </div>
      </header>

      <div className="dashboard-body">

        {/* SIDEBAR */}
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <ul>
            {sections.map((item) => (
              <li
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => {
                  handleScroll(item.id);
                  setMenuOpen(false); // close menu after click
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </aside>

        {menuOpen && (
          <div
            className="overlay"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        {/* MAIN */}
        <main className="main2">

          {/* RESUME */}
          <section id="resume" className="card">

           {/* PROFILE IMAGE SECTION */}
            <div className="profile-image">
              <img
                src={profile.profileImage || "https://via.placeholder.com/150"}
                alt="profile"
                className="profile-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileImageFile(file);
                      setProfile(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }));
                    }
                  }}
                />
              )}
            </div>

            {editMode ? (
              <>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Name"
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

                <input
                  type="file"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </>
            ) : (
              <>
                <h3>{profile.name}</h3>
                <p>{profile.role}</p>
                <p>{profile.email}</p>
                <p>{profile.phone}</p>
              </>
            )}
          </section>

          {/* SUMMARY */}
          <section id="summary" className="card">
            <h3>Summary</h3>
            {editMode ? (
              <textarea
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              />
            ) : (
              <p>{profile.summary}</p>
            )}
          </section>

          {/* SKILLS */}
          <section id="skills" className="card">
            <h3>Skills</h3>
            {editMode && (
              <>
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                />
                <button onClick={addSkill}>Add</button>
              </>
            )}
            {profile.skills.map((skill, i) => (
              <div key={i}>{skill}</div>
            ))}
          </section>

          {/* EDUCATION */}
          <section id="education" className="card">
            <h3>Education</h3>

            {editMode && (
              <>
                <input placeholder="Level"
                  value={newEducation.level}
                  onChange={(e) => setNewEducation({ ...newEducation, level: e.target.value })} />

                <input placeholder="University"
                  value={newEducation.university}
                  onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })} />

                <input placeholder="Course"
                  value={newEducation.course}
                  onChange={(e) => setNewEducation({ ...newEducation, course: e.target.value })} />

                <input placeholder="Specialization"
                  value={newEducation.specialization}
                  onChange={(e) => setNewEducation({ ...newEducation, specialization: e.target.value })} />

                <input placeholder="Course Type"
                  value={newEducation.courseType}
                  onChange={(e) => setNewEducation({ ...newEducation, courseType: e.target.value })} />

                <input type="date"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })} />

                <input type="date"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })} />

                <label>
                  Completed
                  <input type="checkbox"
                    checked={newEducation.completed}
                    onChange={(e) => setNewEducation({ ...newEducation, completed: e.target.checked })} />
                </label>

                <button onClick={addEducation}>Add</button>
              </>
            )}

            {profile.education.map((edu, i) => (
              <div key={i}>
                <strong>{edu.level}</strong> - {edu.university}<br />
                {edu.course} ({edu.specialization})<br />
                {edu.startDate} - {edu.endDate}
              </div>
            ))}
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="card">
            <h3>Experience</h3>

            {editMode && (
              <>
                <input placeholder="Title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
                <input placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
                <button onClick={addExperience}>Add</button>
              </>
            )}

            {profile.experience.map((exp, i) => (
              <div key={i}>
                {exp.title} at {exp.company}
              </div>
            ))}
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <h3>Certifications</h3>

            {editMode && (
              <>
                <input placeholder="Name"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })} />
                <input placeholder="Organization"
                  value={newCertification.organization}
                  onChange={(e) => setNewCertification({ ...newCertification, organization: e.target.value })} />
                <button onClick={addCertification}>Add</button>
              </>
            )}

            {profile.certifications.map((cert, i) => (
              <div key={i}>
                {cert.name} - {cert.organization}
              </div>
            ))}
          </section>

        </main>
      </div>
    </div>
  );
}
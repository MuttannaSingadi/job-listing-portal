import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {

  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  const defaultProfile = {
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    summary: "",
    resume: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    links: { linkedin: "", github: "", portfolio: "" },
    personal: { dob: "", gender: "", languages: "" },
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [active, setActive] = useState("resume");

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
  });

  const [newCertification, setNewCertification] = useState({
    name: "",
    organization: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);

  /* ================= FETCH PROFILE ================= */



  useEffect(() => {
    fetchProfileFromDB();
  }, []);

  /* ================= FETCH FUNCTION ================= */

  const fetchProfileFromDB = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.get(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile({ ...defaultProfile, ...res.data });

    } catch (error) {
      console.log("REFETCH ERROR:", error);
    }
  };

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("role", profile.role);
      formData.append("location", profile.location);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("summary", profile.summary);

      formData.append("skills", JSON.stringify(profile.skills));
      formData.append("education", JSON.stringify(profile.education));
      formData.append("experience", JSON.stringify(profile.experience));
      formData.append("projects", JSON.stringify(profile.projects));
      formData.append("certifications", JSON.stringify(profile.certifications));

      formData.append("links", JSON.stringify(profile.links));
      formData.append("personal", JSON.stringify(profile.personal));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      await axios.put(BACKEND_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });


      alert("Profile Saved Successfully ✅");
      setEditMode(false);
      fetchProfileFromDB();

    } catch (error) {
      console.log("SAVE ERROR:", error.response?.data || error.message);
      alert("Profile Save Failed ❌");
    }
  };


  const sections = [
    { name: "Resume", id: "resume" },
    { name: "Summary", id: "summary" },
    { name: "Skills", id: "skills" },
    { name: "Education", id: "education" },
    { name: "Experience", id: "experience" },
    { name: "Certifications", id: "certifications" }
  ];

  const handleScroll = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill],
    });

    setNewSkill("");
  };

  const addEducation = () => {
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
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, newExperience],
    });

    setNewExperience({
      title: "",
      company: "",
    });
  };

  // DELETE SKILL
  const deleteSkill = (index) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  // DELETE EDUCATION
  const deleteEducation = (index) => {
    const updatedEducation = profile.education.filter((_, i) => i !== index);
    setProfile({ ...profile, education: updatedEducation });
  };

  // DELETE EXPERIENCE
  const deleteExperience = (index) => {
    const updatedExperience = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: updatedExperience });
  };

  // DELETE CERTIFICATION
  const deleteCertification = (index) => {
    const updatedCertifications = profile.certifications.filter((_, i) => i !== index);
    setProfile({ ...profile, certifications: updatedCertifications });
  };

  const addCertification = () => {
    setProfile({
      ...profile,
      certifications: [...profile.certifications, newCertification],
    });

    setNewCertification({
      name: "",
      organization: "",
    });
  };
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
          <button onClick={() => {
            if (editMode) {
              // If cancelling, RE-FETCH original data from DB to undo typed changes
              fetchProfileFromDB();
            }
            setEditMode(!editMode);
          }}>
            {editMode ? "veiw" : "Edit"}
          </button>

          {editMode && (
            <button className="save-btn" onClick={saveProfile}>
              Save
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

            {/* PROFILE IMAGE */}
            <div className="profile-image">

              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="profile"
                />
              ) : (
                <div className="avatar">No Image</div>
              )}

              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImageFile(e.target.files[0])}
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
                <button className="add-btn" onClick={addSkill}>Add</button>
              </>
            )}
            {(profile.skills || []).map((skill, i) => (
              <div key={i}>
                {skill}
                {editMode && (
                  <button className="delete-btn" onClick={() => deleteSkill(i)}>
                    Delete
                  </button>
                )}
              </div>
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

               <button className="add-btn" onClick={addSkill}>Add</button>
              </>
            )}

            {(profile.education || []).map((edu, i) => (
              <div key={i}>
                <strong>{edu.level}</strong> - {edu.university}<br />
                {edu.course} ({edu.specialization})<br />
                {edu.startDate} - {edu.endDate}

                {editMode && (
                  <button className="delete-btn" onClick={() => deleteEducation(i)}>
                    Delete
                  </button>
                )}
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
                <button className="add-btn" onClick={addExperience}>Add</button>
              </>
            )}

            {(profile.experience || []).map((exp, i) => (
              <div key={i}>
                {exp.title} at {exp.company}

                {editMode && (
                  <button className="delete-btn" onClick={() => deleteExperience(i)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <h3>Certifications</h3>

            {editMode && (
              <>
                <input
                  placeholder="Name"
                  value={newCertification.name}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, name: e.target.value })
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

               <button className="add-btn" onClick={addCertification}>Add</button>
              </>
            )}

            {(profile.certifications || []).map((cert, i) => (
              <div key={i}>
                {cert.name} - {cert.organization}

                {editMode && (
                  <button className="delete-btn" onClick={() => deleteCertification(i)}>
                    Delete
                  </button>
                )}
              </div>
            ))}

            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Download Resume
              </a>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

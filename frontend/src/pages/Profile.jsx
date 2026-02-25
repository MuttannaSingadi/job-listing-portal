import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const BACKEND_URL =
    "https://job-listing-portal-iu9g.onrender.com/api/profile";

  const [active, setActive] = useState("resume");
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [profile, setProfile] = useState({
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
  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    duration: "",
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

    const formData = new FormData();

    Object.keys(profile).forEach((key) => {
      if (typeof profile[key] === "object") {
        formData.append(key, JSON.stringify(profile[key]));
      } else {
        formData.append(key, profile[key]);
      }
    });

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    await axios.put(BACKEND_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ REMOVE Content-Type
      },
    });

    alert("Profile Saved Successfully ✅");
    setEditMode(false);
  } catch (error) {
    console.log("SAVE ERROR:", error.response?.data || error);
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
    if (newEducation.degree) {
      setProfile({
        ...profile,
        education: [...profile.education, newEducation],
      });
      setNewEducation({ degree: "", institution: "", year: "" });
    }
  };

  const addExperience = () => {
    if (newExperience.company) {
      setProfile({
        ...profile,
        experience: [...profile.experience, newExperience],
      });
      setNewExperience({ company: "", role: "", duration: "" });
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
      {/* ================= TOPBAR ================= */}
      <header className="topbar">
        <h2>My Profile</h2>

        <div className="top-actions">
          <button onClick={() => setEditMode(!editMode)} className="edit-btn">
            {editMode ? "View Mode" : "Edit Mode"}
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="dark-btn">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {editMode && (
            <button onClick={saveProfile} className="primary-btn">
              Save Profile
            </button>
          )}

          <div className="avatar">
            {profile.name ? profile.name[0] : "M"}
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* ================= SIDEBAR ================= */}
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

        {/* ================= MAIN ================= */}
        <main className="main">

          {/* RESUME */}
          <section id="resume" className="card">
            {editMode ? (
              <>
                <input value={profile.name} onChange={(e)=>setProfile({...profile,name:e.target.value})} placeholder="Name"/>
                <input value={profile.role} onChange={(e)=>setProfile({...profile,role:e.target.value})} placeholder="Role"/>
                <input value={profile.location} onChange={(e)=>setProfile({...profile,location:e.target.value})} placeholder="Location"/>
                <input value={profile.email} onChange={(e)=>setProfile({...profile,email:e.target.value})} placeholder="Email"/>
                <input value={profile.phone} onChange={(e)=>setProfile({...profile,phone:e.target.value})} placeholder="Phone"/>

                <input type="file" accept=".pdf,.doc,.docx"
                  onChange={(e)=>setResumeFile(e.target.files[0])}/>
              </>
            ) : (
              <>
                <h3>{profile.name}</h3>
                <p>{profile.role}</p>
                <p>{profile.location}</p>
                <p>{profile.email}</p>
                <p>{profile.phone}</p>

                {profile.resume && (
                  <a
                    href={`https://job-listing-portal-iu9g.onrender.com${profile.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-btn"
                  >
                    View Resume
                  </a>
                )}
              </>
            )}
          </section>

          {/* SUMMARY */}
          <section id="summary" className="card">
            <h3>Summary</h3>
            {editMode ? (
              <textarea value={profile.summary}
                onChange={(e)=>setProfile({...profile,summary:e.target.value})}/>
            ) : (
              <p>{profile.summary}</p>
            )}
          </section>

          {/* SKILLS */}
          <section id="skills" className="card">
            <h3>Skills</h3>
            {editMode && (
              <div className="row">
                <input value={newSkill}
                  onChange={(e)=>setNewSkill(e.target.value)}/>
                <button onClick={addSkill} className="primary-btn">Add</button>
              </div>
            )}
            {profile.skills.map((skill,i)=><div key={i}>{skill}</div>)}
          </section>

          {/* EDUCATION */}
          <section id="education" className="card">
            <h3>Education</h3>
            {editMode && (
              <>
                <input placeholder="Degree" value={newEducation.degree}
                  onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})}/>
                <input placeholder="Institution" value={newEducation.institution}
                  onChange={(e)=>setNewEducation({...newEducation,institution:e.target.value})}/>
                <input placeholder="Year" value={newEducation.year}
                  onChange={(e)=>setNewEducation({...newEducation,year:e.target.value})}/>
                <button onClick={addEducation} className="primary-btn">Add</button>
              </>
            )}
            {profile.education.map((edu,i)=>
              <div key={i}>{edu.degree} - {edu.institution} ({edu.year})</div>
            )}
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="card">
            <h3>Experience</h3>
            {editMode && (
              <>
                <input placeholder="Company" value={newExperience.company}
                  onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}/>
                <input placeholder="Role" value={newExperience.role}
                  onChange={(e)=>setNewExperience({...newExperience,role:e.target.value})}/>
                <input placeholder="Duration" value={newExperience.duration}
                  onChange={(e)=>setNewExperience({...newExperience,duration:e.target.value})}/>
                <button onClick={addExperience} className="primary-btn">Add</button>
              </>
            )}
            {profile.experience.map((exp,i)=>
              <div key={i}>{exp.role} at {exp.company} ({exp.duration})</div>
            )}
          </section>

          {/* PROJECTS */}
          <section id="projects" className="card">
            <h3>Projects</h3>
            {editMode && (
              <>
                <input placeholder="Title" value={newProject.title}
                  onChange={(e)=>setNewProject({...newProject,title:e.target.value})}/>
                <textarea placeholder="Description" value={newProject.description}
                  onChange={(e)=>setNewProject({...newProject,description:e.target.value})}/>
                <button onClick={addProject} className="primary-btn">Add</button>
              </>
            )}
            {profile.projects.map((proj,i)=>
              <div key={i}><strong>{proj.title}</strong> - {proj.description}</div>
            )}
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="card">
            <h3>Certifications</h3>
            {editMode && (
              <>
                <input placeholder="Title" value={newCertification.title}
                  onChange={(e)=>setNewCertification({...newCertification,title:e.target.value})}/>
                <input placeholder="Organization" value={newCertification.organization}
                  onChange={(e)=>setNewCertification({...newCertification,organization:e.target.value})}/>
                <input placeholder="Year" value={newCertification.year}
                  onChange={(e)=>setNewCertification({...newCertification,year:e.target.value})}/>
                <button onClick={addCertification} className="primary-btn">Add</button>
              </>
            )}
            {profile.certifications.map((cert,i)=>
              <div key={i}>{cert.title} - {cert.organization} ({cert.year})</div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
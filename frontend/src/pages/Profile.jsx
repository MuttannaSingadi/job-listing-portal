import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {

  const [user, setUser] = useState({
    name: "",
    role: "",
    location: "",
    phone: "",
    email: "",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://job-portal-backend.onrender.com/api/profile"; 
  // 👉 Replace with your Render backend URL

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(BACKEND_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setUser({
            name: res.data.name || "",
            role: res.data.role || "",
            location: res.data.location || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
          });

          setSkills(res.data.skills || []);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        BACKEND_URL,
        { ...user, skills },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile Updated Successfully ✅");
      setLoading(false);

    } catch (error) {
      console.log("Update error:", error);
      setLoading(false);
    }
  };

  // ================= ADD SKILL =================
  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  // ================= REMOVE SKILL =================
  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
  };

  return (
    <div className="profile-dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="profile-sidebar">
        <h2>Quick Links</h2>
        <ul>
          <li>Resume</li>
          <li>Key Skills</li>
          <li>Employment</li>
          <li>Education</li>
          <li>Projects</li>
          <li>Personal Details</li>
        </ul>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="profile-main">

        <h2 className="page-title">My Profile</h2>

        {/* ================= PERSONAL DETAILS ================= */}
        <div className="profile-card">
          <h3>Personal Details</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          />

          <input
            type="text"
            placeholder="Location"
            value={user.location}
            onChange={(e) => setUser({ ...user, location: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        {/* ================= SKILLS ================= */}
        <div className="profile-card">
          <h3>Key Skills</h3>

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
                <button onClick={() => removeSkill(index)}>❌</button>
              </span>
            ))}
          </div>
        </div>

        {/* ================= SAVE BUTTON ================= */}
        <div className="profile-card">
          <button 
            className="primary-btn" 
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </main>
    </div>
  );
}
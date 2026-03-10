import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDashboard.css";
import profile from "../assets/image.png";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/image.png";

const API =
    import.meta.env.VITE_API_URL ||
    "https://job-listing-portal-iu9g.onrender.com";

export default function Admin() {
    const navigate = useNavigate();

    const [active, setActive] = useState("dashboard");
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const [job, setJob] = useState({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: "",
        experience: "",
        skills: "",
    });

    const [editMode, setEditMode] = useState(false);

    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        company: "",
        location: "",
        website: "",
        profileImage: "", // store image path
    });

    /* ================= AUTH CHECK ================= */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/auth");
    }, [navigate]);

    /* ================= FETCH JOBS ================= */
    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/api/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setJobs(res.data);
        } catch (err) {
            console.log("Jobs fetch error:", err.response?.data || err.message);
        }
    };

    /* ================= FETCH APPLICATIONS ================= */
    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/api/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setApplications(res.data);
        } catch (err) {
            console.log("Applications fetch error:", err.response?.data || err.message);
        }
    };

    /* ================= FETCH PROFILES ================= */
    const fetchProfiles = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/api/admin/profiles`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfiles(res.data);
        } catch (err) {
            console.log("Profiles fetch error:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchApplications();
        fetchProfiles();
    }, []);

    /* ================= HANDLE PROFILE CHANGE ================= */
    const handleProfileChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value,
        });
    };

    /* ================= SAVE PROFILE WITH IMAGE ================= */
    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            Object.keys(employee).forEach((key) => {
                formData.append(key, employee[key]);
            });

            if (profileImage) formData.append("profileImage", profileImage);

            const res = await axios.put(`${API}/api/employee/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setEmployee(res.data);
            setEditMode(false);
            alert("Profile updated ✅");
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    /* ================= HANDLE JOB FORM ================= */
    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.post(`${API}/api/jobs`, job, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Job posted successfully ✅");

            setJob({
                title: "",
                company: "",
                salary: "",
                location: "",
                description: "",
                experience: "",
                skills: "",
            });

            fetchJobs();
            setActive("manage");
        } catch (err) {
            alert(err.response?.data?.message || "Unauthorized ❌");
        }
    };

    return (
        <div className="admin-wrapper">
            {/* ===== TOP NAVBAR ===== */}
            <div className="top-navbar">
                <div className="nav-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>

                    <div className="brand">
                        <Link to="/">
                            <img src={logo} alt="DevHire Logo" />
                        </Link>
                    </div>
                </div>

                <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? "✕" : "☰"}
                </div>

                <div className={`nav-center ${menuOpen ? "open" : ""}`}>
                    <ul>
                        <li onClick={() => { setActive("profile"); setMenuOpen(false); }}>Profile</li>
                        <li onClick={() => { setActive("post"); setMenuOpen(false); }}>Post Job</li>
                        <li onClick={() => { setActive("manage"); setMenuOpen(false); }}>Manage Jobs</li>
                        <li onClick={() => { setActive("applications"); setMenuOpen(false); }}>Applications</li>
                        <li onClick={() => { setActive("profiles"); setMenuOpen(false); }}>Candidates</li>
                    </ul>
                </div>

                <div className="nav-right">
                    <div className="profile-img">
                        <img src={employee.profileImage ? `${API}${employee.profileImage}` : profile} alt="Profile" />
                    </div>
                    <button className="logout-btn">Logout</button>
                </div>
            </div>

            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

            {/* ===== MAIN ===== */}
            <div className="main">
                {/* ===== PROFILE ===== */}
                {active === "profile" && (
                    <div className="profile-section">
                        <h2>Employee Profile</h2>
                        <div className="profile-card">
                            <div className="profile-image-upload">
                                <img
                                    src={
                                        employee.profileImage
                                            ? `data:image/png;base64,${employee.profileImage}`
                                            : profile
                                    }
                                    alt="Profile"
                                    className="profile-img-big"
                                />
                                {editMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                    />
                                )}
                            </div>

                            <div className="profile-details">
                                {!editMode ? (
                                    <>
                                        <h3>Personal Information</h3>
                                        <p><strong>Name:</strong> {employee.name}</p>
                                        <p><strong>Email:</strong> {employee.email}</p>
                                        <p><strong>Phone:</strong> {employee.phone}</p>
                                        <p><strong>Role:</strong> {employee.role}</p>

                                        <h3>Company Information</h3>
                                        <p><strong>Company:</strong> {employee.company}</p>
                                        <p><strong>Location:</strong> {employee.location}</p>
                                        <p><strong>Website:</strong> {employee.website}</p>

                                        <div className="profile-buttons">
                                            <button className="edit-btn" onClick={() => setEditMode(true)}>
                                                Edit Profile
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="profile-form">
                                        <input name="name" value={employee.name} onChange={handleProfileChange} placeholder="Name" />
                                        <input name="email" value={employee.email} onChange={handleProfileChange} placeholder="Email" />
                                        <input name="phone" value={employee.phone} onChange={handleProfileChange} placeholder="Phone" />
                                        <input name="role" value={employee.role} onChange={handleProfileChange} placeholder="Role" />
                                        <input name="company" value={employee.company} onChange={handleProfileChange} placeholder="Company" />
                                        <input name="location" value={employee.location} onChange={handleProfileChange} placeholder="Location" />
                                        <input name="website" value={employee.website} onChange={handleProfileChange} placeholder="Website" />

                                        <button className="save-btn" onClick={saveProfile}>
                                            Save Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== POST JOB ===== */}
                {active === "post" && (
                    <div className="post-section">
                        <h2>Post New Job</h2>
                        <form onSubmit={handleSubmit}>
                            <input name="title" placeholder="Title" value={job.title} onChange={handleChange} required />
                            <input name="company" placeholder="Company" value={job.company} onChange={handleChange} required />
                            <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
                            <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
                            <input name="experience" placeholder="Experience" value={job.experience} onChange={handleChange} required />
                            <input name="skills" placeholder="Skills" value={job.skills} onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" value={job.description} onChange={handleChange} required />
                            <button type="submit">Post Job</button>
                        </form>
                    </div>
                )}

                {/* ===== MANAGE JOBS ===== */}
                {active === "manage" && (
                    <div className="jobs-grid">
                        {jobs.map((j) => (
                            <div key={j._id} className="job-card">
                                <h4>{j.title}</h4>
                                <p>{j.company}</p>
                                <p>₹ {j.salary}</p>
                                <p>{j.location}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== APPLICATIONS ===== */}
                {active === "applications" && (
                    <div className="jobs-grid">
                        {applications.length === 0 ? (
                            <p>No applications yet</p>
                        ) : (
                            applications.map((app) => (
                                <div key={app._id} className="job-card">
                                    <h4>{app.jobId?.title}</h4>
                                    <p>Applicant: {app.applicantEmail}</p>
                                    <p>Company: {app.jobId?.company}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ===== CANDIDATES ===== */}
                {active === "profiles" && (
                    <div className="jobs-grid">
                        {profiles.length === 0 ? (
                            <p>No candidates yet</p>
                        ) : (
                            profiles.map((profile) => (
                                <div key={profile._id} className="job-card">
                                    <h3>{profile.name}</h3>
                                    <p>Email: {profile.email}</p>
                                    <p>Role: {profile.role}</p>
                                    <p>Location: {profile.location}</p>
                                    <h4>Skills</h4>
                                    <p>{profile.skills?.join(", ")}</p>
                                    {profile.resume && (
                                        <a
                                            href={profile.resume.replace("/upload/", "/upload/fl_attachment/")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Resume
                                        </a>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
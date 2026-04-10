import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/EmployeeDashboard.css";
import AdminNavbar from "../components/AdminNavbar";
import profile from "../assets/image.png";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

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
    const [editingId, setEditingId] = useState(null);

    const [job, setJob] = useState({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: "",
        experience: "",
        skills: "",
        isRecommended: false,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/auth");
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProfiles = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/employee/profiles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfiles(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchApplications();
        fetchProfiles();
    }, []);

    /* FETCH SINGLE PROFILE */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/api/employee/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployee(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    /* HANDLE JOB INPUT */
    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value,
        });
    };

    /* POST JOB */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (editingId) {
                await axios.put(`${API}/api/jobs/${editingId}`, job, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                alert("Job Updated Successfully");

            } else {
                await axios.post(`${API}/api/jobs`, job, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                alert("Job Posted Successfully");
            }

            setJob({
                title: "",
                company: "",
                salary: "",
                location: "",
                description: "",
                experience: "",
                skills: "",
                isRecommended: false,
            });

            setEditingId(null); 
            fetchJobs();

        } catch (err) {
            console.log(err);
            alert("Error saving job");
        }
    };

    const toggleRecommended = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(`${API}/api/recommended-jobs/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchJobs();
        } catch (err) {
            console.log(err);
        }
    };

    const deleteJob = async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!window.confirm("Are you sure you want to delete this job?")) return;

            await axios.delete(`${API}/api/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setJobs((prev) => prev.filter((job) => job._id !== id));

            alert("Job Deleted Successfully");

        } catch (err) {
            console.log("DELETE ERROR:", err.response?.data || err.message);
            alert("Error deleting job");
        }
    };


    const editJob = (job) => {
        const { _id, ...rest } = job; 
        setJob(rest);
        setEditingId(_id);
        setActive("post");
    };

    /* UPDATE STATUS */
    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${API}/api/applications/status/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === id ? { ...app, status } : app
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    /* PROFILE STATE */
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        company: "",
        location: "",
        website: "",
        profileImage: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // HANDLE PROFILE INPUT 
    const handleProfileChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    // JOBS PER LOCATION
    const jobData = jobs.reduce((acc, job) => {
        const location = job.location || "Other";
        const found = acc.find((item) => item.name === location);

        if (found) {
            found.jobs += 1;
        } else {
            acc.push({ name: location, jobs: 1 });
        }

        return acc;
    }, []);

    // APPLICATION STATUS
    const statusData = [
        { name: "Pending", value: applications.filter(a => a.status === "Pending").length },
        { name: "Interview", value: applications.filter(a => a.status === "Interview").length },
        { name: "Accepted", value: applications.filter(a => a.status === "Accepted").length },
        { name: "Rejected", value: applications.filter(a => a.status === "Rejected").length },
    ];

    const trendData = jobs.reduce((acc, job) => {
        const date = new Date(job.createdAt).toLocaleDateString();

        const found = acc.find((d) => d.date === date);

        if (found) {
            found.count += 1;
        } else {
            acc.push({ date, count: 1 });
        }

        return acc;
    }, []);

    /* SAVE PROFILE */
    const saveProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("name", employee.name);
            formData.append("phone", employee.phone);
            formData.append("role", employee.role);
            formData.append("company", employee.company);
            formData.append("location", employee.location);
            formData.append("website", employee.website);

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const res = await axios.put(`${API}/api/employee/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setEmployee(res.data);
            setEditMode(false);

            alert("Profile Updated");

        } catch (err) {
            console.log(err);
            alert("Error updating profile");
        }
    };

    const COLORS = ["#f59e0b", "#222090", "#f59e0b", "#ef4444"];

    return (
        <div className="admin-wrapper">

            <AdminNavbar
                navigate={navigate}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                setActive={setActive}
                profileImage={employee.profileImage}
            />

            <div className="main">

                {/* DASHBOARD */}
                {active === "dashboard" && (
                    <div className="dashboard">

                        <h2 className="dashboard-title">Dashboard Overview</h2>

                        {/* TOP CARDS  */}
                        <div className="cards">

                            <div className="card">
                                <h3>📌 Total Jobs</h3>
                                <p>{jobs.length}</p>
                            </div>

                            <div className="card">
                                <h3>📄 Applications</h3>
                                <p>{applications.length}</p>
                            </div>

                            <div className="card">
                                <h3>👨‍💼 Candidates</h3>
                                <p>{profiles.length}</p>
                            </div>

                        </div>

                        <div className="charts">

                            {/*  BAR CHART */}
                            <div className="chart-box">
                                <h3>📊 Jobs by Location</h3>

                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={jobData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="jobs" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/*  PIE CHART */}
                            <div className="chart-box">
                                <h3>📈 Application Status</h3>

                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={80}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart-box">
                                <h3>📈 Hiring Trends</h3>

                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={trendData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                        </div>

                        {/* RECENT JOBS */}
                        <div className="dashboard-section">
                            <h3>🆕 Recent Jobs</h3>

                            {jobs.slice(0, 3).map((job) => (
                                <div key={job._id} className="dashboard-item">
                                    <p><strong>{job.title}</strong> - {job.company}</p>
                                    <span>{job.location}</span>
                                </div>
                            ))}
                        </div>

                        {/*  RECENT APPLICATIONS */}
                        <div className="dashboard-section">
                            <h3>📥 Recent Applications</h3>

                            {applications.slice(0, 3).map((app) => (
                                <div key={app._id} className="dashboard-item">
                                    <p><strong>{app.applicantName}</strong></p>
                                    <span>{app.jobId?.title}</span>
                                </div>
                            ))}
                        </div>

                        {/*  QUICK ACTIONS  */}
                        <div className="dashboard-section">
                            <h3>⚡ Quick Actions</h3>

                            <div className="quick-actions">
                                <button onClick={() => setActive("post")}>
                                    ➕ Post Job
                                </button>

                                <button onClick={() => setActive("manage")}>
                                    📋 Manage Jobs
                                </button>

                                <button onClick={() => setActive("applications")}>
                                    📑 View Applications
                                </button>
                            </div>
                        </div>

                    </div>
                )}
                {/*  PROFILE  */}
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
                                    <label className="edit-image-btn">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setProfileImage(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                        <i className="fa fa-pencil"></i>
                                    </label>
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
                                            <button
                                                className="edit-btn"
                                                onClick={() => setEditMode(true)}
                                            >
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


                {/*  POST JOB  */}
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
                            {/* ⭐ NEW FIELD (IMPORTANT) */}
                            <label style={{ marginTop: "10px" }}>
                                <input
                                    type="checkbox"
                                    name="isRecommended"
                                    checked={job.isRecommended || false}
                                    onChange={(e) =>
                                        setJob({ ...job, isRecommended: e.target.checked })
                                    }
                                />
                                Mark as Recommended ⭐
                            </label>
                            <button type="submit">Post Job</button>
                        </form>
                    </div>
                )}

                {/*  MANAGE JOBS */}
                {active === "manage" && (
                    <div className="jobs-grid">
                        {jobs.map((j) => (
                            <div key={j._id} className="job-card">
                                {j.isRecommended && <span className="badge">⭐ Featured</span>}
                                <h4>{j.title}</h4>
                                <p>{j.company}</p>
                                <p>₹ {j.salary}</p>
                                <p>{j.location}</p>

                                {/*  ACTION BUTTONS */}
                                <div className="job-actions">
                                    <button
                                        className="recommended-btn"
                                        onClick={() => toggleRecommended(j._id)}
                                    >
                                        {j.isRecommended ? "⭐ Recommended" : "☆"}
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => editJob(j)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteJob(j._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* APPLICATIONS  */}
                {active === "applications" && (
                    <div>
                        <h2>Job Applications</h2>

                        {applications.length === 0 ? (
                            <p>No applications yet</p>
                        ) : (
                            <div className="jobs-grid">
                                {applications.map((app) => (
                                    <div key={app._id} className="job-card">
                                        <h4>{app.jobId?.title}</h4>
                                        <p><strong>Company:</strong> {app.jobId?.company}</p>
                                        <p><strong>Name:</strong> {app.applicantName}</p>
                                        <p><strong>Email:</strong> {app.applicantEmail}</p>
                                        <p><strong>Phone:</strong> {app.phone}</p>

                                        <select
                                            value={app.status || "Pending"}
                                            onChange={(e) =>
                                                updateStatus(app._id, e.target.value)
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Interview">Interview</option>
                                            <option value="SecondRound">Second Round</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>

                                        {app.resumeUrl && (
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/*  CANDIDATES  */}
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
                                            href={profile.resume.replace(
                                                "/upload/",
                                                "/upload/fl_attachment/"
                                            )}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
    experience: "",
    skills: ""
  });

  const [jobs, setJobs] = useState([]);

  // 🔐 Protect admin page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/auth");
    }
  }, [navigate]);

  // ✅ Fetch All Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/jobs/create",
        job,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Job posted successfully ✅");

      setJob({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: "",
        experience: "",
        skills: ""
      });

      fetchJobs();

    } catch (error) {
      alert(error.response?.data?.msg || "Not authorized ❌");
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin - Post New Job</h2>

      {/* 🔹 POST JOB FORM */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={job.salary}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience (0 = Fresher)"
          value={job.experience}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (React, Node, MongoDB)"
          value={job.skills}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Post Job</button>
      </form>

      {/* 🔹 JOB LIST SECTION */}
      <section className="jobs-section">
        <h2 className="section-title">All Posted Jobs</h2>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p>No jobs available 🚀</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>

                <div className="details">
                  <div className="detail-item">
                    💰 <strong>Salary:</strong> ₹{job.salary}
                  </div>

                  <div className="detail-item">
                    📍 <strong>Location:</strong> {job.location}
                  </div>

                  <div className="detail-item">
                    👨‍💻 <strong>Experience:</strong>{" "}
                    {job.experience === 0
                      ? "Fresher"
                      : `${job.experience} Years`}
                  </div>
                </div>

                <p className="desc">
                  <strong>Description:</strong> {job.description}
                </p>

                <div className="skills">
                  <strong>Skills:</strong>
                  <div className="skill-tags">
                    {job.skills
                      ? job.skills.split(",").map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))
                      : " Not specified"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
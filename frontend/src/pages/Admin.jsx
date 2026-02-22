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
    description: ""
  });

  // 🔐 Protect admin page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/auth");
    }
  }, [navigate]);

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
        description: ""
      });

    } catch (error) {
      alert(error.response?.data?.msg || "Not authorized ❌");
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin - Post New Job</h2>

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

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
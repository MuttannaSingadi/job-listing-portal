import { useState } from "react";
import axios from "axios";
import "./admin.css";

export default function Admin() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/jobs/create", job);
      alert("Job posted successfully ✅");

      setJob({
        title: "",
        company: "",
        salary: "",
        location: "",
        description: ""
      });

    } catch (error) {
      alert("Error posting job");
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
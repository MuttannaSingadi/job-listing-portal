import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ApplyJob() {

  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [resume, setResume] = useState(null);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    const data = new FormData();

    data.append("jobId", id);
    data.append("jobTitle", "Job Application");
    data.append("applicantName", form.name);
    data.append("applicantEmail", form.email);
    data.append("phone", form.phone);
    data.append("resume", resume);

    try {

      await axios.post(
        "http://localhost:5000/api/applications/apply",
        data
      );

      alert("Application submitted successfully");

    } catch (err) {

      alert("Application failed");

    }

  };

  return (

    <div style={{ padding: "40px" }}>

      <h2>Apply for Job</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={handleSubmit}>
        Submit Application
      </button>

    </div>
  );
}
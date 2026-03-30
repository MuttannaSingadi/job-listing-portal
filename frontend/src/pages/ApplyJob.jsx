import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../style/ApplyJob.css";

export default function ApplyJob() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const [resume, setResume] = useState(null);

    const [message, setMessage] = useState("");

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

            setLoading(true);

            await axios.post(
                "https://job-listing-portal-iu9g.onrender.com/api/applications/apply",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setLoading(false);

            setMessage("✅ Application submitted successfully");

            
            setTimeout(() => {
                navigate("/jobs");
            }, 2000);

        } catch (err) {

            setLoading(false);

            setMessage("❌ Application failed");

        }

    };
    return (

<div className="apply-page">

  <div className="apply-container">

    <h2>Apply for Job</h2>

    {message && <div className="success-msg">{message}</div>}

    {loading && <p className="loading-text">Submitting application...</p>}

    <div className="apply-form">

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        className="file-input"
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <button
        className="apply-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

    </div>

  </div>

</div>
    );
}
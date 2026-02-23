import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://job-listing-portal-iu9g.onrender.com/api/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  // 🔐 Apply button logic
  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to apply");
      navigate("/auth");
      return;
    }

    alert("Application submitted successfully ✅");
  };

  return (
    <div className="jobs-page">
      <h2 className="jobs-title">Available Jobs</h2>

      {loading ? (
        <p className="no-jobs">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="no-jobs">No jobs available 🚀</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company} ⭐ 4.2</p>

              <div className="details">
                <span>
                  {job.experience === 0
                    ? "Fresher"
                    : `${job.experience} Years`}
                </span>
                <span>₹ {job.salary}</span>
                <span>{job.location}</span>
              </div>

              <p className="description">{job.description}</p>

              <div className="tags">
                <span>{job.skills || "Skills not specified"}</span>
              </div>

              <button
                className="apply-btn"
                onClick={() => handleApply(job._id)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://job-listing-portal-iu9g.onrender.com/api/recommended-jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (jobs.length === 0) return null;

  return (
    <div className="recommended-section">
      <h2>⭐ Recommended Jobs</h2>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job._id} className="job-card recommended">

            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>

            <div className="details">
              <span>
                {job.experience === 0
                  ? "Fresher"
                  : `${job.experience} Years`}
              </span>
              <span>₹ {job.salary}</span>
              <span>{job.location}</span>
            </div>

            <div className="tags">
              <span>{job.skills}</span>
            </div>

            <button
              className="apply-btn"
              onClick={() => navigate(`/apply/${job._id}`)}
            >
              Apply Now
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
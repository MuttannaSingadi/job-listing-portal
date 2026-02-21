import { useEffect, useState } from "react";
import axios from "axios";
import "./jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        console.log("Jobs from API:", res.data);
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

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
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>

              <div className="details">
                <span>{job.salary}</span>
                <span>{job.location}</span>
              </div>

              <p className="description">{job.description}</p>

              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
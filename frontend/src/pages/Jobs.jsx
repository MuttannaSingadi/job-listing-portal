import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./jobs.css";
import { FaArrowLeft } from "react-icons/fa";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    axios
      .get("https://job-listing-portal-iu9g.onrender.com/api/jobs")
      .then((res) => {
        setJobs(res.data);
        setFilteredJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const searchText = search.toLowerCase();

      return (
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        job.skills?.toLowerCase().includes(searchText)
      );
    });

    setFilteredJobs(filtered);
  }, [search, jobs]);

  /* ================= APPLY ================= */
  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to apply");
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        "https://job-listing-portal-iu9g.onrender.com/api/applications/apply",
        { jobId, applicantEmail: "user@example.com" }
      );

      alert("Application submitted successfully ✅");
    } catch (err) {
      alert("Application failed ❌");
    }
  };

  return (
    <div className="jobs-page">

      {/* ===== HEADER SECTION ===== */}
      <div className="jobs-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>
        <div>
          <h1 className="jobs-title">Find Your Dream Job</h1>
          <p className="jobs-subtitle">
            Discover opportunities that match your skills and passion
          </p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search job, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===== JOB LIST ===== */}
      {loading ? (
        <p className="no-jobs">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="no-jobs">No matching jobs found 🚀</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
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
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
  const [expandedJob, setExpandedJob] = useState(null);

  /* ===== SAVE JOB STATE ===== */
  const [savedJobs, setSavedJobs] = useState([]);

  const [jobTypes, setJobTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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

  useEffect(() => {

    const buttons = document.querySelectorAll(".read-more");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {

        const description = btn.previousElementSibling;

        description.classList.toggle("expanded");

        btn.textContent =
          description.classList.contains("expanded")
            ? "Show less"
            : "Read more";
      });
    });

  }, []);


  /* ================= FILTER + SEARCH ================= */
  useEffect(() => {

    const filtered = jobs.filter((job) => {

      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        job.skills?.toLowerCase().includes(searchText);

      const matchesJobType =
        jobTypes.length === 0 || jobTypes.includes(job.jobType);

      const matchesCategory =
        categories.length === 0 || categories.includes(job.category);

      const matchesMinSalary =
        !minSalary || job.salary >= Number(minSalary);

      const matchesMaxSalary =
        !maxSalary || job.salary <= Number(maxSalary);

      return (
        matchesSearch &&
        matchesJobType &&
        matchesCategory &&
        matchesMinSalary &&
        matchesMaxSalary
      );

    });

    setFilteredJobs(filtered);

  }, [search, jobs, jobTypes, categories, minSalary, maxSalary]);
  
  /* ===== CATEGORY FILTER ===== */
  const handleCategoryChange = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  /* ===== CLEAR FILTERS ===== */
  const clearFilters = () => {
    setJobTypes([]);
    setCategories([]);
    setMinSalary("");
    setMaxSalary("");
  };

  /* ================= SAVE JOB ================= */
  const handleSave = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const toggleDescription = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="jobs-page">

      {/* ===== HEADER ===== */}
      <div className="jobs-header">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
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

      {/* ===== MAIN LAYOUT ===== */}
      <div className="jobs-layout">

        {/* ===== FILTER SIDEBAR ===== */}
        <button className="mobile-filter-btn" onClick={() => setShowFilter(!showFilter)}>
          Filter Jobs
        </button>
        <div className={`filter-sidebar ${showFilter ? "show" : ""}`}>

          <div className="filter-header">
            <h3>Filter Jobs</h3>
            <span className="clear" onClick={clearFilters}>Clear All</span>
          </div>

          {/* JOB TYPE */}
          <div className="filter-section">
            <h4>Job Type</h4>

            <label>
              <input
                type="checkbox"
                onChange={() => handleJobTypeChange("Remote")}
              />
              Remote
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleJobTypeChange("Full-Time")}
              />
              Full-Time
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleJobTypeChange("Part-Time")}
              />
              Part-Time
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleJobTypeChange("Contract")}
              />
              Contract
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleJobTypeChange("Internship")}
              />
              Internship
            </label>
          </div>

          {/* SALARY */}
          <div className="filter-section">
            <h4>Salary Range</h4>

            <input
              type="number"
              placeholder="Min Salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max Salary"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="filter-section">
            <h4>Category</h4>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("Engineering")}
              />
              Engineering
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("Design")}
              />
              Design
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("Marketing")}
              />
              Marketing
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("Sales")}
              />
              Sales
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("HR")}
              />
              HR
            </label>

            <label>
              <input
                type="checkbox"
                onChange={() => handleCategoryChange("IT & Software")}
              />
              IT & Software
            </label>
          </div>

        </div>

        {/* ===== JOB LIST ===== */}
        <div className="jobs-container">

          {loading ? (
            <p className="no-jobs">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="no-jobs">No matching jobs found 🚀</p>
          ) : (

            <div className="jobs-grid">

              {filteredJobs.map((job) => (

                <div key={job._id} className="job-card fade-in">

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

                  <p className={`description ${expandedJob === job._id ? "expanded" : ""}`}>
                    {job.description}
                  </p>

                  <span
                    className="read-more"
                    onClick={() => toggleDescription(job._id)}
                  >
                    {expandedJob === job._id ? "Show less" : "Read more"}
                  </span>

                  <div className="tags">
                    <span>{job.skills || "Skills not specified"}</span>
                  </div>

                  <div className="job-actions">

                    <button
                      className="apply-btn"
                      onClick={() => navigate(`/apply/${job._id}`)}
                    >
                      Apply Now
                    </button>

                    <button
                      className={`save-job-btn ${savedJobs.includes(job._id) ? "saved" : ""}`}
                      onClick={() => handleSave(job._id)}
                    >
                      {savedJobs.includes(job._id) ? "Saved" : "Save"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
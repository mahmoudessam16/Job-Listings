import { useEffect, useState } from "react";
import "./sass/main.scss";

function App() {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setAllJobs(data);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (filters.length === 0) {
      setJobs(allJobs);
    } else {
      const filtered = allJobs.filter((job) =>
        filters.every((filter) =>
          [job.role, job.level, ...job.languages, ...job.tools].includes(filter)
        )
      );
      setJobs(filtered);
    }
  }, [filters, allJobs]);

  const addFilter = (filter) => {
    setFilters((prev) => (prev.includes(filter) ? prev : [...prev, filter]));
  };

  const removeFilter = (filter) => {
    setFilters((prev) => prev.filter((f) => f !== filter));
  };

  const resetFilters = () => {
    setFilters([]);
  };

  return (
    <main>
      <div className="bg-header" />

      {filters.length > 0 && (
        <section className="filters">
          <div className="filter-tags">
            {filters.map((filter) => (
              <div key={filter} className="filter-tag">
                <span className="filter-name">{filter}</span>
                <button
                  className="remove-filter"
                  onClick={() => removeFilter(filter)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button className="clear-filters" onClick={resetFilters}>
            Clear
          </button>
        </section>
      )}

      <section
        className={`job-listing ${filters.length > 0 ? "p-mobile" : ""}`}
      >
        {jobs.map((job) => (
          <div key={job.id} className={`job ${job.featured ? "featured" : ""}`}>
            <div className="left">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="company-logo"
              />
              <div className="job-info">
                <div className="comp-details">
                  <span className="company">{job.company}</span>
                  {job.new && <span className="new-badge">NEW!</span>}
                  {job.featured && (
                    <span className="featured-badge">FEATURED</span>
                  )}
                </div>
                <h2 className="position">{job.position}</h2>
                <div className="job-meta">
                  <span>{job.postedAt}</span>
                  <span className="dot">•</span>
                  <span>{job.contract}</span>
                  <span className="dot">•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <div className="right">
              <span className="tag" onClick={() => addFilter(job.role)}>
                {job.role}
              </span>
              <span className="tag" onClick={() => addFilter(job.level)}>
                {job.level}
              </span>
              {job.languages.map((lang) => (
                <span
                  key={lang}
                  className="tag"
                  onClick={() => addFilter(lang)}
                >
                  {lang}
                </span>
              ))}
              {job.tools.map((tool) => (
                <span
                  key={tool}
                  className="tag"
                  onClick={() => addFilter(tool)}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;

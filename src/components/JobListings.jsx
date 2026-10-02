import { useMemo, useState } from 'react';
import { JOBS } from '../data/jobs';
import { formatCurrency } from '../utils/formatters';

export default function JobListings({ targetSalary }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const matchingJobs = useMemo(() => {
    if (!targetSalary || targetSalary <= 0) return [];
    const buffer = 0.15;
    const min = targetSalary * (1 - buffer);
    const max = targetSalary * (1 + buffer);
    return JOBS.filter((job) => job.salaryMedian >= min && job.salaryMedian <= max);
  }, [targetSalary]);

  const groupedJobs = useMemo(() => {
    const groups = {};
    matchingJobs.forEach((job) => {
      if (!groups[job.category]) groups[job.category] = [];
      groups[job.category].push(job);
    });
    return groups;
  }, [matchingJobs]);

  if (!targetSalary || targetSalary <= 0) return null;

  return (
    <section className="panel">
      <h3 className="kicker mb-1">Jobs in this salary range</h3>
      <p className="text-sm text-muted mb-5">
        Median salary within 15% of <span className="num">{formatCurrency(targetSalary)}</span>
      </p>

      {matchingJobs.length === 0 ? (
        <p className="py-4 text-muted text-sm italic">
          No matching jobs found for this salary range. Try adjusting the property price or salary.
        </p>
      ) : (
        <div className="border-t-2 border-ink">
          {Object.entries(groupedJobs).map(([category, jobs]) => {
            const open = expandedCategory === category;
            return (
              <div key={category} className="border-b border-rule">
                <button
                  onClick={() => setExpandedCategory(open ? null : category)}
                  aria-expanded={open}
                  className="w-full py-3 flex items-center justify-between text-left cursor-pointer hover:text-[var(--accent)]"
                >
                  <span className="display text-lg font-semibold">{category}</span>
                  <span className="num text-xs text-muted">{jobs.length} {jobs.length === 1 ? 'role' : 'roles'} {open ? '−' : '+'}</span>
                </button>
                {open && (
                  <ul className="pb-3">
                    {jobs.map((job) => (
                      <li key={job.title} className="flex items-center justify-between py-2 pl-4 border-l-4 border-[var(--accent)] mb-1 bg-paper/60">
                        <div>
                          <div className="text-sm font-medium">{job.title}</div>
                          <div className="text-xs text-muted">{job.educationRequired} · {job.growth} growth</div>
                        </div>
                        <div className="text-right pr-3">
                          <div className="num text-sm">{formatCurrency(job.salaryMedian)}</div>
                          <div className="num text-xs text-muted">{formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { useMemo, useState } from 'react';
import { JOBS, JOB_CATEGORIES } from '../data/jobs';
import { formatCurrency } from '../utils/formatters';

export default function JobListings({ targetSalary }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const matchingJobs = useMemo(() => {
    if (!targetSalary || targetSalary <= 0) return [];
    const buffer = 0.15;
    const min = targetSalary * (1 - buffer);
    const max = targetSalary * (1 + buffer);
    return JOBS.filter(
      (job) => job.salaryMedian >= min && job.salaryMedian <= max
    );
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
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">
        Jobs in This Salary Range
      </h3>
      <p className="text-xs text-white/30 mb-4">
        Showing jobs with median salary near {formatCurrency(targetSalary)} (±15%)
      </p>

      {matchingJobs.length === 0 ? (
        <div className="text-center py-4 text-white/30 text-sm">
          No matching jobs found for this salary range. Try adjusting the property price or salary.
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(groupedJobs).map(([category, jobs]) => (
            <div key={category} className="rounded-lg bg-white/5 border border-white/5">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition rounded-lg"
              >
                <span className="text-sm font-medium text-white/80">{category}</span>
                <span className="text-xs text-white/40">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</span>
              </button>
              {expandedCategory === category && (
                <div className="px-4 pb-3 space-y-2">
                  {jobs.map((job) => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between py-1.5 border-t border-white/5"
                    >
                      <div>
                        <div className="text-sm text-white/70">{job.title}</div>
                        <div className="text-xs text-white/30">
                          {job.educationRequired} · {job.growth} growth
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/70">
                          {formatCurrency(job.salaryMedian)}
                        </div>
                        <div className="text-xs text-white/30">
                          {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

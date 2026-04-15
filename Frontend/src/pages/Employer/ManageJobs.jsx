import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";

const ManageJobs = () => {
   const [jobs, setJobs] = useState([]);
   const [query, setQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [expandedJobId, setExpandedJobId] = useState(null);
   const [statusUpdatingId, setStatusUpdatingId] = useState(null);

   const getJobId = (job) => job.id || job._id;
   const isJobClosed = (job) =>
      typeof job.isClosed === "boolean"
         ? job.isClosed
         : String(job.status).toLowerCase() === "closed";
   const getJobStatusLabel = (job) => (isJobClosed(job) ? "Closed" : "Open");
   const formatDate = (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      });
   };

   useEffect(() => {
      const fetchJobs = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_JOBS_EMPLOYER,
            );
            if (response.status === 200) {
               const nextJobs = (response.data || []).sort((a, b) => {
                  const aDate = new Date(a.createdAt || 0).getTime();
                  const bDate = new Date(b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setJobs(nextJobs);
            }
         } catch (error) {
            setJobs([]);
         }
      };
      fetchJobs();
   }, []);

   const handleToggleStatus = async (job) => {
      const jobId = getJobId(job);
      if (!jobId) return;
      const nextClosed = !isJobClosed(job);
      const previousClosed = isJobClosed(job);
      setStatusUpdatingId(jobId);
      setJobs((prev) =>
         prev.map((item) =>
            getJobId(item) === jobId
               ? {
                    ...item,
                    status: nextClosed ? "Closed" : "Open",
                    isClosed: nextClosed,
                 }
               : item,
         ),
      );
      try {
         await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      } catch (error) {
         // Rollback on failure
         setJobs((prev) =>
            prev.map((item) =>
               getJobId(item) === jobId
                  ? {
                       ...item,
                       status: previousClosed ? "Closed" : "Open",
                       isClosed: previousClosed,
                    }
                  : item,
            ),
         );
      } finally {
         setStatusUpdatingId(null);
      }
   };

   const filteredJobs = useMemo(() => {
      return jobs.filter((job) => {
         const matchesQuery = job.title
            .toLowerCase()
            .includes(query.toLowerCase());
         const statusLabel = getJobStatusLabel(job).toLowerCase();
         const matchesStatus =
            statusFilter === "All" ||
            statusLabel === statusFilter.toLowerCase();
         return matchesQuery && matchesStatus;
      });
   }, [jobs, query, statusFilter]);

   return (
      <DashboardLayout activeMenu="manage-jobs">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Manage internships
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Review performance and keep listings updated.
                  </p>
               </div>
               <Link
                  to="/post-job"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
               >
                  Post new role
               </Link>
            </div>

            <SectionCard
               title="Active listings"
               subtitle="Track status, applicants, and quick actions."
               action={
                  <div className="flex flex-wrap items-center gap-3">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                        <input
                           type="text"
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           placeholder="Search roles"
                           className="rounded-full border border-outline bg-white pl-9 pr-4 py-2 text-sm text-paragraph outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                        />
                     </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                     >
                        <option>All</option>
                        <option>Open</option>
                        <option>Closed</option>
                     </select>
                  </div>
               }
            >
               {filteredJobs.length === 0 ? (
                  <EmptyState
                     title="No roles yet"
                     description="Start by posting your first internship role."
                     action={
                        <Link
                           to="/post-job"
                           className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                        >
                           Post internship
                        </Link>
                     }
                  />
               ) : (
                  <div className="space-y-3">
                     {filteredJobs.map((job) => {
                        const jobId = getJobId(job);
                        const isExpanded = expandedJobId === jobId;
                        const applicantCount =
                           job.applicants ||
                           job.applicationCount ||
                           job.applicationsCount ||
                           job.applicantList?.length ||
                           0;
                        return (
                           <div
                              key={jobId}
                              className="rounded-xl border border-outline bg-white/70 p-4"
                           >
                              <button
                                 type="button"
                                 onClick={() =>
                                    setExpandedJobId(
                                       isExpanded ? null : jobId,
                                    )
                                 }
                                 className="flex w-full flex-wrap items-center justify-between gap-4 text-left"
                              >
                                 <div>
                                    <p className="text-sm font-semibold text-primary">
                                       {job.title}
                                    </p>
                                    <p className="text-xs text-label">
                                       Posted {formatDate(job.createdAt)}
                                    </p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <span className="text-xs text-label">
                                       {applicantCount} applicants
                                    </span>
                                    <StatusBadge status={getJobStatusLabel(job)} />
                                    <Link
                                       to={`/post-job?jobId=${jobId}`}
                                       onClick={(e) => e.stopPropagation()}
                                       className="rounded-full border border-outline bg-white px-3 py-1 text-xs font-semibold text-primary hover:bg-neutral"
                                    >
                                       Edit job
                                    </Link>
                                 </div>
                              </button>
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                 <button
                                    type="button"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleToggleStatus(job);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral"
                                 >
                                    <span
                                       className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                                          isJobClosed(job)
                                             ? "bg-error/30"
                                             : "bg-success/30"
                                       }`}
                                    >
                                       <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                             isJobClosed(job)
                                                ? "translate-x-1"
                                                : "translate-x-5"
                                          }`}
                                       />
                                    </span>
                                    {statusUpdatingId === jobId
                                       ? "Updating..."
                                       : getJobStatusLabel(job)}
                                 </button>
                              </div>
                              {isExpanded && (
                                 <div className="mt-4 rounded-xl border border-outline bg-white/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-label">
                                       Applicants
                                    </p>
                                    {job.applicantList?.length ? (
                                       <div className="mt-3 space-y-3">
                                          {job.applicantList.map((applicant) => (
                                             <div
                                                key={applicant.id}
                                                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-outline bg-white/70 p-3"
                                             >
                                                <div>
                                                   <p className="text-sm font-semibold text-primary">
                                                      {applicant.name}
                                                   </p>
                                                   <p className="text-xs text-label">
                                                      {applicant.email}
                                                   </p>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-primary">
                                                   <a
                                                      href={applicant.profileUrl}
                                                      className="font-semibold"
                                                   >
                                                      View profile
                                                   </a>
                                                   <a
                                                      href={applicant.resumeUrl}
                                                      className="font-semibold"
                                                   >
                                                      View resume
                                                   </a>
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    ) : (
                                       <p className="mt-3 text-sm text-label">
                                          No applicants yet.
                                       </p>
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default ManageJobs;

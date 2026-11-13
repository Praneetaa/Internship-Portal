import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   Mail,
   FileText,
   ChevronDown,
   Users,
   CheckCircle2,
   XCircle,
   Clock,
   Loader,
   Search,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";

const STATUS_OPTIONS = ["Applied", "In Review", "Accepted", "Rejected"];

const STATUS_ICON = {
   Applied: <Clock className="h-3.5 w-3.5" />,
   "In Review": <Loader className="h-3.5 w-3.5" />,
   Accepted: <CheckCircle2 className="h-3.5 w-3.5" />,
   Rejected: <XCircle className="h-3.5 w-3.5" />,
};

const formatDate = (d) =>
   d
      ? new Date(d).toLocaleDateString("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric",
        })
      : "—";

const ApplicationViewer = () => {
   const [jobs, setJobs] = useState([]);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [applications, setApplications] = useState([]);
   const [loadingApps, setLoadingApps] = useState(false);
   const [query, setQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [updatingId, setUpdatingId] = useState(null);

   const getJobId = (j) => j._id || j.id;
   const getAppId = (a) => a._id || a.id;

   useEffect(() => {
      axiosInstance
         .get(API_PATHS.JOBS.GET_JOBS_EMPLOYER)
         .then((res) => {
            const sorted = (res.data || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setJobs(sorted);
            setSelectedJobId(sorted[0] ? getJobId(sorted[0]) : null);
         })
         .catch(() => setJobs([]));
   }, []);

   useEffect(() => {
      if (!selectedJobId) return;
      setLoadingApps(true);
      axiosInstance
         .get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(selectedJobId))
         .then((res) => {
            setApplications(
               (res.data || []).sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
               ),
            );
         })
         .catch(() => setApplications([]))
         .finally(() => setLoadingApps(false));
   }, [selectedJobId]);

   const handleStatusChange = async (appId, status) => {
      setUpdatingId(appId);
      setApplications((prev) =>
         prev.map((a) => (getAppId(a) === appId ? { ...a, status } : a)),
      );
      try {
         await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(appId), {
            status,
         });
      } catch {
         // keep optimistic
      } finally {
         setUpdatingId(null);
      }
   };

   const selectedJob = jobs.find((j) => getJobId(j) === selectedJobId);

   const filtered = applications.filter((a) => {
      const name = a.applicant?.name?.toLowerCase() || "";
      const email = a.applicant?.email?.toLowerCase() || "";
      const matchQ =
         !query ||
         name.includes(query.toLowerCase()) ||
         email.includes(query.toLowerCase());
      const matchS = statusFilter === "All" || a.status === statusFilter;
      return matchQ && matchS;
   });

   const counts = STATUS_OPTIONS.reduce((acc, s) => {
      acc[s] = applications.filter((a) => a.status === s).length;
      return acc;
   }, {});

   return (
      <DashboardLayout activeMenu="applications">
         <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-primary">
                     Applications
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Review candidates and move them through your pipeline.
                  </p>
               </div>
               <Link
                  to="/manage-jobs"
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral transition"
               >
                  ← Manage roles
               </Link>
            </div>

            {/* Role selector */}
            <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
               <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-label">
                  Viewing applications for
               </p>
               <div className="relative">
                  <select
                     value={selectedJobId || ""}
                     onChange={(e) => {
                        setSelectedJobId(e.target.value);
                        setQuery("");
                        setStatusFilter("All");
                     }}
                     className="w-full appearance-none rounded-xl border border-outline bg-white py-3 pl-4 pr-10 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  >
                     {jobs.length === 0 && (
                        <option value="">No internships found</option>
                     )}
                     {jobs.map((job) => (
                        <option key={getJobId(job)} value={getJobId(job)}>
                           {job.title}
                        </option>
                     ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
               </div>

               {/* Status summary pills */}
               {applications.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                     {[
                        ["All", applications.length],
                        ...STATUS_OPTIONS.map((s) => [s, counts[s]]),
                     ].map(([label, count]) => (
                        <button
                           key={label}
                           type="button"
                           onClick={() => setStatusFilter(label)}
                           className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${statusFilter === label ? "border-primary bg-primary/10 text-primary" : "border-outline bg-white text-label hover:border-primary/40"}`}
                        >
                           {label !== "All" && STATUS_ICON[label]}
                           {label} <span className="opacity-70">({count})</span>
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* Search bar */}
            {applications.length > 0 && (
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                  <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Search applicants by name or email…"
                     className="w-full rounded-xl border border-outline bg-white/90 py-3 pl-11 pr-4 text-sm text-paragraph outline-none shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
               </div>
            )}

            {/* Applications list */}
            <div className="rounded-2xl border border-outline bg-white/90 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b border-outline px-6 py-4">
                  <div>
                     <h2 className="text-base font-semibold text-primary">
                        {selectedJob?.title || "Applicants"}
                     </h2>
                     <p className="text-xs text-label mt-0.5">
                        {filtered.length}{" "}
                        {statusFilter !== "All"
                           ? statusFilter.toLowerCase()
                           : ""}{" "}
                        applicant{filtered.length !== 1 ? "s" : ""}
                     </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                     <Users className="h-4 w-4 text-primary" />
                  </div>
               </div>

               {loadingApps ? (
                  <div className="py-16 text-center text-sm text-label">
                     Loading applicants…
                  </div>
               ) : filtered.length === 0 ? (
                  <div className="p-8">
                     <EmptyState
                        title={
                           applications.length === 0
                              ? "No applicants yet"
                              : "No matches found"
                        }
                        description={
                           applications.length === 0
                              ? "Candidates who apply will appear here."
                              : "Try adjusting the filter or search term."
                        }
                     />
                  </div>
               ) : (
                  <div className="divide-y divide-outline">
                     {filtered.map((app) => {
                        const appId = getAppId(app);
                        const applicantId = app.applicant?._id || appId;
                        const isUpdating = updatingId === appId;

                        return (
                           <div
                              key={appId}
                              className="p-5 transition-colors hover:bg-neutral/30"
                           >
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                 {/* Applicant info */}
                                 <div className="flex items-start gap-3 min-w-0">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-sm font-bold text-primary">
                                       {(app.applicant?.name ||
                                          "?")[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-sm font-semibold text-primary">
                                          {app.applicant?.name || "—"}
                                       </p>
                                       <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-label">
                                          <span className="flex items-center gap-1">
                                             <Mail className="h-3 w-3" />{" "}
                                             {app.applicant?.email || "—"}
                                          </span>
                                          <span>
                                             Applied {formatDate(app.createdAt)}
                                          </span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Status badge */}
                                 <StatusBadge status={app.status} />
                              </div>

                              {/* Actions row */}
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                 {/* Status changer */}
                                 <div className="relative">
                                    <select
                                       value={app.status}
                                       onChange={(e) =>
                                          handleStatusChange(
                                             appId,
                                             e.target.value,
                                          )
                                       }
                                       disabled={isUpdating}
                                       className="appearance-none rounded-full border border-outline bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
                                    >
                                       {STATUS_OPTIONS.map((s) => (
                                          <option key={s} value={s}>
                                             {s}
                                          </option>
                                       ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-icon" />
                                 </div>

                                 {/* Resume link */}
                                 {app.applicant?.resume ? (
                                    <a
                                       href={app.applicant.resume}
                                       target="_blank"
                                       rel="noreferrer"
                                       className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                                    >
                                       <FileText className="h-3.5 w-3.5" />{" "}
                                       Resume
                                    </a>
                                 ) : (
                                    <span className="rounded-full border border-outline/50 bg-white/50 px-3 py-1.5 text-xs text-label">
                                       No resume
                                    </span>
                                 )}

                                 {/* Profile link */}
                                 <Link
                                    to={`/applicants/profile/${applicantId}`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                                 >
                                    View profile
                                 </Link>

                                 {isUpdating && (
                                    <span className="flex items-center gap-1.5 text-xs text-label">
                                       <Loader className="h-3 w-3 animate-spin" />{" "}
                                       Updating…
                                    </span>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>
         </div>
      </DashboardLayout>
   );
};

export default ApplicationViewer;

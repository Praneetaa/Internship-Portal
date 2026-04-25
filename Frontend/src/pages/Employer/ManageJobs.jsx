import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
   Search,
   Plus,
   Users,
   Calendar,
   ToggleLeft,
   ToggleRight,
   Pencil,
   ChevronDown,
   ChevronUp,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";

const formatDate = (d) =>
   d
      ? new Date(d).toLocaleDateString("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric",
        })
      : "—";

const ManageJobs = () => {
   const [jobs, setJobs] = useState([]);
   const [query, setQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [expandedId, setExpandedId] = useState(null);
   const [togglingId, setTogglingId] = useState(null);

   const getId = (j) => j._id || j.id;
   const isClosed = (j) =>
      typeof j.isClosed === "boolean"
         ? j.isClosed
         : j.status?.toLowerCase() === "closed";

   useEffect(() => {
      axiosInstance
         .get(API_PATHS.JOBS.GET_JOBS_EMPLOYER)
         .then((res) =>
            setJobs(
               (res.data || []).sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
               ),
            ),
         )
         .catch(() => setJobs([]));
   }, []);

   const handleToggle = async (job) => {
      const id = getId(job);
      const next = !isClosed(job);
      setTogglingId(id);
      setJobs((prev) =>
         prev.map((j) => (getId(j) === id ? { ...j, isClosed: next } : j)),
      );
      try {
         await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(id));
      } catch {
         setJobs((prev) =>
            prev.map((j) => (getId(j) === id ? { ...j, isClosed: !next } : j)),
         );
      } finally {
         setTogglingId(null);
      }
   };

   const filtered = useMemo(
      () =>
         jobs.filter((j) => {
            const matchQ = j.title.toLowerCase().includes(query.toLowerCase());
            const matchS =
               statusFilter === "All" ||
               (isClosed(j) ? "Closed" : "Open") === statusFilter;
            return matchQ && matchS;
         }),
      [jobs, query, statusFilter],
   );

   const openCount = jobs.filter((j) => !isClosed(j)).length;
   const closedCount = jobs.filter((j) => isClosed(j)).length;

   return (
      <DashboardLayout activeMenu="manage-jobs">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-text">
                     Manage internships
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Review listings, track applicants, and control status.
                  </p>
               </div>
               <Link
                  to="/post-job"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary transition"
               >
                  <Plus className="h-4 w-4" /> Post new role
               </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
               {[
                  {
                     label: "Total listings",
                     value: jobs.length,
                     color: "text-primary",
                  },
                  { label: "Open", value: openCount, color: "text-success" },
                  { label: "Closed", value: closedCount, color: "text-error" },
               ].map((s) => (
                  <div
                     key={s.label}
                     className="rounded-2xl border border-outline bg-white/90 p-4 shadow-sm"
                  >
                     <p className={`text-2xl font-bold ${s.color}`}>
                        {s.value}
                     </p>
                     <p className="text-xs text-label mt-0.5">{s.label}</p>
                  </div>
               ))}
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-outline bg-white/90 p-4 shadow-sm">
               <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                  <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Search internships…"
                     className="w-full rounded-xl border border-outline bg-white pl-9 pr-4 py-2 text-sm text-paragraph outline-none transition-all hover:border-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
               </div>
               <div className="flex gap-1 rounded-xl border border-outline bg-white p-1">
                  {["All", "Open", "Closed"].map((s) => (
                     <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${statusFilter === s ? "bg-primary text-white" : "text-label hover:text-primary"}`}
                     >
                        {s}
                     </button>
                  ))}
               </div>
            </div>

            {/* Job list */}
            {filtered.length === 0 ? (
               <div className="rounded-2xl border border-outline bg-white/90 p-8">
                  <EmptyState
                     title="No internships found"
                     description="Post your first role or adjust your filters."
                  />
               </div>
            ) : (
               <div className="space-y-3">
                  {filtered.map((job) => {
                     const id = getId(job);
                     const isOpen = expandedId === id;
                     const closed = isClosed(job);
                     const applicants =
                        job.applicationCount || job.applicants || 0;

                     return (
                        <div
                           key={id}
                           className={`overflow-hidden rounded-2xl border bg-white/90 shadow-sm transition ${closed ? "border-outline/60 opacity-80" : "border-outline"}`}
                        >
                           <div className="p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                 <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-sm font-bold text-primary">
                                       {job.title?.[0]?.toUpperCase() || "J"}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-sm font-semibold text-primary truncate">
                                          {job.title}
                                       </p>
                                       <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-label">
                                          <span className="flex items-center gap-1">
                                             <Calendar className="h-3 w-3" />
                                             Posted {formatDate(job.createdAt)}
                                          </span>
                                          <span className="flex items-center gap-1">
                                             <Users className="h-3 w-3" />
                                             {applicants} applicants
                                          </span>
                                          {job.deadline && (
                                             <span>
                                                Deadline:{" "}
                                                {formatDate(job.deadline)}
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 flex-shrink-0">
                                    <StatusBadge
                                       status={closed ? "Closed" : "Open"}
                                    />
                                    <Link
                                       to={`/post-job?jobId=${id}`}
                                       className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                                    >
                                       <Pencil className="h-3 w-3" /> Edit
                                    </Link>
                                 </div>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                 {job.workMode && (
                                    <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                       {job.workMode}
                                    </span>
                                 )}
                                 {job.category && (
                                    <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                       {job.category}
                                    </span>
                                 )}
                                 {job.stipend && (
                                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                                       ฿{job.stipend}/mo
                                    </span>
                                 )}

                                 <div className="ml-auto flex items-center gap-2">
                                    <button
                                       type="button"
                                       onClick={() => handleToggle(job)}
                                       disabled={togglingId === id}
                                       className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${closed ? "border-success/30 bg-success/5 text-success hover:bg-success/10" : "border-error/30 bg-error/5 text-error hover:bg-error/10"}`}
                                    >
                                       {closed ? (
                                          <ToggleLeft className="h-3.5 w-3.5" />
                                       ) : (
                                          <ToggleRight className="h-3.5 w-3.5" />
                                       )}
                                       {togglingId === id
                                          ? "Updating…"
                                          : closed
                                            ? "Reopen"
                                            : "Close"}
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() =>
                                          setExpandedId(isOpen ? null : id)
                                       }
                                       className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                                    >
                                       {isOpen ? (
                                          <ChevronUp className="h-3.5 w-3.5" />
                                       ) : (
                                          <ChevronDown className="h-3.5 w-3.5" />
                                       )}
                                       {isOpen ? "Hide" : "View applicants"}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Expanded applicants */}
                           {isOpen && (
                              <div className="border-t border-outline bg-neutral/30 px-5 py-4">
                                 <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-label">
                                    Applicants ({applicants})
                                 </p>
                                 {job.applicantList?.length ? (
                                    <div className="space-y-2">
                                       {job.applicantList.map((a) => (
                                          <div
                                             key={a.id}
                                             className="flex items-center justify-between rounded-xl border border-outline bg-white px-4 py-3"
                                          >
                                             <div>
                                                <p className="text-sm font-semibold text-primary">
                                                   {a.name}
                                                </p>
                                                <p className="text-xs text-label">
                                                   {a.email}
                                                </p>
                                             </div>
                                             <div className="flex gap-3 text-xs font-semibold text-primary">
                                                {a.profileUrl && (
                                                   <a
                                                      href={a.profileUrl}
                                                      className="hover:text-secondary transition"
                                                   >
                                                      Profile
                                                   </a>
                                                )}
                                                {a.resumeUrl && (
                                                   <a
                                                      href={a.resumeUrl}
                                                      className="hover:text-secondary transition"
                                                   >
                                                      Resume
                                                   </a>
                                                )}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 ) : (
                                    <p className="text-sm text-label">
                                       No applicants yet for this role.
                                    </p>
                                 )}
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </DashboardLayout>
   );
};

export default ManageJobs;

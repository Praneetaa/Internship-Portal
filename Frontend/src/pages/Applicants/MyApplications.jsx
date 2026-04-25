import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   FileText,
   Building2,
   MapPin,
   Calendar,
   ChevronRight,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const STATUS_PROGRESS = {
   Applied: 1,
   "In Review": 2,
   Accepted: 4,
   Rejected: 4,
};
const STEPS = ["Applied", "In Review", "Interview", "Decision"];

const formatDate = (d) =>
   d
      ? new Date(d).toLocaleDateString("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric",
        })
      : "—";

const MyApplications = () => {
   const [applications, setApplications] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [expanded, setExpanded] = useState(null);

   useEffect(() => {
      const fetch = async () => {
         setIsLoading(true);
         try {
            const res = await axiosInstance.get(
               API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS,
            );
            setApplications(
               (res.data || []).sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
               ),
            );
         } catch {
            setApplications([]);
         } finally {
            setIsLoading(false);
         }
      };
      fetch();
   }, []);

   const stats = {
      total: applications.length,
      inReview: applications.filter((a) => a.status === "In Review").length,
      accepted: applications.filter((a) => a.status === "Accepted").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
   };

   return (
      <DashboardLayout
         activeMenu="my-applications"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-bold text-text">
                  My applications
               </h1>
               <p className="mt-1 text-sm text-label">
                  Track every internship you've applied to.
               </p>
            </div>

            {/* Stats row */}
            {applications.length > 0 && (
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                     {
                        label: "Total applied",
                        value: stats.total,
                        color: "text-primary",
                     },
                     {
                        label: "In review",
                        value: stats.inReview,
                        color: "text-secondary",
                     },
                     {
                        label: "Accepted",
                        value: stats.accepted,
                        color: "text-success",
                     },
                     {
                        label: "Not selected",
                        value: stats.rejected,
                        color: "text-error",
                     },
                  ].map((s) => (
                     <div
                        key={s.label}
                        className="rounded-2xl border border-outline bg-white/90 p-4"
                     >
                        <p className={`text-2xl font-bold ${s.color}`}>
                           {s.value}
                        </p>
                        <p className="mt-0.5 text-xs text-label">{s.label}</p>
                     </div>
                  ))}
               </div>
            )}

            {/* Application list */}
            <div className="rounded-2xl border border-outline bg-white/90 shadow-sm overflow-hidden">
               <div className="border-b border-outline px-6 py-4">
                  <h2 className="text-base font-semibold text-primary">
                     Application tracker
                  </h2>
                  <p className="text-xs text-label mt-0.5">
                     {applications.length} application
                     {applications.length !== 1 ? "s" : ""}
                  </p>
               </div>

               {isLoading ? (
                  <div className="py-16 text-center text-sm text-label">
                     Loading applications…
                  </div>
               ) : applications.length === 0 ? (
                  <div className="p-6">
                     <EmptyState
                        title="No applications yet"
                        description="Apply to internships and track your progress here."
                     />
                  </div>
               ) : (
                  <div className="divide-y divide-outline">
                     {applications.map((app) => {
                        const id = app._id || app.id;
                        const isOpen = expanded === id;
                        const step = STATUS_PROGRESS[app.status] || 1;
                        const isRejected = app.status === "Rejected";

                        return (
                           <div
                              key={id}
                              className="transition-colors hover:bg-neutral/40"
                           >
                              <button
                                 type="button"
                                 onClick={() => setExpanded(isOpen ? null : id)}
                                 className="flex w-full items-center gap-4 px-6 py-4 text-left"
                              >
                                 {/* Company initial */}
                                 <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-sm font-bold text-primary">
                                    {(app.job?.company?.companyName ||
                                       "C")[0].toUpperCase()}
                                 </div>

                                 <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-primary">
                                       {app.job?.title || "Internship"}
                                    </p>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-label">
                                       {app.job?.company?.companyName && (
                                          <span className="flex items-center gap-1">
                                             <Building2 className="h-3 w-3" />
                                             {app.job.company.companyName}
                                          </span>
                                       )}
                                       <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          Applied {formatDate(app.createdAt)}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-3">
                                    <StatusBadge status={app.status} />
                                    <ChevronRight
                                       className={`h-4 w-4 text-icon transition-transform ${isOpen ? "rotate-90" : ""}`}
                                    />
                                 </div>
                              </button>

                              {/* Expanded: progress timeline */}
                              {isOpen && (
                                 <div className="border-t border-outline bg-neutral/40 px-6 py-5">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-label">
                                       Application progress
                                    </p>
                                    <div className="flex items-center gap-0">
                                       {STEPS.map((s, i) => {
                                          const done = isRejected
                                             ? i < step - 1
                                             : i < step;
                                          const current = isRejected
                                             ? i === step - 1 &&
                                               s === "Decision"
                                             : i === step - 1;
                                          return (
                                             <div
                                                key={s}
                                                className="flex flex-1 items-center"
                                             >
                                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                                   <div
                                                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition ${done ? "border-primary bg-primary text-white" : current ? (isRejected ? "border-error bg-error text-white" : "border-primary bg-primary/10 text-primary") : "border-outline bg-white text-label"}`}
                                                   >
                                                      {done ? "✓" : i + 1}
                                                   </div>
                                                   <span
                                                      className={`text-xs whitespace-nowrap ${current ? "font-semibold text-primary" : "text-label"}`}
                                                   >
                                                      {isRejected &&
                                                      s === "Decision"
                                                         ? "Rejected"
                                                         : s}
                                                   </span>
                                                </div>
                                                {i < STEPS.length - 1 && (
                                                   <div
                                                      className={`h-0.5 flex-1 mx-1 ${done ? "bg-primary" : "bg-outline"}`}
                                                   />
                                                )}
                                             </div>
                                          );
                                       })}
                                    </div>
                                    {app.job?._id && (
                                       <Link
                                          to={`/jobs/${app.job._id}`}
                                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary transition"
                                       >
                                          <FileText className="h-4 w-4" /> View
                                          internship listing →
                                       </Link>
                                    )}
                                 </div>
                              )}
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

export default MyApplications;

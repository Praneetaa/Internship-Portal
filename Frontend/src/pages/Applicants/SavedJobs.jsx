import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   Bookmark,
   MapPin,
   Building2,
   Briefcase,
   ExternalLink,
   Trash2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmptyState from "../../components/cards/EmptyState";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const SavedJobs = () => {
   const [savedJobs, setSavedJobs] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [removingId, setRemovingId] = useState(null);

   useEffect(() => {
      const fetchSaved = async () => {
         setIsLoading(true);
         try {
            const res = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
            const normalized = (res.data || [])
               .map((item) =>
                  item?.job
                     ? {
                          ...item.job,
                          savedAt: item.createdAt,
                          savedDocId: item._id,
                       }
                     : null,
               )
               .filter(Boolean)
               .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
            setSavedJobs(normalized);
         } catch {
            setSavedJobs([]);
         } finally {
            setIsLoading(false);
         }
      };
      fetchSaved();
   }, []);

   const handleUnsave = async (jobId) => {
      setRemovingId(jobId);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      try {
         await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      } catch {
         /* silent — already removed from UI */
      } finally {
         setRemovingId(null);
      }
   };

   return (
      <DashboardLayout
         activeMenu="saved-jobs"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-text">
                     Saved internships
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Roles you've bookmarked to apply for later.
                  </p>
               </div>
               {savedJobs.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-sm font-semibold text-primary">
                     <Bookmark className="h-4 w-4" /> {savedJobs.length} saved
                  </span>
               )}
            </div>

            {isLoading ? (
               <div className="py-20 text-center text-sm text-label">
                  Loading saved roles…
               </div>
            ) : savedJobs.length === 0 ? (
               <div className="rounded-2xl border border-outline bg-white/90 p-8">
                  <EmptyState
                     title="No saved roles yet"
                     description="Bookmark internships while browsing and find them here."
                  />
               </div>
            ) : (
               <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {savedJobs.map((job) => (
                     <div
                        key={job._id}
                        className="group relative flex flex-col rounded-2xl border border-outline bg-white/90 p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                     >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                           <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-base font-bold text-primary">
                              {(job.company?.companyName ||
                                 "C")[0].toUpperCase()}
                           </div>
                           <button
                              type="button"
                              onClick={() => handleUnsave(job._id)}
                              disabled={removingId === job._id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline bg-white text-label opacity-0 transition hover:border-error/40 hover:bg-error/5 hover:text-error group-hover:opacity-100 disabled:opacity-40"
                              title="Remove from saved"
                           >
                              <Trash2 className="h-3.5 w-3.5" />
                           </button>
                        </div>

                        {/* Info */}
                        <div className="mt-3 flex-1">
                           <p className="text-sm font-semibold text-primary leading-snug">
                              {job.title}
                           </p>
                           <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-label">
                              {job.company?.companyName && (
                                 <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {job.company.companyName}
                                 </span>
                              )}
                              {job.location && (
                                 <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                 </span>
                              )}
                           </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-3 flex flex-wrap gap-2">
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
                        </div>

                        {/* CTA */}
                        <div className="mt-4 border-t border-outline pt-4">
                           <Link
                              to={`/jobs/${job._id}`}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
                           >
                              <ExternalLink className="h-4 w-4" /> View & apply
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </DashboardLayout>
   );
};

export default SavedJobs;

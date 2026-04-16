import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import EmptyState from "../../components/cards/EmptyState";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const SavedJobs = () => {
   const [savedJobs, setSavedJobs] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchSaved = async () => {
         setIsLoading(true);
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_SAVED_JOBS,
            );
            if (response.status === 200) {
               const normalized = (response.data || [])
                  .map((item) => {
                     const job = item?.job;
                     if (!job) return null;
                     return {
                        ...job,
                        isPriority: item?.isPriority || false,
                        savedId: item?._id,
                        savedAt: item?.createdAt,
                     };
                  })
                  .filter(Boolean);
               const sorted = normalized.sort((a, b) => {
                  const aDate = new Date(a.savedAt || a.createdAt || 0).getTime();
                  const bDate = new Date(b.savedAt || b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setSavedJobs(sorted);
            }
         } catch (error) {
            setSavedJobs([]);
         } finally {
            setIsLoading(false);
         }
      };
      fetchSaved();
   }, []);

   const togglePriority = (jobId) => {
      setSavedJobs((prev) =>
         prev.map((job) =>
            job._id === jobId ? { ...job, isPriority: !job.isPriority } : job,
         ),
      );
   };

   return (
      <DashboardLayout
         activeMenu="saved-jobs"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-primary">
                  Saved internships
               </h1>
               <p className="mt-1 text-sm text-label">
                  Roles you want to apply for later.
               </p>
            </div>

            <SectionCard title="Saved roles">
               {savedJobs.length === 0 ? (
                  <EmptyState
                     title="No saved roles"
                     description="Save internships to revisit them quickly."
                  />
               ) : (
                  <div className="space-y-4">
                     {savedJobs.map((job) => (
                        <div
                           key={job._id}
                           className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline bg-white/70 p-4"
                        >
                           <div>
                              <p className="text-sm font-semibold text-primary">
                                 {job.title}
                              </p>
                              <p className="text-xs text-label">
                                 {job.company?.companyName || "Company"} · {job.location}
                              </p>
                           </div>
                           <div className="flex items-center gap-3">
                              <button
                                 type="button"
                                 onClick={() => togglePriority(job._id)}
                                 className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                    job.isPriority
                                       ? "border-secondary bg-secondary/10 text-secondary"
                                       : "border-outline bg-white text-primary hover:bg-neutral"
                                 }`}
                              >
                                 <Star className="h-3.5 w-3.5" />
                                 {job.isPriority ? "Important" : "Mark"}
                              </button>
                              <Link
                                 to={`/jobs/${job._id}`}
                                 className="text-sm font-semibold text-primary"
                              >
                                 View details
                              </Link>
                           </div>
                           <div className="w-full text-xs text-label">
                              {job.workMode}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
               {isLoading && (
                  <p className="mt-3 text-sm text-label">
                     Loading saved jobs...
                  </p>
               )}
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default SavedJobs;


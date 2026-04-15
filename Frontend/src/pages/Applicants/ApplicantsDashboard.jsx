import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
   Bookmark,
   BookmarkCheck,
   Filter,
   LayoutGrid,
   List,
   Search,
   Star,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";
import { CATEGORIES, NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const workModeOptions = ["Remote", "Hybrid", "On-site"];

const ApplicantsDashboard = () => {
   const { user, updateUser } = useAuth();
   const [jobs, setJobs] = useState([]);
   const [query, setQuery] = useState("");
   const [viewMode, setViewMode] = useState("grid");
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [selectedWorkModes, setSelectedWorkModes] = useState([]);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [isSaving, setIsSaving] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMessage, setResumeMessage] = useState("");
   const [categoryOpen, setCategoryOpen] = useState(false);
   const [workModeOpen, setWorkModeOpen] = useState(false);

   const getJobId = (job) => job._id || job.id;

   useEffect(() => {
      if (!user) return;
      const fetchJobs = async () => {
         try {
            // userId param is required — backend uses it to attach isSaved + applicationStatus
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_ALL_JOBS,
               {
                  params: { userId: user._id || user.id },
               },
            );
            if (response.status === 200) {
               const nextJobs = (response.data || []).sort((a, b) => {
                  const aDate = new Date(a.createdAt || 0).getTime();
                  const bDate = new Date(b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setJobs(nextJobs);
               setSelectedJobId(nextJobs[0] ? getJobId(nextJobs[0]) : null);
            }
         } catch {
            setJobs([]);
            setSelectedJobId(null);
         }
      };
      fetchJobs();
   }, [user]);

   const filteredJobs = useMemo(() => {
      const filtered = jobs.filter((job) => {
         const matchesQuery = job.title
            .toLowerCase()
            .includes(query.toLowerCase());
         const matchesMode =
            selectedWorkModes.length === 0 ||
            selectedWorkModes.includes(job.workMode);
         const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(job.category);
         return matchesQuery && matchesMode && matchesCategory;
      });
      return filtered.sort((a, b) => {
         const aDate = new Date(a.createdAt || 0).getTime();
         const bDate = new Date(b.createdAt || 0).getTime();
         return bDate - aDate;
      });
   }, [jobs, query, selectedWorkModes, selectedCategories]);

   useEffect(() => {
      if (!selectedJobId && filteredJobs.length) {
         setSelectedJobId(getJobId(filteredJobs[0]));
      }
   }, [filteredJobs, selectedJobId]);

   const selectedJob = filteredJobs.find(
      (job) => getJobId(job) === selectedJobId,
   );

   const toggleCategory = (value) =>
      setSelectedCategories((prev) =>
         prev.includes(value)
            ? prev.filter((i) => i !== value)
            : [...prev, value],
      );

   const toggleWorkMode = (value) =>
      setSelectedWorkModes((prev) =>
         prev.includes(value)
            ? prev.filter((i) => i !== value)
            : [...prev, value],
      );

   const handleSave = async (job) => {
      const jobId = getJobId(job);
      setIsSaving(true);
      setJobs((prev) =>
         prev.map((item) =>
            getJobId(item) === jobId
               ? { ...item, isSaved: !item.isSaved }
               : item,
         ),
      );
      try {
         if (job.isSaved) {
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
         } else {
            await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
         }
      } catch {
         // Revert on failure
         setJobs((prev) =>
            prev.map((item) =>
               getJobId(item) === jobId
                  ? { ...item, isSaved: !item.isSaved }
                  : item,
            ),
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleApply = async (job) => {
      const jobId = getJobId(job);
      if (!user?.resume) {
         setResumeMessage("Please upload a resume before applying.");
         return;
      }
      setIsApplying(true);
      try {
         await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
         setJobs((prev) =>
            prev.map((item) =>
               getJobId(item) === jobId
                  ? { ...item, applicationStatus: "Applied" }
                  : item,
            ),
         );
      } catch (err) {
         // 400 = already applied — still mark as applied in UI
         if (err?.response?.status === 400) {
            setJobs((prev) =>
               prev.map((item) =>
                  getJobId(item) === jobId
                     ? { ...item, applicationStatus: "Applied" }
                     : item,
               ),
            );
         }
         // Any other error: don't update UI
      } finally {
         setIsApplying(false);
      }
   };

   const handlePriority = async (job) => {
      const jobId = getJobId(job);
      // Optimistic update
      setJobs((prev) =>
         prev.map((item) =>
            getJobId(item) === jobId
               ? { ...item, isPriority: !item.isPriority }
               : item,
         ),
      );
      try {
         await axiosInstance.patch(API_PATHS.JOBS.TOGGLE_PRIORITY(jobId));
      } catch {
         // Revert
         setJobs((prev) =>
            prev.map((item) =>
               getJobId(item) === jobId
                  ? { ...item, isPriority: !item.isPriority }
                  : item,
            ),
         );
      }
   };

   const handleResumeUpload = async () => {
      if (!resumeFile) {
         setResumeMessage("Please select a PDF resume to upload.");
         return;
      }
      if (resumeFile.type !== "application/pdf") {
         setResumeMessage("Resume must be a PDF file.");
         return;
      }
      setResumeUploading(true);
      setResumeMessage("");
      try {
         const uploadResponse = await uploadImage(resumeFile);
         const resumeUrl = uploadResponse?.imageUrl;
         if (!resumeUrl) {
            setResumeMessage("Upload failed. Please try again.");
            return;
         }
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            resume: resumeUrl,
         });
         updateUser({ resume: resumeUrl });
         setResumeMessage("Resume uploaded successfully.");
      } catch {
         setResumeMessage("Unable to upload resume right now.");
      } finally {
         setResumeUploading(false);
      }
   };

   return (
      <DashboardLayout
         activeMenu="find-jobs"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-primary">
                  Find internships
               </h1>
               <p className="mt-1 text-sm text-label">
                  Browse open roles and apply directly.
               </p>
            </div>

            <SectionCard title="Search & filter">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                     <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search roles"
                        className="w-full rounded-full border border-outline bg-white pl-9 pr-4 py-2 text-sm text-paragraph outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                     />
                  </div>

                  <div className="flex items-center gap-2">
                     <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-icon hover:bg-neutral"}`}
                     >
                        <LayoutGrid className="h-4 w-4" />
                     </button>
                     <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`rounded-lg p-2 ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-icon hover:bg-neutral"}`}
                     >
                        <List className="h-4 w-4" />
                     </button>
                  </div>

                  <div className="relative">
                     <button
                        type="button"
                        onClick={() => setWorkModeOpen((p) => !p)}
                        className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
                     >
                        <Filter className="h-4 w-4 text-icon" />
                        Work mode
                        {selectedWorkModes.length > 0 && (
                           <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              {selectedWorkModes.length}
                           </span>
                        )}
                     </button>
                     {workModeOpen && (
                        <div className="absolute z-30 mt-2 w-44 rounded-xl border border-outline bg-white p-3 shadow-sm">
                           {workModeOptions.map((mode) => (
                              <label
                                 key={mode}
                                 className="flex items-center gap-2 py-1 text-sm text-label cursor-pointer"
                              >
                                 <input
                                    type="checkbox"
                                    checked={selectedWorkModes.includes(mode)}
                                    onChange={() => toggleWorkMode(mode)}
                                 />
                                 {mode}
                              </label>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="relative">
                     <button
                        type="button"
                        onClick={() => setCategoryOpen((p) => !p)}
                        className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
                     >
                        <Filter className="h-4 w-4 text-icon" />
                        Categories
                        {selectedCategories.length > 0 && (
                           <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              {selectedCategories.length}
                           </span>
                        )}
                     </button>
                     {categoryOpen && (
                        <div className="absolute z-30 mt-2 w-56 rounded-xl border border-outline bg-white p-3 shadow-sm max-h-60 overflow-auto">
                           {CATEGORIES.map((category) => (
                              <label
                                 key={category.value}
                                 className="flex items-center gap-2 py-1 text-sm text-label cursor-pointer"
                              >
                                 <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                       category.value,
                                    )}
                                    onChange={() =>
                                       toggleCategory(category.value)
                                    }
                                 />
                                 {category.label}
                              </label>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
               <div>
                  {filteredJobs.length === 0 ? (
                     <EmptyState
                        title="No matches yet"
                        description="Try a different keyword or remove filters."
                     />
                  ) : (
                     <div
                        className={`grid gap-4 ${viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"}`}
                     >
                        {filteredJobs.map((job) => {
                           const jobId = getJobId(job);
                           const isSelected = jobId === selectedJobId;
                           return (
                              <button
                                 key={jobId}
                                 type="button"
                                 onClick={() => setSelectedJobId(jobId)}
                                 className={`rounded-2xl border p-4 text-left transition ${
                                    isSelected
                                       ? "border-primary bg-primary/5"
                                       : "border-outline bg-white/70 hover:border-primary/40"
                                 }`}
                              >
                                 <div className="flex items-start justify-between gap-3">
                                    <div>
                                       <p className="text-sm font-semibold text-primary">
                                          {job.title}
                                       </p>
                                       <p className="text-xs text-label">
                                          {job.company?.companyName ||
                                             "Company"}{" "}
                                          · {job.location}
                                       </p>
                                    </div>
                                    {job.applicationStatus && (
                                       <StatusBadge
                                          status={job.applicationStatus}
                                       />
                                    )}
                                 </div>
                                 <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-label">
                                    <span>{job.workMode}</span>
                                    {job.category && (
                                       <span>{job.category}</span>
                                    )}
                                    {job.stipend && (
                                       <span>฿{job.stipend}/mo</span>
                                    )}
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  )}
               </div>

               <div className="lg:sticky lg:top-28">
                  {selectedJob ? (
                     <SectionCard
                        title={selectedJob.title}
                        subtitle={`${selectedJob.company?.companyName || "Company"} · ${selectedJob.location}`}
                        action={
                           <Link
                              to={`/jobs/${getJobId(selectedJob)}`}
                              className="text-sm font-semibold text-primary"
                           >
                              Open full view
                           </Link>
                        }
                     >
                        <div className="flex flex-wrap items-center gap-2 text-xs text-label">
                           <span>{selectedJob.workMode}</span>
                           {selectedJob.duration && (
                              <span>{selectedJob.duration}</span>
                           )}
                           {selectedJob.category && (
                              <span>{selectedJob.category}</span>
                           )}
                        </div>

                        {selectedJob.applicationStatus && (
                           <div className="mt-4">
                              <StatusBadge
                                 status={selectedJob.applicationStatus}
                              />
                           </div>
                        )}

                        <p className="mt-4 text-sm text-paragraph">
                           {selectedJob.description}
                        </p>

                        {selectedJob.responsibilities && (
                           <div className="mt-4 text-sm text-paragraph">
                              <span className="font-semibold text-primary">
                                 Responsibilities:{" "}
                              </span>
                              {selectedJob.responsibilities}
                           </div>
                        )}
                        {selectedJob.requirements && (
                           <div className="mt-2 text-sm text-paragraph">
                              <span className="font-semibold text-primary">
                                 Requirements:{" "}
                              </span>
                              {selectedJob.requirements}
                           </div>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                           {!user?.resume && (
                              <div className="w-full rounded-xl border border-outline bg-white/70 p-3 text-xs text-label">
                                 <p className="font-semibold text-primary">
                                    Resume required to apply
                                 </p>
                                 <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <input
                                       type="file"
                                       accept=".pdf"
                                       onChange={(e) =>
                                          setResumeFile(e.target.files?.[0] || null)
                                       }
                                       className="text-xs"
                                    />
                                    <button
                                       type="button"
                                       onClick={handleResumeUpload}
                                       disabled={resumeUploading}
                                       className="rounded-full border border-outline bg-white px-4 py-1.5 text-xs font-semibold text-primary hover:bg-neutral disabled:opacity-60"
                                    >
                                       {resumeUploading
                                          ? "Uploading..."
                                          : "Upload resume"}
                                    </button>
                                 </div>
                                 {resumeMessage && (
                                    <p className="mt-2 text-xs text-label">
                                       {resumeMessage}
                                    </p>
                                 )}
                              </div>
                           )}
                           <button
                              type="button"
                              onClick={() => handleApply(selectedJob)}
                              disabled={
                                 isApplying ||
                                 !!selectedJob.applicationStatus ||
                                 !user?.resume
                              }
                              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
                           >
                              {selectedJob.applicationStatus
                                 ? "Applied"
                                 : "Apply now"}
                           </button>

                           <button
                              type="button"
                              onClick={() => handleSave(selectedJob)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                           >
                              {selectedJob.isSaved ? (
                                 <BookmarkCheck className="h-4 w-4" />
                              ) : (
                                 <Bookmark className="h-4 w-4" />
                              )}
                              {selectedJob.isSaved ? "Saved" : "Save"}
                           </button>

                           <button
                              type="button"
                              onClick={() => handlePriority(selectedJob)}
                              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                 selectedJob.isPriority
                                    ? "border-secondary bg-secondary/10 text-secondary"
                                    : "border-outline bg-white text-primary hover:bg-neutral"
                              }`}
                           >
                              <Star className="h-4 w-4" />
                              {selectedJob.isPriority ? "Important" : "Mark"}
                           </button>
                        </div>
                     </SectionCard>
                  ) : (
                     <EmptyState
                        title="Select a role"
                        description="Choose an internship to preview details here."
                     />
                  )}
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default ApplicantsDashboard;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
   Bookmark,
   BookmarkCheck,
   MapPin,
   Clock,
   DollarSign,
   Briefcase,
   Building2,
   ArrowLeft,
   Upload,
   CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/cards/StatusBadge";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const JobDetails = () => {
   const { id } = useParams();
   const { user, updateUser } = useAuth();
   const [job, setJob] = useState(null);
   const [isSaving, setIsSaving] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMessage, setResumeMessage] = useState("");

   useEffect(() => {
      const fetchJob = async () => {
         try {
            const res = await axiosInstance.get(
               API_PATHS.JOBS.GET_JOB_BY_ID(id),
               { params: { userId: user?._id || user?.id } },
            );
            if (res.status === 200 && res.data) setJob(res.data);
         } catch {
            /* silent */
         }
      };
      fetchJob();
   }, [id, user]);

   const handleSave = async () => {
      if (!job) return;
      setIsSaving(true);
      try {
         if (job.isSaved) {
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
            setJob((p) => ({ ...p, isSaved: false }));
         } else {
            await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(job._id));
            setJob((p) => ({ ...p, isSaved: true }));
         }
      } catch {
         /* silent */
      } finally {
         setIsSaving(false);
      }
   };

   const handleApply = async () => {
      if (!user?.resume) {
         setResumeMessage("Please upload a resume before applying.");
         return;
      }
      setIsApplying(true);
      try {
         await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(job._id));
         setJob((p) => ({ ...p, applicationStatus: "Applied" }));
      } catch {
         setJob((p) => ({ ...p, applicationStatus: "Applied" }));
      } finally {
         setIsApplying(false);
      }
   };

   const handleResumeUpload = async () => {
      if (!resumeFile) {
         setResumeMessage("Please select a PDF file.");
         return;
      }
      if (resumeFile.type !== "application/pdf") {
         setResumeMessage("Resume must be a PDF.");
         return;
      }
      setResumeUploading(true);
      setResumeMessage("");
      try {
         const res = await uploadImage(resumeFile);
         const url = res?.imageUrl;
         if (!url) {
            setResumeMessage("Upload failed. Try again.");
            return;
         }
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            resume: url,
         });
         updateUser({ resume: url });
         setResumeMessage("Resume uploaded!");
      } catch {
         setResumeMessage("Upload failed. Try again.");
      } finally {
         setResumeUploading(false);
      }
   };

   if (!job)
      return (
         <DashboardLayout
            activeMenu="find-jobs"
            navItems={NAVIGATION_MENU_APPLICANT}
         >
            <div className="py-20 text-center text-sm text-label">
               Loading internship details…
            </div>
         </DashboardLayout>
      );

   const companyInitial = (job.company?.companyName ||
      job.company?.name ||
      "C")[0].toUpperCase();

   return (
      <DashboardLayout
         activeMenu="find-jobs"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <Link
               to="/find-jobs"
               className="inline-flex items-center gap-1.5 text-sm font-semibold text-label hover:text-primary transition"
            >
               <ArrowLeft className="h-4 w-4" /> Back to results
            </Link>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
               {/* Main content */}
               <div className="space-y-5">
                  {/* Header card */}
                  <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
                     <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-xl font-bold text-primary">
                           {companyInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h1 className="text-xl font-bold text-primary">
                              {job.title}
                           </h1>
                           <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-label">
                              <span className="flex items-center gap-1">
                                 <Building2 className="h-3.5 w-3.5" />
                                 {job.company?.companyName || "Company"}
                              </span>
                              {job.location && (
                                 <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {job.location}
                                 </span>
                              )}
                           </div>
                        </div>
                        {job.applicationStatus && (
                           <StatusBadge status={job.applicationStatus} />
                        )}
                     </div>

                     <div className="mt-5 flex flex-wrap gap-2">
                        {job.workMode && (
                           <span className="rounded-full bg-neutral px-3 py-1 text-xs font-medium text-label">
                              {job.workMode}
                           </span>
                        )}
                        {job.duration && (
                           <span className="rounded-full bg-neutral px-3 py-1 text-xs font-medium text-label flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.duration}
                           </span>
                        )}
                        {job.category && (
                           <span className="rounded-full bg-neutral px-3 py-1 text-xs font-medium text-label">
                              {job.category}
                           </span>
                        )}
                        {job.stipend && (
                           <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                              ฿{job.stipend}/mo
                           </span>
                        )}
                     </div>
                  </div>

                  {/* Description sections */}
                  {[
                     { title: "About the role", content: job.description },
                     {
                        title: "Responsibilities",
                        content: job.responsibilities,
                     },
                     { title: "Requirements", content: job.requirements },
                  ]
                     .filter((s) => s.content)
                     .map((s) => (
                        <div
                           key={s.title}
                           className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm"
                        >
                           <h2 className="text-base font-semibold text-primary mb-3">
                              {s.title}
                           </h2>
                           <p className="text-sm text-paragraph leading-relaxed">
                              {s.content}
                           </p>
                        </div>
                     ))}
               </div>

               {/* Sticky sidebar */}
               <div className="space-y-4 lg:sticky lg:top-28 self-start">
                  {/* Apply card */}
                  <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
                     <h3 className="text-sm font-semibold text-primary mb-4">
                        Apply for this role
                     </h3>

                     {!user?.resume && (
                        <div className="mb-4 rounded-xl border border-dashed border-outline bg-neutral/40 p-4">
                           <p className="text-xs font-semibold text-primary mb-2">
                              Resume required
                           </p>
                           <input
                              type="file"
                              id="resume-sidebar"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                 setResumeFile(e.target.files?.[0] || null);
                                 setResumeMessage("");
                              }}
                           />
                           <label
                              htmlFor="resume-sidebar"
                              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-outline bg-white py-2 text-xs font-semibold text-primary hover:bg-neutral transition"
                           >
                              <Upload className="h-3.5 w-3.5" />{" "}
                              {resumeFile ? resumeFile.name : "Choose PDF"}
                           </label>
                           {resumeFile && (
                              <button
                                 type="button"
                                 onClick={handleResumeUpload}
                                 disabled={resumeUploading}
                                 className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-secondary transition disabled:opacity-60"
                              >
                                 {resumeUploading ? "Uploading…" : "Upload PDF"}
                              </button>
                           )}
                           {resumeMessage && (
                              <p
                                 className={`mt-1.5 text-xs ${resumeMessage.includes("!") ? "text-success" : "text-label"}`}
                              >
                                 {resumeMessage}
                              </p>
                           )}
                        </div>
                     )}

                     {user?.resume && !job.applicationStatus && (
                        <div className="mb-3 flex items-center gap-2 rounded-xl bg-success/5 border border-success/20 px-3 py-2">
                           <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                           <p className="text-xs text-success font-medium">
                              Resume ready
                           </p>
                        </div>
                     )}

                     <div className="flex flex-col gap-2">
                        <button
                           type="button"
                           onClick={handleApply}
                           disabled={
                              isApplying ||
                              !!job.applicationStatus ||
                              !user?.resume
                           }
                           className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:opacity-60"
                        >
                           <Briefcase className="h-4 w-4" />
                           {job.applicationStatus
                              ? "Application submitted"
                              : isApplying
                                ? "Submitting…"
                                : "Apply now"}
                        </button>
                        <button
                           type="button"
                           onClick={handleSave}
                           disabled={isSaving}
                           className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline bg-white py-3 text-sm font-semibold text-primary transition hover:bg-neutral disabled:opacity-60"
                        >
                           {job.isSaved ? (
                              <BookmarkCheck className="h-4 w-4 text-accent" />
                           ) : (
                              <Bookmark className="h-4 w-4" />
                           )}
                           {job.isSaved ? "Saved" : "Save for later"}
                        </button>
                     </div>
                  </div>

                  {/* Quick info card */}
                  <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
                     <h3 className="text-sm font-semibold text-primary mb-3">
                        Quick info
                     </h3>
                     <div className="space-y-2.5">
                        {[
                           {
                              icon: MapPin,
                              label: "Location",
                              value: job.location || "Not specified",
                           },
                           {
                              icon: Clock,
                              label: "Duration",
                              value: job.duration || "Not specified",
                           },
                           {
                              icon: DollarSign,
                              label: "Stipend",
                              value: job.stipend
                                 ? `฿${job.stipend}/mo`
                                 : "Not specified",
                           },
                           {
                              icon: Briefcase,
                              label: "Work mode",
                              value: job.workMode || "Not specified",
                           },
                        ].map(({ icon: Icon, label, value }) => (
                           <div
                              key={label}
                              className="flex items-center justify-between text-sm"
                           >
                              <span className="flex items-center gap-1.5 text-label">
                                 <Icon className="h-3.5 w-3.5" />
                                 {label}
                              </span>
                              <span className="font-medium text-primary">
                                 {value}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default JobDetails;

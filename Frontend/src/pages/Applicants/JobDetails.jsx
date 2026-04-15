import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const seedJob = {
   _id: "job-1",
   title: "Frontend Intern",
   company: { companyName: "Beaconn Studio" },
   location: "Bangkok, Thailand",
   workMode: "Hybrid",
   stipend: 300,
   duration: "3 months",
   description:
      "Work with the product team to build a modern internship portal experience.",
   responsibilities:
      "Build UI components, collaborate with designers, and improve UX flows.",
   requirements: "React, TailwindCSS, basic Git workflows.",
   isSaved: false,
   applicationStatus: null,
};

const JobDetails = () => {
   const { id } = useParams();
   const { user, updateUser } = useAuth();
   const [job, setJob] = useState(seedJob);
   const [isSaving, setIsSaving] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMessage, setResumeMessage] = useState("");

   useEffect(() => {
      const fetchJob = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_JOB_BY_ID(id),
               {
                  params: { userId: user?._id || user?.id },
               },
            );
            if (response.status === 200 && response.data) {
               setJob(response.data);
            } else {
               setJob(seedJob);
            }
         } catch (error) {
            setJob(seedJob);
         }
      };
      fetchJob();
   }, [id, user]);

   useEffect(() => {
      if (!user || !id) return;
      const loadSaved = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_SAVED_JOBS,
            );
            if (response.status === 200 && Array.isArray(response.data)) {
               const savedIds = new Set(
                  response.data
                     .map((item) => item?.job?._id || item?.job)
                     .filter(Boolean)
                     .map((jobId) => String(jobId)),
               );
               setJob((prev) => ({
                  ...prev,
                  isSaved: savedIds.has(String(id)),
               }));
            }
         } catch {
            // Keep current saved state if fetch fails
         }
      };
      loadSaved();
   }, [id, user]);

   const handleSave = async () => {
      setIsSaving(true);
      try {
         if (job.isSaved) {
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
            setJob((prev) => ({ ...prev, isSaved: false }));
         } else {
            await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(job._id));
            setJob((prev) => ({ ...prev, isSaved: true }));
         }
      } catch (error) {
         setJob((prev) => ({ ...prev, isSaved: !prev.isSaved }));
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
         setJob((prev) => ({ ...prev, applicationStatus: "Applied" }));
      } catch (error) {
         setJob((prev) => ({ ...prev, applicationStatus: "Applied" }));
      } finally {
         setIsApplying(false);
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
      } catch (error) {
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
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     {job.title}
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     {job.company?.companyName || "Company"} · {job.location}
                  </p>
               </div>
               <Link
                  to="/find-jobs"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  Back to results
               </Link>
            </div>

            <SectionCard title="Internship details">
               <div className="flex flex-wrap items-center gap-4 text-sm text-label">
                  <span>{job.workMode}</span>
                  <span>Duration: {job.duration}</span>
                  <span>Stipend: ${job.stipend}/mo</span>
               </div>
               {job.applicationStatus && (
                  <div className="mt-4">
                     <StatusBadge status={job.applicationStatus} />
                  </div>
               )}
               <div className="mt-4 flex flex-wrap items-center gap-3">
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
                              {resumeUploading ? "Uploading..." : "Upload resume"}
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
                     onClick={handleApply}
                     disabled={
                        isApplying || !!job.applicationStatus || !user?.resume
                     }
                     className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
                  >
                     {job.applicationStatus ? "Applied" : "Apply now"}
                  </button>
                  <button
                     type="button"
                     onClick={handleSave}
                     disabled={isSaving}
                     className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     {job.isSaved ? (
                        <BookmarkCheck className="h-4 w-4" />
                     ) : (
                        <Bookmark className="h-4 w-4" />
                     )}
                     {job.isSaved ? "Saved" : "Save"}
                  </button>
               </div>

               <div className="mt-6 space-y-6 border-t border-outline pt-6">
                  <div>
                     <h3 className="text-sm font-semibold text-primary">
                        Description
                     </h3>
                     <p className="mt-2 text-sm text-paragraph leading-relaxed">
                        {job.description}
                     </p>
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-primary">
                        Responsibilities
                     </h3>
                     <p className="mt-2 text-sm text-paragraph leading-relaxed">
                        {job.responsibilities}
                     </p>
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-primary">
                        Requirements
                     </h3>
                     <p className="mt-2 text-sm text-paragraph leading-relaxed">
                        {job.requirements}
                     </p>
                  </div>
               </div>
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default JobDetails;


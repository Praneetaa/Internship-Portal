import { useState } from "react";
import {
   User,
   Mail,
   MapPin,
   GraduationCap,
   Code2,
   FileText,
   Upload,
   Camera,
   CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const CandidateProfile = () => {
   const { user, updateUser } = useAuth();
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMsg, setResumeMsg] = useState("");
   const [avatarUploading, setAvatarUploading] = useState(false);

   const name = user?.name || user?.fullName || "Your Name";
   const email = user?.email || "—";
   const avatar = user?.avatar || null;
   const resume = user?.resume || null;

   const handleAvatarChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setAvatarUploading(true);
      try {
         const res = await uploadImage(file);
         if (res?.imageUrl) {
            await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
               avatar: res.imageUrl,
            });
            updateUser({ avatar: res.imageUrl });
         }
      } catch {
         /* silent */
      } finally {
         setAvatarUploading(false);
      }
   };

   const handleResumeUpload = async () => {
      if (!resumeFile) {
         setResumeMsg("Please select a PDF file.");
         return;
      }
      if (resumeFile.type !== "application/pdf") {
         setResumeMsg("Resume must be a PDF.");
         return;
      }
      setResumeUploading(true);
      setResumeMsg("");
      try {
         const res = await uploadImage(resumeFile);
         const url = res?.imageUrl;
         if (!url) {
            setResumeMsg("Upload failed. Please try again.");
            return;
         }
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            resume: url,
         });
         updateUser({ resume: url });
         setResumeMsg("Resume uploaded successfully.");
         setResumeFile(null);
      } catch {
         setResumeMsg("Upload failed. Please try again.");
      } finally {
         setResumeUploading(false);
      }
   };

   return (
      <DashboardLayout
         activeMenu="candidate-profile"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-bold text-primary">My profile</h1>
               <p className="mt-1 text-sm text-label">
                  Keep your profile updated to improve your visibility.
               </p>
            </div>

            {/* Profile hero card */}
            <div className="rounded-2xl border border-outline bg-white/90 shadow-sm overflow-hidden">
               <div className="h-24 bg-gradient-to-r from-primary to-secondary" />
               <div className="px-6 pb-6">
                  <div className="relative -mt-12 flex items-end justify-between gap-4">
                     <div className="relative">
                        <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-neutral flex items-center justify-center">
                           {avatar ? (
                              <img
                                 src={avatar}
                                 alt={name}
                                 className="h-full w-full object-cover"
                              />
                           ) : (
                              <User className="h-8 w-8 text-icon" />
                           )}
                        </div>
                        <label
                           htmlFor="avatar-upload"
                           className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary shadow hover:bg-secondary transition"
                        >
                           {avatarUploading ? (
                              <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                           ) : (
                              <Camera className="h-3.5 w-3.5 text-white" />
                           )}
                        </label>
                        <input
                           id="avatar-upload"
                           type="file"
                           accept="image/*"
                           onChange={handleAvatarChange}
                           className="hidden"
                        />
                     </div>
                  </div>
                  <div className="mt-3">
                     <h2 className="text-xl font-bold text-primary">{name}</h2>
                     <p className="text-sm text-label mt-0.5">
                        {user?.role === "candidate" ? "Candidate" : "User"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Info grid */}
            <div className="grid gap-4 sm:grid-cols-2">
               <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                     </div>
                     <h3 className="text-sm font-semibold text-primary">
                        Personal info
                     </h3>
                  </div>
                  <div className="space-y-3">
                     <div>
                        <p className="text-xs text-label">Full name</p>
                        <p className="mt-0.5 text-sm font-semibold text-primary">
                           {name}
                        </p>
                     </div>
                     <div>
                        <p className="text-xs text-label">Email</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-paragraph">
                           <Mail className="h-3.5 w-3.5 text-icon" /> {email}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Resume card */}
               <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                     </div>
                     <h3 className="text-sm font-semibold text-primary">
                        Resume
                     </h3>
                  </div>

                  {resume ? (
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-3">
                           <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                           <div className="min-w-0">
                              <p className="text-sm font-semibold text-primary">
                                 Resume uploaded
                              </p>
                              <a
                                 href={resume}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-xs text-accent hover:underline truncate block"
                              >
                                 View current resume →
                              </a>
                           </div>
                        </div>
                        <p className="text-xs text-label">
                           Upload a new file to replace it:
                        </p>
                     </div>
                  ) : (
                     <div className="rounded-xl border border-dashed border-outline bg-neutral/40 p-4 text-center mb-3">
                        <FileText className="h-8 w-8 text-icon mx-auto mb-2" />
                        <p className="text-sm font-semibold text-primary">
                           No resume yet
                        </p>
                        <p className="text-xs text-label mt-0.5">
                           Upload a PDF to start applying
                        </p>
                     </div>
                  )}

                  <div className="mt-3 space-y-2">
                     <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                           setResumeFile(e.target.files?.[0] || null);
                           setResumeMsg("");
                        }}
                     />
                     <label
                        htmlFor="resume-upload"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline bg-white py-2.5 text-sm font-semibold text-primary hover:bg-neutral transition"
                     >
                        <Upload className="h-4 w-4" />
                        {resumeFile ? resumeFile.name : "Choose PDF file"}
                     </label>
                     {resumeFile && (
                        <button
                           type="button"
                           onClick={handleResumeUpload}
                           disabled={resumeUploading}
                           className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-secondary transition disabled:opacity-60"
                        >
                           {resumeUploading ? "Uploading…" : "Upload resume"}
                        </button>
                     )}
                     {resumeMsg && (
                        <p
                           className={`text-xs text-center ${resumeMsg.includes("success") ? "text-success" : "text-label"}`}
                        >
                           {resumeMsg}
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* Account status */}
            <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
               <h3 className="text-sm font-semibold text-primary mb-4">
                  Profile completeness
               </h3>
               <div className="space-y-3">
                  {[
                     { label: "Account created", done: true },
                     { label: "Profile photo uploaded", done: !!avatar },
                     { label: "Resume uploaded", done: !!resume },
                  ].map((item) => (
                     <div key={item.label} className="flex items-center gap-3">
                        <div
                           className={`flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 ${item.done ? "bg-success/10" : "bg-neutral border border-outline"}`}
                        >
                           {item.done ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                           ) : (
                              <span className="h-2 w-2 rounded-full bg-outline" />
                           )}
                        </div>
                        <p
                           className={`text-sm ${item.done ? "text-primary font-medium" : "text-label"}`}
                        >
                           {item.label}
                        </p>
                     </div>
                  ))}
               </div>
               <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral">
                  <div
                     className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                     style={{
                        width: `${[[true, !!avatar, !!resume].filter(Boolean).length / 3] * 100}%`,
                     }}
                  />
               </div>
               <p className="mt-1.5 text-xs text-label">
                  {[true, !!avatar, !!resume].filter(Boolean).length} of 3
                  complete
               </p>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default CandidateProfile;

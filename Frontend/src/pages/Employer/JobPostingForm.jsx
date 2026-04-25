import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, WORK_MODE } from "../../utils/data";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TextInput from "../../components/input/TextInput";
import TextArea from "../../components/input/TextArea";
import SelectInput from "../../components/input/SelectInput";

const defaultForm = {
   title: "",
   location: "",
   workMode: "Remote",
   category: "Engineering",
   duration: "",
   stipend: "",
   deadline: "",
   description: "",
   responsibilities: "",
   requirements: "",
   skills: "",
};

const Section = ({ title, subtitle, children }) => (
   <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
      <div className="mb-4">
         <h2 className="text-base font-semibold text-primary">{title}</h2>
         {subtitle && <p className="mt-0.5 text-xs text-label">{subtitle}</p>}
      </div>
      {children}
   </div>
);

const JobPostingForm = () => {
   const [formData, setFormData] = useState(defaultForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [statusMessage, setStatusMessage] = useState("");
   const [statusType, setStatusType] = useState("");
   const [editingJobId, setEditingJobId] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (statusMessage) setStatusMessage("");
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get("jobId");
      if (!jobId) return;
      setEditingJobId(jobId);
      axiosInstance
         .get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId))
         .then((res) => {
            if (res.status === 200 && res.data) {
               const d = res.data;
               setFormData({
                  title: d.title || "",
                  location: d.location || "",
                  workMode: d.workMode || "Remote",
                  category: d.category || "Engineering",
                  duration: d.duration || "",
                  stipend: d.stipend || "",
                  deadline: d.deadline ? d.deadline.slice(0, 10) : "",
                  description: d.description || "",
                  responsibilities: d.responsibilities || "",
                  requirements: d.requirements || "",
                  skills: d.skills || "",
               });
            }
         })
         .catch(() => setEditingJobId(null));
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.title.trim()) {
         setStatusMessage("Role title is required.");
         setStatusType("error");
         return;
      }
      if (!formData.description.trim() || !formData.requirements.trim()) {
         setStatusMessage("Description and requirements are required.");
         setStatusType("error");
         return;
      }

      setIsSubmitting(true);
      setStatusMessage("");
      const stipendValue = formData.stipend
         ? Number(String(formData.stipend).replace(/[^\d.]/g, ""))
         : undefined;
      const payload = {
         title: formData.title,
         location: formData.location,
         workMode: formData.workMode,
         category: formData.category,
         duration: formData.duration,
         stipend: Number.isFinite(stipendValue) ? stipendValue : undefined,
         deadline: formData.deadline || undefined,
         description: formData.description,
         responsibilities: formData.responsibilities,
         requirements: formData.requirements,
         skills: formData.skills,
      };

      try {
         if (editingJobId) {
            await axiosInstance.put(
               API_PATHS.JOBS.UPDATE_JOB(editingJobId),
               payload,
            );
            setStatusMessage("Internship updated successfully.");
            setStatusType("success");
         } else {
            await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);
            setStatusMessage("Internship posted successfully.");
            setStatusType("success");
            setFormData(defaultForm);
         }
      } catch (error) {
         const msg =
            error?.response?.status === 403
               ? "Only organization accounts can post internships."
               : error?.response?.data?.message ||
                 "Unable to save internship right now.";
         setStatusMessage(msg);
         setStatusType("error");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <DashboardLayout activeMenu="post-job">
         <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-text">
                     {editingJobId ? "Edit internship" : "Post an internship"}
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Create a clear, structured listing to attract the right
                     candidates.
                  </p>
               </div>
               <Link
                  to="/manage-jobs"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral transition"
               >
                  ← Manage jobs
               </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               {/* Role details */}
               <Section
                  title="Role details"
                  subtitle="Core information about the internship listing."
               >
                  <div className="grid gap-4 sm:grid-cols-2">
                     <div className="sm:col-span-2">
                        <TextInput
                           label="Role title"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           placeholder="Frontend Development Intern"
                        />
                     </div>
                     <TextInput
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Bangkok, Thailand"
                     />
                     <SelectInput
                        label="Work mode"
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        options={WORK_MODE}
                     />
                     <SelectInput
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={CATEGORIES}
                     />
                     <TextInput
                        label="Duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="3 months"
                     />
                     <TextInput
                        label="Stipend / month (฿)"
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleChange}
                        placeholder="15000"
                        type="number"
                     />
                     <TextInput
                        label="Application deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                     />
                  </div>
               </Section>

               {/* Content sections */}
               <Section
                  title="Description"
                  subtitle="A short overview of the internship and the team."
               >
                  <TextArea
                     label=""
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Explain the internship, the team the candidate will join, and the impact they'll have."
                     rows={4}
                  />
               </Section>

               <Section
                  title="Responsibilities"
                  subtitle="What will the intern actually do day-to-day?"
               >
                  <TextArea
                     label=""
                     name="responsibilities"
                     value={formData.responsibilities}
                     onChange={handleChange}
                     placeholder="List the main tasks and expectations for this role."
                     rows={4}
                  />
               </Section>

               <Section
                  title="Requirements"
                  subtitle="Minimum skills and qualifications needed."
               >
                  <TextArea
                     label=""
                     name="requirements"
                     value={formData.requirements}
                     onChange={handleChange}
                     placeholder="What skills, tools, or knowledge does the candidate need?"
                     rows={4}
                  />
               </Section>

               <Section
                  title="Skills & tags"
                  subtitle="Comma-separated keywords help candidates find this listing."
               >
                  <TextInput
                     label="Skills"
                     name="skills"
                     value={formData.skills}
                     onChange={handleChange}
                     placeholder="React, Figma, Python, Communication"
                  />
               </Section>

               {/* Submit row */}
               <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition disabled:opacity-60"
                  >
                     {isSubmitting
                        ? "Saving…"
                        : editingJobId
                          ? "Update internship"
                          : "Post internship"}
                  </button>
                  <button
                     type="button"
                     onClick={() => {
                        setFormData(defaultForm);
                        setStatusMessage("");
                     }}
                     className="rounded-full border border-outline bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-neutral transition"
                  >
                     Reset form
                  </button>
                  {statusMessage && (
                     <div
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${statusType === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
                     >
                        {statusType === "success" ? (
                           <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        ) : (
                           <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        {statusMessage}
                     </div>
                  )}
               </div>
            </form>
         </div>
      </DashboardLayout>
   );
};

export default JobPostingForm;

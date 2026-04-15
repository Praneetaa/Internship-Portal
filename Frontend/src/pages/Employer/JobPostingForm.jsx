import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, WORK_MODE } from "../../utils/data";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
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

const JobPostingForm = () => {
   const [formData, setFormData] = useState(defaultForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [statusMessage, setStatusMessage] = useState("");
   const [editingJobId, setEditingJobId] = useState(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get("jobId");
      if (!jobId) return;
      setEditingJobId(jobId);
      const loadJob = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
            );
            if (response.status === 200 && response.data) {
               setFormData({
                  title: response.data.title || "",
                  location: response.data.location || "",
                  workMode: response.data.workMode || "Remote",
                  category: response.data.category || "Engineering",
                  duration: response.data.duration || "",
                  stipend: response.data.stipend || "",
                  deadline: response.data.deadline || "",
                  description: response.data.description || "",
                  responsibilities: response.data.responsibilities || "",
                  requirements: response.data.requirements || "",
                  skills: response.data.skills || "",
               });
            }
         } catch (error) {
            setEditingJobId(null);
         }
      };
      loadJob();
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setStatusMessage("");

      try {
         if (!formData.title.trim()) {
            setStatusMessage("Please add a role title before posting.");
            setIsSubmitting(false);
            return;
         }
         if (!formData.description.trim() || !formData.requirements.trim()) {
            setStatusMessage(
               "Description and requirements are required to post a job.",
            );
            setIsSubmitting(false);
            return;
         }

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

         if (editingJobId) {
            await axiosInstance.put(
               API_PATHS.JOBS.UPDATE_JOB(editingJobId),
               payload,
            );
         } else {
            await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);
         }
         setStatusMessage(
            editingJobId
               ? "Internship updated successfully."
               : "Internship posted successfully.",
         );
         if (!editingJobId) {
            setFormData(defaultForm);
         }
      } catch (error) {
         if (error?.response?.status === 401) {
            setStatusMessage("Please log in again to post a job.");
         } else if (error?.response?.status === 403) {
            setStatusMessage("Only organization accounts can post jobs.");
         } else if (error?.response?.data?.message) {
            setStatusMessage(error.response.data.message);
         } else {
            setStatusMessage("Unable to post internship right now.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <DashboardLayout activeMenu="post-job">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     {editingJobId ? "Edit internship" : "Post an internship"}
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Create a clear, structured listing to attract the right
                     candidates.
                  </p>
               </div>
               <Link
                  to="/manage-jobs"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  Back to manage jobs
               </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <SectionCard
                  title="Role details"
                  subtitle="Core details for the internship listing."
               >
                  <div className="grid gap-4 sm:grid-cols-2">
                     <TextInput
                        label="Role title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Frontend Intern"
                     />
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
                        label="Stipend / compensation"
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleChange}
                        placeholder="$300 / month"
                     />
                     <TextInput
                        label="Application deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                     />
                  </div>
               </SectionCard>

               <SectionCard
                  title="Responsibilities"
                  subtitle="Help candidates understand what they will do."
               >
                  <TextArea
                     label=""
                     name="responsibilities"
                     value={formData.responsibilities}
                     onChange={handleChange}
                     placeholder="List the main tasks and expectations."
                  />
               </SectionCard>

               <SectionCard
                  title="Requirements"
                  subtitle="Minimum skills and qualifications."
               >
                  <TextArea
                     label=""
                     name="requirements"
                     value={formData.requirements}
                     onChange={handleChange}
                     placeholder="What skills are needed to succeed?"
                  />
               </SectionCard>

               <SectionCard
                  title="Description"
                  subtitle="A short overview of the internship."
               >
                  <TextArea
                     label=""
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Explain the internship, team, and impact."
                  />
               </SectionCard>

               <SectionCard
                  title="Skills & tags"
                  subtitle="Comma-separated skills help matching."
               >
                  <TextInput
                     label="Skills"
                     name="skills"
                     value={formData.skills}
                     onChange={handleChange}
                     placeholder="React, Figma, Analytics"
                  />
               </SectionCard>

               <div className="flex flex-wrap items-center gap-3">
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     {isSubmitting
                        ? "Saving..."
                        : editingJobId
                          ? "Update internship"
                          : "Post internship"}
                  </button>
                  <button
                     type="button"
                     onClick={() => setFormData(defaultForm)}
                     className="rounded-full border border-outline bg-white px-6 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     Reset form
                  </button>
                  {statusMessage && (
                     <span className="text-sm text-label">
                        {statusMessage}
                     </span>
                  )}
               </div>
            </form>
         </div>
      </DashboardLayout>
   );
};

export default JobPostingForm;

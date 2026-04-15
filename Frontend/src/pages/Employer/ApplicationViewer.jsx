import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";

const statusOptions = ["Applied", "In Review", "Rejected", "Accepted"];

const ApplicationViewer = () => {
   const [jobs, setJobs] = useState([]);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [applications, setApplications] = useState([]);

   useEffect(() => {
      const loadJobs = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.JOBS.GET_JOBS_EMPLOYER,
            );
            if (response.status === 200) {
               const nextJobs = (response.data || []).sort((a, b) => {
                  const aDate = new Date(a.createdAt || 0).getTime();
                  const bDate = new Date(b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setJobs(nextJobs);
               setSelectedJobId(nextJobs[0]?._id || null);
            }
         } catch {
            setJobs([]);
            setSelectedJobId(null);
         }
      };
      loadJobs();
   }, []);

   useEffect(() => {
      if (!selectedJobId) return;
      const loadApplications = async () => {
         try {
            const response = await axiosInstance.get(
               API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(selectedJobId),
            );
            if (response.status === 200) {
               const nextApps = (response.data || []).sort((a, b) => {
                  const aDate = new Date(a.createdAt || 0).getTime();
                  const bDate = new Date(b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setApplications(nextApps);
            }
         } catch {
            setApplications([]);
         }
      };
      loadApplications();
   }, [selectedJobId]);

   const getAppId = (app) => app._id || app.id;
   const getJobId = (job) => job._id || job.id;

   const handleStatusChange = async (applicationId, status) => {
      // Optimistic update first
      setApplications((prev) =>
         prev.map((app) =>
            getAppId(app) === applicationId ? { ...app, status } : app,
         ),
      );
      try {
         await axiosInstance.put(
            API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId),
            { status },
         );
      } catch {
         // Revert on failure by reloading
         try {
            const response = await axiosInstance.get(
               API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(selectedJobId),
            );
            if (response.status === 200 && response.data) {
               setApplications(response.data);
            }
         } catch {
            // Keep optimistic state if reload also fails
         }
      }
   };

   const formatDate = (dateStr) => {
      if (!dateStr) return "â€”";
      return new Date(dateStr).toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      });
   };

   return (
      <DashboardLayout activeMenu="applications">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Applications
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Review applicants and update their status quickly.
                  </p>
               </div>
               <Link
                  to="/manage-jobs"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  Back to roles
               </Link>
            </div>

            <SectionCard
               title="Select internship"
               subtitle="Choose a role to see its applicants."
            >
               <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm text-paragraph outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
               >
                  {jobs.map((job) => (
                     <option key={getJobId(job)} value={getJobId(job)}>
                        {job.title}
                     </option>
                  ))}
               </select>
            </SectionCard>

            <SectionCard
               title="Applicants"
               subtitle="Update progress as you review candidates."
            >
               {applications.length === 0 ? (
                  <EmptyState
                     title="No applications yet"
                     description="Once candidates apply, they will appear here."
                  />
               ) : (
                  <div className="space-y-4">
                     {applications.map((app) => {
                        const appId = getAppId(app);
                        const applicantId = app.applicant?._id || appId;
                        const jobTitle = app.job?.title || "Internship";
                        const jobCompany =
                           app.job?.company?.companyName ||
                           app.job?.company?.name ||
                           "Company";

                        return (
                           <div
                              key={appId}
                              className="rounded-xl border border-outline bg-white/70 p-4"
                           >
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                 <div>
                                    <p className="text-sm font-semibold text-primary">
                                       {app.applicant?.name || "â€”"}
                                    </p>
                                    <p className="text-xs text-label">
                                       Applied {formatDate(app.createdAt)}
                                    </p>
                                    <p className="mt-1 text-xs text-label">
                                       {jobTitle} · {jobCompany}
                                    </p>
                                 </div>
                                 <StatusBadge status={app.status} />
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-label">
                                 <span>
                                    <Mail className="mr-1 inline h-3 w-3" />
                                    {app.applicant?.email || "â€”"}
                                 </span>

                                 {app.applicant?.phone && (
                                    <span>
                                       <Phone className="mr-1 inline h-3 w-3" />
                                       {app.applicant.phone}
                                    </span>
                                 )}

                                 <Link
                                    to={`/applicants/profile/${applicantId}`}
                                    className="font-semibold text-primary"
                                 >
                                    View profile
                                 </Link>

                                 {app.applicant?.resume && (
                                    <a
                                       href={app.applicant.resume}
                                       target="_blank"
                                       rel="noreferrer"
                                       className="font-semibold text-primary"
                                    >
                                       View resume
                                    </a>
                                 )}
                                 {!app.applicant?.resume && (
                                    <span className="text-xs text-label">
                                       No resume provided
                                    </span>
                                 )}

                                 <select
                                    value={app.status}
                                    onChange={(e) =>
                                       handleStatusChange(appId, e.target.value)
                                    }
                                    className="rounded-full border border-outline bg-white px-3 py-1.5 text-xs text-paragraph outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                                 >
                                    {statusOptions.map((option) => (
                                       <option key={option} value={option}>
                                          {option}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default ApplicationViewer;


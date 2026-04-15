import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import EmptyState from "../../components/cards/EmptyState";
import StatusBadge from "../../components/cards/StatusBadge";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const MyApplications = () => {
   const [applications, setApplications] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const formatDate = (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      });
   };

   useEffect(() => {
      const fetchApplications = async () => {
         setIsLoading(true);
         try {
            const response = await axiosInstance.get(
               API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS,
            );
            if (response.status === 200) {
               const nextApps = (response.data || []).sort((a, b) => {
                  const aDate = new Date(a.createdAt || 0).getTime();
                  const bDate = new Date(b.createdAt || 0).getTime();
                  return bDate - aDate;
               });
               setApplications(nextApps);
            }
         } catch (error) {
            setApplications([]);
         } finally {
            setIsLoading(false);
         }
      };
      fetchApplications();
   }, []);

   return (
      <DashboardLayout
         activeMenu="my-applications"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-primary">
                  My applications
               </h1>
               <p className="mt-1 text-sm text-label">
                  Track where you have applied and current status.
               </p>
            </div>

            <SectionCard title="Application tracker">
               {applications.length === 0 ? (
                  <EmptyState
                     title="No applications yet"
                     description="Apply to internships to see them here."
                  />
               ) : (
                  <div className="space-y-3">
                     {applications.map((app) => (
                        <div
                           key={app._id || app.id}
                           className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-outline bg-white/70 p-4"
                        >
                           <div>
                              <p className="text-sm font-semibold text-primary">
                                 {app.job?.title || "Internship"}
                              </p>
                              <p className="text-xs text-label">
                                 {app.job?.company?.companyName || "Company"} ·
                                 Applied {formatDate(app.createdAt)}
                              </p>
                           </div>
                           <StatusBadge status={app.status} />
                        </div>
                     ))}
                  </div>
               )}
               {isLoading && (
                  <p className="mt-3 text-sm text-label">
                     Loading applications...
                  </p>
               )}
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default MyApplications;


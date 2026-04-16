import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Clock, TrendingUp, Users } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatCard from "../../components/cards/StatCard";
import StatusBadge from "../../components/cards/StatusBadge";

const fallbackOverview = {
   stats: [
      { label: "Active Internships", value: "12", change: "+3 this week" },
      { label: "Applications", value: "248", change: "+18 today" },
      { label: "Shortlisted", value: "34", change: "+6 this week" },
      { label: "Interviews", value: "9", change: "+2 this week" },
   ],
   recentApplications: [
      {
         id: "app-1",
         name: "Aisha Khan",
         role: "Product Design Intern",
         status: "In Review",
         time: "2 hours ago",
      },
      {
         id: "app-2",
         name: "Rahul Sen",
         role: "Marketing Intern",
         status: "Applied",
         time: "5 hours ago",
      },
      {
         id: "app-3",
         name: "Yara Solis",
         role: "Software Intern",
         status: "In Review",
         time: "1 day ago",
      },
   ],
   activeRoles: [
      {
         id: "job-1",
         title: "Frontend Intern",
         applicants: 42,
         status: "Open",
         deadline: "Apr 22, 2026",
      },
      {
         id: "job-2",
         title: "Data Analyst Intern",
         applicants: 27,
         status: "Open",
         deadline: "Apr 28, 2026",
      },
      {
         id: "job-3",
         title: "UX Research Intern",
         applicants: 16,
         status: "Closed",
         deadline: "May 02, 2026",
      },
   ],
};

const EmployerDashboard = () => {
   const [dashboardData, setDashboardData] = useState(fallbackOverview);
   const [isLoading, setIsLoading] = useState(false);

   const getDashboardOverView = async () => {
      try {
         setIsLoading(true);
         const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
         if (response.status === 200 && response.data) {
            setDashboardData({ ...fallbackOverview, ...response.data });
         }
      } catch (error) {
         setDashboardData(fallbackOverview);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      getDashboardOverView();
   }, []);

   const recentApplications = (dashboardData?.recentApplications || []).slice().sort((a, b) => {
      const aDate = new Date(a.createdAt || a.appliedAt || 0).getTime();
      const bDate = new Date(b.createdAt || b.appliedAt || 0).getTime();
      return bDate - aDate;
   });

   const activeRoles = (dashboardData?.activeRoles || []).slice().sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
   });

   return (
      <DashboardLayout activeMenu="organization-dashboard">
         <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Employer dashboard
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Track internships, review applicants, and keep hiring on
                     pace.
                  </p>
               </div>
               <div className="flex flex-wrap gap-3">
                  <Link
                     to="/post-job"
                     className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     <Briefcase className="h-4 w-4" />
                     Post internship
                  </Link>
                  <Link
                     to="/applications"
                     className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     Manage applicants
                  </Link>
               </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
               {(dashboardData?.stats || fallbackOverview.stats).map((stat) => (
                  <StatCard
                     key={stat.label}
                     label={stat.label}
                     value={stat.value}
                     change={stat.change}
                  />
               ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
               <SectionCard
                  title="Recent applications"
                  subtitle="Latest candidates who applied to your internships."
                  action={
                     <Link
                        to="/applications"
                        className="text-sm font-semibold text-primary"
                     >
                        View all
                     </Link>
                  }
               >
                  <div className="space-y-4">
                     {recentApplications.map((app) => (
                        <div
                           key={app.id}
                           className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline bg-white/70 p-4"
                        >
                           <div>
                              <p className="text-sm font-semibold text-primary">
                                 {app.name}
                              </p>
                              <p className="text-xs text-label">{app.role}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <StatusBadge status={app.status} />
                              <span className="text-xs text-label">
                                 <Clock className="mr-1 inline h-3 w-3" />
                                 {app.time}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </SectionCard>

               <SectionCard
                  title="Active roles"
                  subtitle="Internships that are currently receiving applicants."
               >
                  <div className="space-y-4">
                     {activeRoles.map((role) => (
                        <div
                           key={role.id}
                           className="rounded-xl border border-outline bg-white/70 p-4"
                        >
                           <div className="flex items-start justify-between gap-3">
                              <div>
                                 <p className="text-sm font-semibold text-primary">
                                    {role.title}
                                 </p>
                                 <p className="text-xs text-label">
                                    Deadline: {role.deadline}
                                 </p>
                              </div>
                              <StatusBadge status={role.status} />
                           </div>
                           <div className="mt-3 flex items-center justify-between text-xs text-label">
                              <span>
                                 <Users className="mr-1 inline h-3 w-3" />
                                 {role.applicants} applicants
                              </span>
                              <Link
                                 to="/applications"
                                 className="text-primary"
                              >
                                 Review
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               </SectionCard>
            </div>

            <SectionCard
               title="Hiring insights"
               subtitle="Quick look at internship engagement this month."
            >
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-outline bg-white/70 p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Views
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-primary">
                        4,280
                     </p>
                     <p className="mt-1 text-xs text-label">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        12% higher than last month
                     </p>
                  </div>
                  <div className="rounded-xl border border-outline bg-white/70 p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Conversion
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-primary">
                        5.6%
                     </p>
                     <p className="mt-1 text-xs text-label">
                        from view to application
                     </p>
                  </div>
                  <div className="rounded-xl border border-outline bg-white/70 p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Response time
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-primary">
                        14 hrs
                     </p>
                     <p className="mt-1 text-xs text-label">
                        average recruiter reply
                     </p>
                  </div>
               </div>
            </SectionCard>

            {isLoading && (
               <p className="text-sm text-label">Refreshing dashboard...</p>
            )}
         </div>
      </DashboardLayout>
   );
};

export default EmployerDashboard;

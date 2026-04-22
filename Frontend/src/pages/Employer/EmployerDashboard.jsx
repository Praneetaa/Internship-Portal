import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   Briefcase,
   CalendarDays,
   Clock,
   Plus,
   TrendingUp,
   Users,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatCard from "../../components/cards/StatCard";
import StatusBadge from "../../components/cards/StatusBadge";

const EVENT_TYPE_COLORS = {
   Workshop: "bg-accent/10 text-accent",
   Webinar: "bg-secondary/15 text-secondary",
   Seminar: "bg-success/10 text-success",
   Networking: "bg-primary/10 text-primary",
   "Career Fair": "bg-error/10 text-error",
   Other: "bg-neutral text-label",
};

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

const formatEventDate = (dateStr) => {
   if (!dateStr) return "—";
   return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   });
};

const EmployerDashboard = () => {
   const [dashboardData, setDashboardData] = useState(fallbackOverview);
   const [isLoading, setIsLoading] = useState(false);
   const [events, setEvents] = useState([]);
   const [eventsLoading, setEventsLoading] = useState(true);

   const getDashboardOverView = async () => {
      try {
         setIsLoading(true);
         const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
         if (response.status === 200 && response.data) {
            setDashboardData({ ...fallbackOverview, ...response.data });
         }
      } catch {
         setDashboardData(fallbackOverview);
      } finally {
         setIsLoading(false);
      }
   };

   const getMyEvents = async () => {
      setEventsLoading(true);
      try {
         const res = await axiosInstance.get(
            API_PATHS.EVENTS.GET_MY_EVENTS_ORG,
         );
         setEvents((res.data || []).slice(0, 3));
      } catch {
         setEvents([]);
      } finally {
         setEventsLoading(false);
      }
   };

   useEffect(() => {
      getDashboardOverView();
      getMyEvents();
   }, []);

   const recentApplications = (dashboardData?.recentApplications || [])
      .slice()
      .sort(
         (a, b) =>
            new Date(b.createdAt || b.appliedAt || 0) -
            new Date(a.createdAt || a.appliedAt || 0),
      );

   const activeRoles = (dashboardData?.activeRoles || [])
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

   return (
      <DashboardLayout activeMenu="organization-dashboard">
         <div className="space-y-8">
            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Employer dashboard
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Track internships, events, and applicants all in one place.
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
                     to="/post-event"
                     className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                  >
                     <CalendarDays className="h-4 w-4" />
                     Post event
                  </Link>
                  <Link
                     to="/applications"
                     className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     Manage applicants
                  </Link>
               </div>
            </div>

            {/* Stats */}
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

            {/* Recent applications + Active roles */}
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
                  <div className="space-y-3">
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
                  subtitle="Internships currently receiving applicants."
               >
                  <div className="space-y-3">
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
                              <Link to="/applications" className="text-primary">
                                 Review
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               </SectionCard>
            </div>

            {/* Events section */}
            <SectionCard
               title="Your events"
               subtitle="Workshops, webinars, and seminars you've posted."
               action={
                  <div className="flex items-center gap-3">
                     <Link
                        to="/manage-events"
                        className="text-sm font-semibold text-primary"
                     >
                        Manage all
                     </Link>
                     <Link
                        to="/post-event"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary"
                     >
                        <Plus className="h-3.5 w-3.5" />
                        New event
                     </Link>
                  </div>
               }
            >
               {eventsLoading ? (
                  <p className="py-6 text-center text-sm text-label">
                     Loading events…
                  </p>
               ) : events.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline py-10 text-center">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CalendarDays className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-primary">
                           No events posted yet
                        </p>
                        <p className="mt-1 text-xs text-label">
                           Share a workshop, webinar, or seminar with
                           candidates.
                        </p>
                     </div>
                     <Link
                        to="/post-event"
                        className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                     >
                        <Plus className="h-4 w-4" />
                        Post your first event
                     </Link>
                  </div>
               ) : (
                  <div className="grid gap-4 sm:grid-cols-3">
                     {events.map((ev) => (
                        <div
                           key={ev._id}
                           className="overflow-hidden rounded-xl border border-outline bg-white/70"
                        >
                           {ev.coverImage ? (
                              <img
                                 src={ev.coverImage}
                                 alt={ev.title}
                                 className="h-28 w-full object-cover"
                              />
                           ) : (
                              <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                 <CalendarDays className="h-8 w-8 text-primary/30" />
                              </div>
                           )}
                           <div className="p-3">
                              <div className="flex items-center justify-between gap-2">
                                 <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${EVENT_TYPE_COLORS[ev.eventType] || "bg-neutral text-label"}`}
                                 >
                                    {ev.eventType}
                                 </span>
                                 <StatusBadge
                                    status={ev.isClosed ? "Closed" : "Open"}
                                 />
                              </div>
                              <p className="mt-2 text-sm font-semibold text-primary line-clamp-1">
                                 {ev.title}
                              </p>
                              <div className="mt-1.5 flex items-center justify-between text-xs text-label">
                                 <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3 w-3" />
                                    {formatEventDate(ev.date)}
                                 </span>
                                 <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {ev.registrantCount ?? 0}
                                 </span>
                              </div>
                              <div className="mt-3 flex gap-2">
                                 <Link
                                    to={`/post-event?eventId=${ev._id}`}
                                    className="flex-1 rounded-full border border-outline bg-white py-1 text-center text-xs font-semibold text-primary hover:bg-neutral"
                                 >
                                    Edit
                                 </Link>
                                 <Link
                                    to="/manage-events"
                                    className="flex-1 rounded-full border border-outline bg-white py-1 text-center text-xs font-semibold text-primary hover:bg-neutral"
                                 >
                                    Manage
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </SectionCard>

            {/* Hiring insights */}
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
               <p className="text-sm text-label">Refreshing dashboard…</p>
            )}
         </div>
      </DashboardLayout>
   );
};

export default EmployerDashboard;

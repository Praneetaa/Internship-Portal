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

const formatEventDate = (dateStr) => {
   if (!dateStr) return "—";
   return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   });
};

// Shape the analytics API response for the dashboard widgets.
const EMPTY_OVERVIEW = { stats: null, recentApplications: [], activeRoles: [] };

const trendText = (pct) =>
   pct ? `${pct > 0 ? "+" : ""}${pct}% vs last week` : undefined;

const timeAgo = (value) => {
   if (!value) return "";
   const mins = Math.round((Date.now() - new Date(value).getTime()) / 60000);
   if (mins < 1) return "just now";
   if (mins < 60) return `${mins} min ago`;
   const hours = Math.round(mins / 60);
   if (hours < 24) return `${hours} h ago`;
   const days = Math.round(hours / 24);
   return days === 1 ? "yesterday" : `${days} days ago`;
};

const toOverview = (api) => {
   const counts = api?.counts || {};
   const trends = counts.trends || {};
   const data = api?.data || {};
   return {
      stats: [
         { label: "Active internships", value: counts.totalActiveJobs ?? 0, change: trendText(trends.activeJobs) },
         { label: "Applications", value: counts.totalApplications ?? 0, change: trendText(trends.totalApplication) },
         { label: "Hired", value: counts.totalHired ?? 0, change: trendText(trends.totalHired) },
      ],
      recentApplications: (data.recentApplication || []).map((a) => ({
         id: a._id,
         name: a.applicant?.name || "Applicant",
         role: a.job?.title || "Internship",
         status: a.status,
         time: timeAgo(a.createdAt),
         createdAt: a.createdAt,
      })),
      activeRoles: (data.recentJobs || []).map((j) => ({
         id: j._id,
         title: j.title,
         applicants: j.applicantCount || 0,
         status: j.isClosed ? "Closed" : "Open",
         deadline: j.deadline ? formatEventDate(j.deadline) : "No deadline",
         createdAt: j.createdAt,
      })),
   };
};



const EmployerDashboard = () => {
   const [dashboardData, setDashboardData] = useState(EMPTY_OVERVIEW);
   const [isLoading, setIsLoading] = useState(false);
   const [events, setEvents] = useState([]);
   const [eventsLoading, setEventsLoading] = useState(true);
   const [eventsTotal, setEventsTotal] = useState(0);

   const getDashboardOverView = async () => {
      try {
         setIsLoading(true);
         const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
         if (response.status === 200 && response.data) {
            setDashboardData(toOverview(response.data));
         }
      } catch {
         setDashboardData({ ...EMPTY_OVERVIEW, stats: [] });
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
         setEventsTotal((res.data || []).filter((e) => !e.isClosed && new Date(e.endDate || e.date) >= new Date()).length);
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
                  <h1 className="text-2xl font-semibold text-text">
                     Employer dashboard
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Track internships, events, and applicants all in one place.
                  </p>
               </div>
               <div className="flex flex-wrap gap-3">
                  <Link
                     to="/post-job"
                     className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     <Briefcase className="h-4 w-4" />
                     Post internship
                  </Link>
                  <Link
                     to="/post-event"
                     className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 text-sm font-semibold text-text hover:border-primary/40"
                  >
                     <CalendarDays className="h-4 w-4" />
                     Post event
                  </Link>
                  <Link
                     to="/applications"
                     className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     Manage applicants
                  </Link>
               </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
               {(dashboardData?.stats
                  ? [...dashboardData.stats, { label: "Upcoming events", value: eventsTotal }]
                  : ["Active internships", "Applications", "Hired", "Upcoming events"].map((label) => ({ label, value: "—" }))
               ).map((stat) => (
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
                           className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline bg-white p-4"
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
                           className="rounded-xl border border-outline bg-white p-4"
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
                                 {role.applicants} {role.applicants === 1 ? "applicant" : "applicants"}
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary"
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
                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
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
                        className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
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
                           className="overflow-hidden rounded-xl border border-outline bg-white"
                        >
                           {ev.coverImage ? (
                              <img
                                 src={ev.coverImage}
                                 alt={ev.title}
                                 className="h-28 w-full object-cover"
                              />
                           ) : (
                              <div className="flex h-28 w-full items-center justify-center bg-neutral">
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
                                    className="flex-1 rounded-lg border border-outline bg-white py-1 text-center text-xs font-semibold text-primary hover:bg-neutral"
                                 >
                                    Edit
                                 </Link>
                                 <Link
                                    to="/manage-events"
                                    className="flex-1 rounded-lg border border-outline bg-white py-1 text-center text-xs font-semibold text-primary hover:bg-neutral"
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
                  <div className="rounded-xl border border-outline bg-white p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Views
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-text">
                        4,280
                     </p>
                     <p className="mt-1 text-xs text-label">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        12% higher than last month
                     </p>
                  </div>
                  <div className="rounded-xl border border-outline bg-white p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Conversion
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-text">
                        5.6%
                     </p>
                     <p className="mt-1 text-xs text-label">
                        from view to application
                     </p>
                  </div>
                  <div className="rounded-xl border border-outline bg-white p-4">
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Response time
                     </p>
                     <p className="mt-2 text-2xl font-semibold text-text">
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

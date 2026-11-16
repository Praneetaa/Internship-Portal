import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, CalendarDays, MapPin, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmptyState from "../../components/cards/EmptyState";
import {
   DateStub,
   DeadlineHint,
   OrgTile,
   Tag,
} from "../../components/opportunities/OpportunityCards";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";
import { daysUntil, formatBaht, formatDateTime } from "../../utils/format";

const RemoveButton = ({ onClick, label }) => (
   <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title="Remove from saved"
      className="rounded-lg p-2 text-icon transition-colors hover:bg-neutral hover:text-error"
   >
      <X className="h-4 w-4" />
   </button>
);

const SavedJobs = () => {
   const [tab, setTab] = useState("jobs");
   const [jobs, setJobs] = useState([]);
   const [events, setEvents] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const unwrap = (list, key) =>
         (list || [])
            .filter((item) => item?.[key])
            .map((item) => ({ ...item[key], savedAt: item.createdAt }))
            .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

      Promise.allSettled([
         axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS),
         axiosInstance.get(API_PATHS.EVENTS.GET_SAVED_EVENTS),
      ]).then(([jobsRes, eventsRes]) => {
         setJobs(jobsRes.status === "fulfilled" ? unwrap(jobsRes.value.data, "job") : []);
         setEvents(eventsRes.status === "fulfilled" ? unwrap(eventsRes.value.data, "event") : []);
         setIsLoading(false);
      });
   }, []);

   const unsaveJob = async (id) => {
      setJobs((prev) => prev.filter((j) => j._id !== id));
      try {
         await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(id));
      } catch {
         /* already removed from the list */
      }
   };

   const unsaveEvent = async (id) => {
      setEvents((prev) => prev.filter((e) => e._id !== id));
      try {
         await axiosInstance.delete(API_PATHS.EVENTS.UNSAVE_EVENT(id));
      } catch {
         /* already removed from the list */
      }
   };

   const tabs = [
      { id: "jobs", label: "Internships", count: jobs.length },
      { id: "events", label: "Events", count: events.length },
   ];

   return (
      <DashboardLayout activeMenu="saved-jobs" navItems={NAVIGATION_MENU_APPLICANT}>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-text md:text-3xl">Saved</h1>
               <p className="mt-1 text-sm text-label">
                  Internships and events you've bookmarked to come back to.
               </p>
            </div>

            <div className="border-b border-outline" role="tablist">
               <div className="flex gap-6">
                  {tabs.map((t) => (
                     <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.id}
                        onClick={() => setTab(t.id)}
                        className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                           tab === t.id
                              ? "border-primary text-text"
                              : "border-transparent text-label hover:text-text"
                        }`}
                     >
                        {t.label}
                        <span
                           className={`tabular rounded-md px-1.5 py-0.5 text-xs ${tab === t.id ? "bg-primary text-white" : "bg-neutral text-label"}`}
                        >
                           {t.count}
                        </span>
                     </button>
                  ))}
               </div>
            </div>

            {isLoading ? (
               <div className="py-16 text-center text-sm text-label">Loading…</div>
            ) : tab === "jobs" ? (
               jobs.length === 0 ? (
                  <EmptyState
                     icon={Bookmark}
                     title="No saved internships"
                     description="Tap Save on any internship to keep it here and track its deadline."
                     action={
                        <Link
                           to="/find-jobs"
                           className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                        >
                           Browse internships
                        </Link>
                     }
                  />
               ) : (
                  <ul className="divide-y divide-outline overflow-hidden rounded-xl border border-outline bg-white">
                     {jobs.map((job) => {
                        const company = job.company?.companyName || job.company?.name || "Company";
                        return (
                           <li key={job._id} className="flex items-center gap-4 p-4">
                              <OrgTile name={company} logo={job.company?.companyLogo} />
                              <div className="min-w-0 flex-1">
                                 <Link
                                    to={`/jobs/${job._id}`}
                                    className="block truncate text-sm font-semibold text-text hover:text-primary"
                                 >
                                    {job.title}
                                 </Link>
                                 <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-label">
                                    {company}
                                    {job.location && (
                                       <>
                                          <span aria-hidden="true">·</span>
                                          <MapPin className="h-3 w-3" /> {job.location}
                                       </>
                                    )}
                                 </p>
                                 <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    {job.workMode && <Tag>{job.workMode}</Tag>}
                                    {job.stipend ? (
                                       <span className="tabular text-xs font-medium text-text">
                                          {formatBaht(job.stipend)}/mo
                                       </span>
                                    ) : null}
                                 </div>
                              </div>
                              <div className="hidden sm:block">
                                 {job.isClosed ? <Tag tone="error">Closed</Tag> : <DeadlineHint deadline={job.deadline} />}
                              </div>
                              <Link
                                 to={`/jobs/${job._id}`}
                                 className="hidden rounded-lg border border-outline px-3 py-1.5 text-sm font-semibold text-text hover:border-primary/40 md:inline-block"
                              >
                                 View
                              </Link>
                              <RemoveButton onClick={() => unsaveJob(job._id)} label={`Remove ${job.title}`} />
                           </li>
                        );
                     })}
                  </ul>
               )
            ) : events.length === 0 ? (
               <EmptyState
                  icon={CalendarDays}
                  title="No saved events"
                  description="Save events you're interested in and decide later whether to register."
                  action={
                     <Link
                        to="/events"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                     >
                        Browse events
                     </Link>
                  }
               />
            ) : (
               <ul className="divide-y divide-outline overflow-hidden rounded-xl border border-outline bg-white">
                  {events.map((ev) => {
                     const past = daysUntil(ev.endDate || ev.date) < 0;
                     return (
                        <li key={ev._id} className={`flex items-center gap-4 p-4 ${past ? "opacity-60" : ""}`}>
                           <DateStub date={ev.date} />
                           <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-text">{ev.title}</p>
                              <p className="mt-0.5 truncate text-xs text-label">
                                 {ev.organizer?.companyName || ev.organizer?.name} · {formatDateTime(ev.date)}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                 {ev.eventType && <Tag>{ev.eventType}</Tag>}
                                 {ev.mode && <Tag>{ev.mode}</Tag>}
                                 {past && <Tag>Ended</Tag>}
                              </div>
                           </div>
                           {!past && (
                              <Link
                                 to="/events"
                                 className="hidden rounded-lg border border-outline px-3 py-1.5 text-sm font-semibold text-text hover:border-primary/40 md:inline-block"
                              >
                                 Register
                              </Link>
                           )}
                           <RemoveButton onClick={() => unsaveEvent(ev._id)} label={`Remove ${ev.title}`} />
                        </li>
                     );
                  })}
               </ul>
            )}
         </div>
      </DashboardLayout>
   );
};

export default SavedJobs;

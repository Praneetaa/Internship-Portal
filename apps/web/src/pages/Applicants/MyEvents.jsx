import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ExternalLink, MapPin } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmptyState from "../../components/cards/EmptyState";
import { DateStub, Tag } from "../../components/opportunities/OpportunityCards";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";
import { daysUntil, formatDateTime, relativeDays } from "../../utils/format";

const EventRow = ({ event, past, onCancel, cancelling }) => {
   const organiser = event.organizer?.companyName || event.organizer?.name;
   const soon = !past && daysUntil(event.date) <= 3;
   return (
      <li className={`flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap ${past ? "opacity-60" : ""}`}>
         <DateStub date={event.date} />
         <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text">{event.title}</p>
            <p className="mt-0.5 truncate text-xs text-label">
               {organiser} · {formatDateTime(event.date)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
               {event.eventType && <Tag>{event.eventType}</Tag>}
               <Tag>
                  {event.mode === "Online" ? "Online" : (
                     <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location || event.mode}
                     </span>
                  )}
               </Tag>
               {past ? (
                  <Tag>Attended</Tag>
               ) : (
                  <Tag tone={soon ? "warning" : "success"}>
                     {soon ? `Starts ${relativeDays(event.date)}` : "Registered"}
                  </Tag>
               )}
            </div>
         </div>
         {!past && (
            <div className="flex w-full items-center gap-2 sm:w-auto">
               {event.link && (
                  <a
                     href={event.link}
                     target="_blank"
                     rel="noreferrer"
                     className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     Join link <ExternalLink className="h-3.5 w-3.5" />
                  </a>
               )}
               <button
                  type="button"
                  onClick={onCancel}
                  disabled={cancelling}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-label hover:bg-neutral hover:text-error disabled:opacity-60"
               >
                  {cancelling ? "Cancelling…" : "Cancel"}
               </button>
            </div>
         )}
      </li>
   );
};

const MyEvents = () => {
   const [registrations, setRegistrations] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [cancellingId, setCancellingId] = useState(null);

   useEffect(() => {
      axiosInstance
         .get(API_PATHS.EVENTS.GET_MY_REGISTRATIONS)
         .then((res) => setRegistrations((res.data || []).filter((r) => r.event)))
         .catch(() => setRegistrations([]))
         .finally(() => setIsLoading(false));
   }, []);

   const cancel = async (eventId) => {
      setCancellingId(eventId);
      try {
         await axiosInstance.delete(API_PATHS.EVENTS.UNREGISTER(eventId));
         setRegistrations((prev) => prev.filter((r) => r.event._id !== eventId));
      } catch {
         /* keep it in the list so they can retry */
      } finally {
         setCancellingId(null);
      }
   };

   const events = registrations.map((r) => r.event);
   const upcoming = events
      .filter((e) => daysUntil(e.endDate || e.date) >= 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
   const past = events
      .filter((e) => daysUntil(e.endDate || e.date) < 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

   return (
      <DashboardLayout activeMenu="my-events" navItems={NAVIGATION_MENU_APPLICANT}>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-text md:text-3xl">My events</h1>
               <p className="mt-1 text-sm text-label">
                  Events you've registered for. Join links appear here once you're in.
               </p>
            </div>

            {isLoading ? (
               <div className="py-16 text-center text-sm text-label">Loading…</div>
            ) : events.length === 0 ? (
               <EmptyState
                  icon={CalendarCheck}
                  title="You haven't registered for any events yet"
                  description="Workshops, webinars and career fairs are a great way to meet organisations before you apply."
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
               <>
                  <section>
                     <h2 className="mb-3 text-sm font-semibold text-text">
                        Upcoming <span className="tabular font-normal text-muted">({upcoming.length})</span>
                     </h2>
                     {upcoming.length ? (
                        <ul className="divide-y divide-outline overflow-hidden rounded-xl border border-outline bg-white">
                           {upcoming.map((ev) => (
                              <EventRow
                                 key={ev._id}
                                 event={ev}
                                 onCancel={() => cancel(ev._id)}
                                 cancelling={cancellingId === ev._id}
                              />
                           ))}
                        </ul>
                     ) : (
                        <p className="rounded-xl border border-dashed border-outline bg-white p-6 text-center text-sm text-label">
                           Nothing coming up.{" "}
                           <Link to="/events" className="font-medium text-primary hover:underline">
                              Find an event
                           </Link>
                        </p>
                     )}
                  </section>

                  {past.length > 0 && (
                     <section>
                        <h2 className="mb-3 text-sm font-semibold text-text">
                           Past <span className="tabular font-normal text-muted">({past.length})</span>
                        </h2>
                        <ul className="divide-y divide-outline overflow-hidden rounded-xl border border-outline bg-white">
                           {past.map((ev) => (
                              <EventRow key={ev._id} event={ev} past />
                           ))}
                        </ul>
                     </section>
                  )}
               </>
            )}
         </div>
      </DashboardLayout>
   );
};

export default MyEvents;

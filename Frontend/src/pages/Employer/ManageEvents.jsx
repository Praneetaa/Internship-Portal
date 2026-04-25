import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   CalendarDays,
   MapPin,
   Users,
   Pencil,
   Trash2,
   ToggleLeft,
   ToggleRight,
   Plus,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";

const EVENT_TYPE_COLORS = {
   Workshop: "bg-accent/10 text-accent",
   Webinar: "bg-secondary/15 text-secondary",
   Seminar: "bg-success/10 text-success",
   Networking: "bg-primary/10 text-primary",
   "Career Fair": "bg-error/10 text-error",
   Other: "bg-neutral text-label",
};

const ManageEvents = () => {
   const navigate = useNavigate();
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [deletingId, setDeletingId] = useState(null);
   const [togglingId, setTogglingId] = useState(null);

   const fetchEvents = async () => {
      setLoading(true);
      try {
         const res = await axiosInstance.get(
            API_PATHS.EVENTS.GET_MY_EVENTS_ORG,
         );
         setEvents(res.data || []);
      } catch {
         setEvents([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchEvents();
   }, []);

   const handleDelete = async (id) => {
      if (!window.confirm("Delete this event? This cannot be undone.")) return;
      setDeletingId(id);
      try {
         await axiosInstance.delete(API_PATHS.EVENTS.DELETE_EVENT(id));
         setEvents((prev) => prev.filter((ev) => ev._id !== id));
      } catch {
         // silent
      } finally {
         setDeletingId(null);
      }
   };

   const handleToggle = async (id) => {
      setTogglingId(id);
      try {
         const res = await axiosInstance.put(API_PATHS.EVENTS.TOGGLE_CLOSE(id));
         setEvents((prev) =>
            prev.map((ev) =>
               ev._id === id ? { ...ev, isClosed: res.data.isClosed } : ev,
            ),
         );
      } catch {
         // silent
      } finally {
         setTogglingId(null);
      }
   };

   const formatDate = (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <DashboardLayout activeMenu="manage-events">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-text">
                     Manage events
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     View, edit, and manage all your posted events.
                  </p>
               </div>
               <button
                  type="button"
                  onClick={() => navigate("/post-event")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
               >
                  <Plus className="h-4 w-4" />
                  Post new event
               </button>
            </div>

            {loading ? (
               <div className="py-16 text-center text-sm text-label">
                  Loading events…
               </div>
            ) : events.length === 0 ? (
               <EmptyState
                  title="No events yet"
                  description="Post a workshop, webinar, or seminar to attract candidates."
               />
            ) : (
               <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {events.map((ev) => (
                     <div
                        key={ev._id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-outline bg-white/90 shadow-sm"
                     >
                        {/* Cover image */}
                        {ev.coverImage ? (
                           <img
                              src={ev.coverImage}
                              alt={ev.title}
                              className="h-36 w-full object-cover"
                           />
                        ) : (
                           <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                              <CalendarDays className="h-10 w-10 text-primary/30" />
                           </div>
                        )}

                        <div className="flex flex-1 flex-col gap-3 p-4">
                           {/* Type badge + status */}
                           <div className="flex items-center justify-between gap-2">
                              <span
                                 className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${EVENT_TYPE_COLORS[ev.eventType] || "bg-neutral text-label"}`}
                              >
                                 {ev.eventType}
                              </span>
                              <StatusBadge
                                 status={ev.isClosed ? "Closed" : "Open"}
                              />
                           </div>

                           <div>
                              <p className="text-sm font-semibold text-primary line-clamp-2">
                                 {ev.title}
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-label">
                                 <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {formatDate(ev.date)}
                                 </span>
                                 {ev.location && (
                                    <span className="flex items-center gap-1">
                                       <MapPin className="h-3.5 w-3.5" />
                                       {ev.location}
                                    </span>
                                 )}
                                 <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {ev.registrantCount ?? 0} registered
                                 </span>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="mt-auto flex items-center gap-2 border-t border-outline pt-3">
                              <button
                                 type="button"
                                 onClick={() =>
                                    navigate(`/post-event?eventId=${ev._id}`)
                                 }
                                 className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral"
                              >
                                 <Pencil className="h-3.5 w-3.5" />
                                 Edit
                              </button>
                              <button
                                 type="button"
                                 onClick={() => handleToggle(ev._id)}
                                 disabled={togglingId === ev._id}
                                 className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral disabled:opacity-60"
                              >
                                 {ev.isClosed ? (
                                    <ToggleLeft className="h-3.5 w-3.5" />
                                 ) : (
                                    <ToggleRight className="h-3.5 w-3.5" />
                                 )}
                                 {ev.isClosed ? "Reopen" : "Close"}
                              </button>
                              <button
                                 type="button"
                                 onClick={() => handleDelete(ev._id)}
                                 disabled={deletingId === ev._id}
                                 className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-white px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/5 disabled:opacity-60"
                              >
                                 <Trash2 className="h-3.5 w-3.5" />
                                 Delete
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </DashboardLayout>
   );
};

export default ManageEvents;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
   Bookmark,
   BookmarkCheck,
   CalendarDays,
   Filter,
   LayoutGrid,
   List,
   MapPin,
   Search,
   Users,
   Video,
   Wifi,
   Building2,
   CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";
import {
   CATEGORIES,
   NAVIGATION_MENU_APPLICANT,
   EVENT_TYPES,
} from "../../utils/data";

const workModeOptions = ["Remote", "Hybrid", "On-site"];
const eventModeOptions = ["Online", "In-Person", "Hybrid"];

const EVENT_TYPE_COLORS = {
   Workshop: "bg-accent/10 text-accent",
   Webinar: "bg-secondary/15 text-secondary",
   Seminar: "bg-success/10 text-success",
   Networking: "bg-primary/10 text-primary",
   "Career Fair": "bg-error/10 text-error",
   Other: "bg-neutral text-label",
};

const ModeIcon = ({ mode }) => {
   if (mode === "Online") return <Wifi className="h-3.5 w-3.5" />;
   if (mode === "In-Person") return <Building2 className="h-3.5 w-3.5" />;
   return <Video className="h-3.5 w-3.5" />;
};

const formatEventDate = (dateStr) => {
   if (!dateStr) return "—";
   return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   });
};

// ─────────────────────────────────────────────
// JOBS TAB
// ─────────────────────────────────────────────
const JobsTab = ({ user, updateUser }) => {
   const [jobs, setJobs] = useState([]);
   const [query, setQuery] = useState("");
   const [viewMode, setViewMode] = useState("grid");
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [selectedWorkModes, setSelectedWorkModes] = useState([]);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [isSaving, setIsSaving] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMessage, setResumeMessage] = useState("");
   const [categoryOpen, setCategoryOpen] = useState(false);
   const [workModeOpen, setWorkModeOpen] = useState(false);

   const getId = (job) => job._id || job.id;

   useEffect(() => {
      if (!user) return;
      axiosInstance
         .get(API_PATHS.JOBS.GET_ALL_JOBS, {
            params: { userId: user._id || user.id },
         })
         .then((res) => {
            const sorted = (res.data || []).sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setJobs(sorted);
            setSelectedJobId(sorted[0] ? getId(sorted[0]) : null);
         })
         .catch(() => setJobs([]));
   }, [user]);

   const filteredJobs = useMemo(() => {
      return jobs
         .filter((job) => {
            const matchQ = job.title
               .toLowerCase()
               .includes(query.toLowerCase());
            const matchM =
               selectedWorkModes.length === 0 ||
               selectedWorkModes.includes(job.workMode);
            const matchC =
               selectedCategories.length === 0 ||
               selectedCategories.includes(job.category);
            return matchQ && matchM && matchC;
         })
         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
   }, [jobs, query, selectedWorkModes, selectedCategories]);

   useEffect(() => {
      if (!selectedJobId && filteredJobs.length)
         setSelectedJobId(getId(filteredJobs[0]));
   }, [filteredJobs, selectedJobId]);

   const selectedJob = filteredJobs.find((j) => getId(j) === selectedJobId);

   const toggleFilter = (setter) => (val) =>
      setter((prev) =>
         prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val],
      );

   const handleSave = async (job) => {
      const id = getId(job);
      setIsSaving(true);
      setJobs((prev) =>
         prev.map((j) => (getId(j) === id ? { ...j, isSaved: !j.isSaved } : j)),
      );
      try {
         if (job.isSaved)
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(id));
         else await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(id));
      } catch {
         setJobs((prev) =>
            prev.map((j) =>
               getId(j) === id ? { ...j, isSaved: !j.isSaved } : j,
            ),
         );
      } finally {
         setIsSaving(false);
      }
   };

   const handleApply = async (job) => {
      const id = getId(job);
      if (!user?.resume) {
         setResumeMessage("Please upload a resume before applying.");
         return;
      }
      setIsApplying(true);
      try {
         await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(id));
         setJobs((prev) =>
            prev.map((j) =>
               getId(j) === id ? { ...j, applicationStatus: "Applied" } : j,
            ),
         );
      } catch (err) {
         if (err?.response?.status === 400) {
            setJobs((prev) =>
               prev.map((j) =>
                  getId(j) === id ? { ...j, applicationStatus: "Applied" } : j,
               ),
            );
         }
      } finally {
         setIsApplying(false);
      }
   };

   const handleResumeUpload = async () => {
      if (!resumeFile) {
         setResumeMessage("Please select a PDF file.");
         return;
      }
      if (resumeFile.type !== "application/pdf") {
         setResumeMessage("Resume must be a PDF.");
         return;
      }
      setResumeUploading(true);
      setResumeMessage("");
      try {
         const res = await uploadImage(resumeFile);
         const url = res?.imageUrl;
         if (!url) {
            setResumeMessage("Upload failed. Please try again.");
            return;
         }
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            resume: url,
         });
         updateUser({ resume: url });
         setResumeMessage("Resume uploaded successfully.");
      } catch {
         setResumeMessage("Unable to upload resume right now.");
      } finally {
         setResumeUploading(false);
      }
   };

   return (
      <div className="space-y-5">
         {/* Search & filter bar */}
         <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-outline bg-white/90 p-4 shadow-sm">
            <div className="relative flex-1 min-w-[180px]">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
               <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles…"
                  className="w-full rounded-xl border border-outline bg-white pl-9 pr-4 py-2 text-sm text-paragraph outline-none transition-all hover:border-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
               />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-outline bg-white p-1">
               <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-1.5 transition ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-icon hover:bg-neutral"}`}
               >
                  <LayoutGrid className="h-4 w-4" />
               </button>
               <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-1.5 transition ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-icon hover:bg-neutral"}`}
               >
                  <List className="h-4 w-4" />
               </button>
            </div>

            {/* Work mode filter */}
            <div className="relative">
               <button
                  type="button"
                  onClick={() => setWorkModeOpen((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
               >
                  <Filter className="h-4 w-4 text-icon" />
                  Work mode
                  {selectedWorkModes.length > 0 && (
                     <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {selectedWorkModes.length}
                     </span>
                  )}
               </button>
               {workModeOpen && (
                  <div className="absolute z-30 mt-2 w-44 rounded-xl border border-outline bg-white p-3 shadow-sm">
                     {workModeOptions.map((m) => (
                        <label
                           key={m}
                           className="flex cursor-pointer items-center gap-2 py-1 text-sm text-label"
                        >
                           <input
                              type="checkbox"
                              checked={selectedWorkModes.includes(m)}
                              onChange={() =>
                                 toggleFilter(setSelectedWorkModes)(m)
                              }
                           />
                           {m}
                        </label>
                     ))}
                  </div>
               )}
            </div>

            {/* Category filter */}
            <div className="relative">
               <button
                  type="button"
                  onClick={() => setCategoryOpen((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
               >
                  <Filter className="h-4 w-4 text-icon" />
                  Category
                  {selectedCategories.length > 0 && (
                     <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {selectedCategories.length}
                     </span>
                  )}
               </button>
               {categoryOpen && (
                  <div className="absolute z-30 mt-2 max-h-60 w-56 overflow-auto rounded-xl border border-outline bg-white p-3 shadow-sm">
                     {CATEGORIES.map((cat) => (
                        <label
                           key={cat.value}
                           className="flex cursor-pointer items-center gap-2 py-1 text-sm text-label"
                        >
                           <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.value)}
                              onChange={() =>
                                 toggleFilter(setSelectedCategories)(cat.value)
                              }
                           />
                           {cat.label}
                        </label>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Main split layout */}
         {filteredJobs.length === 0 ? (
            <EmptyState
               title="No matches yet"
               description="Try a different keyword or remove filters."
            />
         ) : (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
               {/* Job cards */}
               <div
                  className={`grid gap-3 ${viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"}`}
               >
                  {filteredJobs.map((job) => {
                     const id = getId(job);
                     const isSelected = id === selectedJobId;
                     return (
                        <button
                           key={id}
                           type="button"
                           onClick={() => setSelectedJobId(id)}
                           className={`group rounded-2xl border p-4 text-left transition ${
                              isSelected
                                 ? "border-primary bg-primary/5 shadow-sm"
                                 : "border-outline bg-white/80 hover:border-primary/40 hover:shadow-sm"
                           }`}
                        >
                           <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-sm font-bold text-primary">
                                 {(job.company?.companyName ||
                                    job.company?.name ||
                                    "C")[0].toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <p className="truncate text-sm font-semibold text-primary">
                                    {job.title}
                                 </p>
                                 <p className="truncate text-xs text-label">
                                    {job.company?.companyName || "Company"} ·{" "}
                                    {job.location}
                                 </p>
                              </div>
                              {job.applicationStatus && (
                                 <StatusBadge status={job.applicationStatus} />
                              )}
                           </div>
                           <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                 {job.workMode}
                              </span>
                              {job.category && (
                                 <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                    {job.category}
                                 </span>
                              )}
                              {job.stipend && (
                                 <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs text-success">
                                    ฿{job.stipend}/mo
                                 </span>
                              )}
                           </div>
                           {job.isSaved && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-accent">
                                 <BookmarkCheck className="h-3.5 w-3.5" /> Saved
                              </div>
                           )}
                        </button>
                     );
                  })}
               </div>

               {/* Detail panel */}
               <div className="lg:sticky lg:top-28">
                  {selectedJob ? (
                     <SectionCard
                        title={selectedJob.title}
                        subtitle={`${selectedJob.company?.companyName || "Company"} · ${selectedJob.location}`}
                        action={
                           <Link
                              to={`/jobs/${getId(selectedJob)}`}
                              className="text-sm font-semibold text-primary"
                           >
                              Full view →
                           </Link>
                        }
                     >
                        <div className="flex flex-wrap gap-2">
                           <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                              {selectedJob.workMode}
                           </span>
                           {selectedJob.duration && (
                              <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                 {selectedJob.duration}
                              </span>
                           )}
                           {selectedJob.category && (
                              <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label">
                                 {selectedJob.category}
                              </span>
                           )}
                        </div>

                        {selectedJob.applicationStatus && (
                           <div className="mt-4">
                              <StatusBadge
                                 status={selectedJob.applicationStatus}
                              />
                           </div>
                        )}

                        <p className="mt-4 text-sm text-paragraph">
                           {selectedJob.description}
                        </p>

                        {selectedJob.requirements && (
                           <div className="mt-4 text-sm text-paragraph">
                              <span className="font-semibold text-primary">
                                 Requirements:{" "}
                              </span>
                              {selectedJob.requirements}
                           </div>
                        )}
                        {selectedJob.responsibilities && (
                           <div className="mt-2 text-sm text-paragraph">
                              <span className="font-semibold text-primary">
                                 Responsibilities:{" "}
                              </span>
                              {selectedJob.responsibilities}
                           </div>
                        )}

                        {!user?.resume && (
                           <div className="mt-5 w-full rounded-xl border border-outline bg-neutral/50 p-4">
                              <p className="text-sm font-semibold text-primary">
                                 Upload your resume to apply
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                 <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                       setResumeFile(
                                          e.target.files?.[0] || null,
                                       )
                                    }
                                    className="text-xs"
                                 />
                                 <button
                                    type="button"
                                    onClick={handleResumeUpload}
                                    disabled={resumeUploading}
                                    className="rounded-full border border-outline bg-white px-4 py-1.5 text-xs font-semibold text-primary hover:bg-neutral disabled:opacity-60"
                                 >
                                    {resumeUploading
                                       ? "Uploading…"
                                       : "Upload PDF"}
                                 </button>
                              </div>
                              {resumeMessage && (
                                 <p className="mt-2 text-xs text-label">
                                    {resumeMessage}
                                 </p>
                              )}
                           </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                           <button
                              type="button"
                              onClick={() => handleApply(selectedJob)}
                              disabled={
                                 isApplying ||
                                 !!selectedJob.applicationStatus ||
                                 !user?.resume
                              }
                              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
                           >
                              {selectedJob.applicationStatus
                                 ? "Applied"
                                 : "Apply now"}
                           </button>
                           <button
                              type="button"
                              onClick={() => handleSave(selectedJob)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                           >
                              {selectedJob.isSaved ? (
                                 <BookmarkCheck className="h-4 w-4" />
                              ) : (
                                 <Bookmark className="h-4 w-4" />
                              )}
                              {selectedJob.isSaved ? "Saved" : "Save"}
                           </button>
                        </div>
                     </SectionCard>
                  ) : (
                     <EmptyState
                        title="Select a role"
                        description="Choose an internship to preview details here."
                     />
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

// ─────────────────────────────────────────────
// EVENTS TAB
// ─────────────────────────────────────────────
const EventsTab = ({ user }) => {
   const [events, setEvents] = useState([]);
   const [query, setQuery] = useState("");
   const [selectedType, setSelectedType] = useState("");
   const [selectedMode, setSelectedMode] = useState("");
   const [typeOpen, setTypeOpen] = useState(false);
   const [modeOpen, setModeOpen] = useState(false);
   const [selectedEvent, setSelectedEvent] = useState(null);
   const [isRegistering, setIsRegistering] = useState(false);
   const [loading, setLoading] = useState(true);

   const fetchEvents = async () => {
      setLoading(true);
      try {
         const res = await axiosInstance.get(API_PATHS.EVENTS.GET_ALL_EVENTS, {
            params: {
               keyword: query || undefined,
               eventType: selectedType || undefined,
               mode: selectedMode || undefined,
               userId: user?._id || user?.id,
            },
         });
         const sorted = (res.data || []).sort(
            (a, b) => new Date(a.date) - new Date(b.date),
         );
         setEvents(sorted);
         if (!selectedEvent && sorted.length) setSelectedEvent(sorted[0]);
      } catch {
         setEvents([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user) fetchEvents();
   }, [user, query, selectedType, selectedMode]);

   const handleRegister = async (ev) => {
      if (isRegistering) return;
      setIsRegistering(true);
      const wasRegistered = ev.isRegistered;
      try {
         if (wasRegistered) {
            await axiosInstance.delete(API_PATHS.EVENTS.UNREGISTER(ev._id));
         } else {
            await axiosInstance.post(API_PATHS.EVENTS.REGISTER(ev._id));
         }
         const update = (e) =>
            e._id === ev._id
               ? {
                    ...e,
                    isRegistered: !wasRegistered,
                    registrantCount:
                       (e.registrantCount || 0) + (wasRegistered ? -1 : 1),
                 }
               : e;
         setEvents((prev) => prev.map(update));
         setSelectedEvent((prev) =>
            prev?._id === ev._id ? update(prev) : prev,
         );
      } catch {
         // silent
      } finally {
         setIsRegistering(false);
      }
   };

   const isFull = (ev) => ev.seats && (ev.registrantCount || 0) >= ev.seats;

   return (
      <div className="space-y-5">
         {/* Filter bar */}
         <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-outline bg-white/90 p-4 shadow-sm">
            <div className="relative flex-1 min-w-[180px]">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
               <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events…"
                  className="w-full rounded-xl border border-outline bg-white pl-9 pr-4 py-2 text-sm text-paragraph outline-none transition-all hover:border-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
               />
            </div>

            {/* Event type filter */}
            <div className="relative">
               <button
                  type="button"
                  onClick={() => setTypeOpen((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
               >
                  <Filter className="h-4 w-4 text-icon" />
                  {selectedType || "Event type"}
                  {selectedType && (
                     <span
                        onClick={(e) => {
                           e.stopPropagation();
                           setSelectedType("");
                        }}
                        className="ml-1 cursor-pointer rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                     >
                        ×
                     </span>
                  )}
               </button>
               {typeOpen && (
                  <div className="absolute z-30 mt-2 w-48 rounded-xl border border-outline bg-white p-2 shadow-sm">
                     {EVENT_TYPES.map((t) => (
                        <button
                           key={t.value}
                           type="button"
                           onClick={() => {
                              setSelectedType(
                                 t.value === selectedType ? "" : t.value,
                              );
                              setTypeOpen(false);
                           }}
                           className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition ${selectedType === t.value ? "bg-primary/10 text-primary" : "text-label hover:bg-neutral"}`}
                        >
                           {t.label}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* Mode filter */}
            <div className="relative">
               <button
                  type="button"
                  onClick={() => setModeOpen((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm text-paragraph hover:bg-neutral"
               >
                  <Filter className="h-4 w-4 text-icon" />
                  {selectedMode || "Mode"}
                  {selectedMode && (
                     <span
                        onClick={(e) => {
                           e.stopPropagation();
                           setSelectedMode("");
                        }}
                        className="ml-1 cursor-pointer rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                     >
                        ×
                     </span>
                  )}
               </button>
               {modeOpen && (
                  <div className="absolute z-30 mt-2 w-44 rounded-xl border border-outline bg-white p-2 shadow-sm">
                     {eventModeOptions.map((m) => (
                        <button
                           key={m}
                           type="button"
                           onClick={() => {
                              setSelectedMode(m === selectedMode ? "" : m);
                              setModeOpen(false);
                           }}
                           className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition ${selectedMode === m ? "bg-primary/10 text-primary" : "text-label hover:bg-neutral"}`}
                        >
                           {m}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {loading ? (
            <div className="py-20 text-center text-sm text-label">
               Loading events…
            </div>
         ) : events.length === 0 ? (
            <EmptyState
               title="No events found"
               description="Check back soon for workshops, webinars, and more."
            />
         ) : (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
               {/* Event cards */}
               <div className="grid gap-3 sm:grid-cols-2">
                  {events.map((ev) => {
                     const full = isFull(ev);
                     const isSelected = selectedEvent?._id === ev._id;
                     return (
                        <button
                           key={ev._id}
                           type="button"
                           onClick={() => setSelectedEvent(ev)}
                           className={`group overflow-hidden rounded-2xl border text-left transition ${
                              isSelected
                                 ? "border-primary bg-primary/5 shadow-sm"
                                 : "border-outline bg-white/80 hover:border-primary/40 hover:shadow-sm"
                           }`}
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

                           <div className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                 <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${EVENT_TYPE_COLORS[ev.eventType] || "bg-neutral text-label"}`}
                                 >
                                    {ev.eventType}
                                 </span>
                                 {ev.isRegistered && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                                       <CheckCircle2 className="h-3 w-3" />{" "}
                                       Registered
                                    </span>
                                 )}
                              </div>

                              <p className="mt-2 text-sm font-semibold text-primary line-clamp-2">
                                 {ev.title}
                              </p>
                              <p className="mt-1 text-xs text-label">
                                 {ev.organizer?.companyName ||
                                    ev.organizer?.name}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-label">
                                 <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {formatEventDate(ev.date)}
                                 </span>
                                 <span className="flex items-center gap-1">
                                    <ModeIcon mode={ev.mode} />
                                    {ev.mode}
                                 </span>
                              </div>

                              {full && !ev.isRegistered && (
                                 <span className="mt-2 inline-block rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-semibold text-error">
                                    Full
                                 </span>
                              )}
                           </div>
                        </button>
                     );
                  })}
               </div>

               {/* Event detail panel */}
               <div className="lg:sticky lg:top-28">
                  {selectedEvent ? (
                     <div className="overflow-hidden rounded-2xl border border-outline bg-white/90 shadow-sm">
                        {selectedEvent.coverImage ? (
                           <img
                              src={selectedEvent.coverImage}
                              alt={selectedEvent.title}
                              className="h-44 w-full object-cover"
                           />
                        ) : (
                           <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                              <CalendarDays className="h-12 w-12 text-primary/30" />
                           </div>
                        )}

                        <div className="p-5 space-y-4">
                           <div className="flex items-start justify-between gap-3">
                              <div>
                                 <h3 className="text-lg font-semibold text-primary">
                                    {selectedEvent.title}
                                 </h3>
                                 <p className="text-sm text-label">
                                    {selectedEvent.organizer?.companyName ||
                                       selectedEvent.organizer?.name}
                                 </p>
                              </div>
                              <span
                                 className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${EVENT_TYPE_COLORS[selectedEvent.eventType] || "bg-neutral text-label"}`}
                              >
                                 {selectedEvent.eventType}
                              </span>
                           </div>

                           {/* Meta grid */}
                           <div className="grid grid-cols-2 gap-3 rounded-xl bg-neutral/60 p-3 text-xs">
                              <div>
                                 <p className="font-semibold text-primary">
                                    Date
                                 </p>
                                 <p className="mt-0.5 text-label">
                                    {formatEventDate(selectedEvent.date)}
                                 </p>
                              </div>
                              <div>
                                 <p className="font-semibold text-primary">
                                    Mode
                                 </p>
                                 <p className="mt-0.5 flex items-center gap-1 text-label">
                                    <ModeIcon mode={selectedEvent.mode} />{" "}
                                    {selectedEvent.mode}
                                 </p>
                              </div>
                              {selectedEvent.location && (
                                 <div>
                                    <p className="font-semibold text-primary">
                                       Location
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-label">
                                       <MapPin className="h-3 w-3" />{" "}
                                       {selectedEvent.location}
                                    </p>
                                 </div>
                              )}
                              {selectedEvent.seats && (
                                 <div>
                                    <p className="font-semibold text-primary">
                                       Seats
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-label">
                                       <Users className="h-3 w-3" />
                                       {selectedEvent.registrantCount ||
                                          0} / {selectedEvent.seats}
                                    </p>
                                 </div>
                              )}
                              {selectedEvent.deadline && (
                                 <div>
                                    <p className="font-semibold text-primary">
                                       Register by
                                    </p>
                                    <p className="mt-0.5 text-label">
                                       {new Date(
                                          selectedEvent.deadline,
                                       ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                       })}
                                    </p>
                                 </div>
                              )}
                           </div>

                           <p className="text-sm text-paragraph">
                              {selectedEvent.description}
                           </p>

                           {selectedEvent.tags && (
                              <div className="flex flex-wrap gap-2">
                                 {selectedEvent.tags.split(",").map((t) => (
                                    <span
                                       key={t}
                                       className="rounded-full bg-neutral px-2.5 py-0.5 text-xs text-label"
                                    >
                                       {t.trim()}
                                    </span>
                                 ))}
                              </div>
                           )}

                           {selectedEvent.link && (
                              <a
                                 href={selectedEvent.link}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="block text-sm font-semibold text-accent underline underline-offset-2"
                              >
                                 Join online →
                              </a>
                           )}

                           {!selectedEvent.isClosed && (
                              <div className="flex items-center gap-3 border-t border-outline pt-4">
                                 {selectedEvent.isRegistered ? (
                                    <>
                                       <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                                          <CheckCircle2 className="h-4 w-4" />
                                          Registered
                                       </div>
                                       <button
                                          type="button"
                                          onClick={() =>
                                             handleRegister(selectedEvent)
                                          }
                                          disabled={isRegistering}
                                          className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-label hover:bg-neutral disabled:opacity-60"
                                       >
                                          Cancel registration
                                       </button>
                                    </>
                                 ) : isFull(selectedEvent) ? (
                                    <span className="rounded-full bg-error/10 px-4 py-2 text-sm font-semibold text-error">
                                       Event full
                                    </span>
                                 ) : (
                                    <button
                                       type="button"
                                       onClick={() =>
                                          handleRegister(selectedEvent)
                                       }
                                       disabled={isRegistering}
                                       className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
                                    >
                                       {isRegistering
                                          ? "Registering…"
                                          : "Register now"}
                                    </button>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>
                  ) : (
                     <EmptyState
                        title="Select an event"
                        description="Choose an event to see full details here."
                     />
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
const ApplicantsDashboard = () => {
   const { user, updateUser } = useAuth();
   const [activeTab, setActiveTab] = useState("jobs");

   const tabs = [
      { id: "jobs", label: "Internships" },
      { id: "events", label: "Events" },
   ];

   return (
      <DashboardLayout
         activeMenu="find-jobs"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                     {activeTab === "jobs" ? "Internships" : "Events"}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-text">
                     {activeTab === "jobs"
                        ? "Find internships"
                        : "Explore events"}
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     {activeTab === "jobs"
                        ? "Browse open roles and apply directly."
                        : "Discover workshops, webinars, and career events near you."}
                  </p>
               </div>

               {/* Tab switcher */}
               <div className="flex gap-1 rounded-xl border border-outline/60 bg-white p-1 shadow-sm">
                  {tabs.map((tab) => (
                     <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                           activeTab === tab.id
                              ? "bg-primary text-white shadow-sm"
                              : "text-label hover:text-text"
                        }`}
                     >
                        {tab.label}
                     </button>
                  ))}
               </div>
            </div>

            {activeTab === "jobs" ? (
               <JobsTab user={user} updateUser={updateUser} />
            ) : (
               <EventsTab user={user} />
            )}
         </div>
      </DashboardLayout>
   );
};

export default ApplicantsDashboard;

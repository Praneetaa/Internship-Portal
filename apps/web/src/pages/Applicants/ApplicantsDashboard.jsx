import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
   ArrowRight,
   Bookmark,
   BookmarkCheck,
   Briefcase,
   CalendarDays,
   CheckCircle2,
   ChevronDown,
   Clock,
   ExternalLink,
   MapPin,
   Search,
   SlidersHorizontal,
   Upload,
   Users,
   X,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/cards/StatusBadge";
import EmptyState from "../../components/cards/EmptyState";
import {
   DateStub,
   DeadlineHint,
   EventCard,
   JobCard,
   OrgTile,
   SeatsBar,
   Tag,
} from "../../components/opportunities/OpportunityCards";
import {
   CATEGORIES,
   EVENT_TYPES,
   NAVIGATION_MENU_APPLICANT,
} from "../../utils/data";
import {
   daysUntil,
   formatBaht,
   formatDate,
   formatDateTime,
   relativeDays,
} from "../../utils/format";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const EVENT_MODES = ["Online", "In-Person", "Hybrid"];

const getId = (item) => item?._id || item?.id;

// ─────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────

/** Toggle chip used for quick filters (work mode, event mode). */
const FilterChip = ({ active, onClick, children }) => (
   <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
         active
            ? "border-primary bg-primary text-white"
            : "border-outline bg-white text-paragraph hover:border-primary/40"
      }`}
   >
      {children}
   </button>
);

/** Small dropdown for longer option lists (category, event type). */
const FilterMenu = ({ label, options, selected, onToggle, multiple = true }) => {
   const [open, setOpen] = useState(false);
   const ref = useRef(null);
   useEffect(() => {
      const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
   }, []);
   const count = multiple ? selected.length : selected ? 1 : 0;
   return (
      <div className="relative" ref={ref}>
         <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
               count
                  ? "border-primary/40 bg-primary/[0.05] text-primary"
                  : "border-outline bg-white text-paragraph hover:border-primary/40"
            }`}
         >
            {label}
            {multiple && count > 0 && (
               <span className="tabular rounded bg-primary px-1.5 text-xs text-white">
                  {count}
               </span>
            )}
            <ChevronDown className="h-4 w-4 text-icon" />
         </button>
         {open && (
            <div className="absolute right-0 z-30 mt-2 max-h-72 w-56 overflow-auto rounded-xl border border-outline bg-white p-1.5 shadow-[0_8px_24px_rgba(16,26,58,0.08)]">
               {options.map((opt) => {
                  const isOn = multiple
                     ? selected.includes(opt.value)
                     : selected === opt.value;
                  return (
                     <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                           onToggle(opt.value);
                           if (!multiple) setOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                           isOn ? "bg-primary/[0.06] text-primary" : "text-paragraph hover:bg-neutral"
                        }`}
                     >
                        {opt.label}
                        {isOn && <CheckCircle2 className="h-4 w-4" />}
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};

const SearchBox = ({ value, onChange, placeholder }) => (
   <div className="relative min-w-[200px] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
      <input
         type="search"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         aria-label={placeholder}
         className="w-full rounded-lg border border-outline bg-white py-2 pl-9 pr-3 text-sm text-text outline-none placeholder:text-icon focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
   </div>
);

const ResultsLine = ({ shown, total, noun, onClear, hasFilters }) => (
   <div className="flex items-center justify-between text-sm text-label">
      <span className="tabular">
         Showing {shown} of {total} {noun}
      </span>
      {hasFilters ? (
         <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
         >
            <X className="h-3.5 w-3.5" /> Clear filters
         </button>
      ) : null}
   </div>
);

/** On small screens, bring the detail panel into view after picking a card. */
const useScrollDetailOnMobile = () => {
   const ref = useRef(null);
   const scroll = () => {
      if (window.matchMedia("(max-width: 1023px)").matches)
         setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
   };
   return [ref, scroll];
};

const DetailRow = ({ icon, label, children }) => {
   const Icon = icon;
   return (
   <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-icon" />
      <div className="min-w-0">
         <p className="text-xs text-muted">{label}</p>
         <p className="text-sm text-text">{children}</p>
      </div>
   </div>
   );
};

// ─────────────────────────────────────────────
// "Coming up" strip
// ─────────────────────────────────────────────
const ComingUp = ({ jobs, registrations, onOpenTab }) => {
   const nextEvent = registrations
      .map((r) => r.event)
      .filter((ev) => ev && daysUntil(ev.date) >= 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

   const nextDeadline = jobs
      .filter((j) => j.isSaved && !j.applicationStatus && j.deadline && daysUntil(j.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

   const applied = jobs.filter((j) => j.applicationStatus).length;

   return (
      <div className="grid gap-3 md:grid-cols-3">
         <button
            type="button"
            onClick={() => onOpenTab("events")}
            className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4 text-left transition-colors hover:border-primary/40"
         >
            {nextEvent ? (
               <>
                  <DateStub date={nextEvent.date} />
                  <div className="min-w-0">
                     <p className="text-xs font-medium text-muted">
                        Your next event · {relativeDays(nextEvent.date)}
                     </p>
                     <p className="truncate text-sm font-semibold text-text">{nextEvent.title}</p>
                  </div>
               </>
            ) : (
               <>
                  <CalendarDays className="h-5 w-5 flex-shrink-0 text-icon" />
                  <div>
                     <p className="text-xs font-medium text-muted">No upcoming events</p>
                     <p className="text-sm font-semibold text-text">Browse career events</p>
                  </div>
               </>
            )}
         </button>

         <Link
            to="/saved-jobs"
            className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4 transition-colors hover:border-primary/40"
         >
            <Clock className={`h-5 w-5 flex-shrink-0 ${nextDeadline ? "text-warning" : "text-icon"}`} />
            <div className="min-w-0">
               <p className="text-xs font-medium text-muted">
                  {nextDeadline
                     ? `Saved role closes ${relativeDays(nextDeadline.deadline)}`
                     : "No saved deadlines"}
               </p>
               <p className="truncate text-sm font-semibold text-text">
                  {nextDeadline ? nextDeadline.title : "Save roles to track deadlines"}
               </p>
            </div>
         </Link>

         <Link
            to="/my-applications"
            className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4 transition-colors hover:border-primary/40"
         >
            <Briefcase className="h-5 w-5 flex-shrink-0 text-icon" />
            <div>
               <p className="text-xs font-medium text-muted">Applications</p>
               <p className="text-sm font-semibold text-text">
                  <span className="tabular">{applied}</span> sent · track status
               </p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-icon" />
         </Link>
      </div>
   );
};

// ─────────────────────────────────────────────
// INTERNSHIPS TAB
// ─────────────────────────────────────────────
const JobsTab = ({ jobs, setJobs, user, updateUser }) => {
   const [query, setQuery] = useState("");
   const [categories, setCategories] = useState([]);
   const [workModes, setWorkModes] = useState([]);
   const [selectedId, setSelectedId] = useState(null);
   const [isSaving, setIsSaving] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [resumeFile, setResumeFile] = useState(null);
   const [resumeUploading, setResumeUploading] = useState(false);
   const [resumeMessage, setResumeMessage] = useState("");
   const [detailRef, scrollToDetail] = useScrollDetailOnMobile();

   const toggle = (setter) => (val) =>
      setter((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return jobs.filter((job) => {
         const company = (job.company?.companyName || "").toLowerCase();
         const matchQ =
            !q ||
            job.title?.toLowerCase().includes(q) ||
            company.includes(q) ||
            job.location?.toLowerCase().includes(q);
         const matchM = !workModes.length || workModes.includes(job.workMode);
         const matchC = !categories.length || categories.includes(job.category);
         return matchQ && matchM && matchC;
      });
   }, [jobs, query, workModes, categories]);

   useEffect(() => {
      if (!filtered.some((j) => getId(j) === selectedId))
         setSelectedId(filtered[0] ? getId(filtered[0]) : null);
   }, [filtered, selectedId]);

   const selected = filtered.find((j) => getId(j) === selectedId);
   const hasFilters = query || workModes.length || categories.length;

   const handleSave = async (job) => {
      const id = getId(job);
      setIsSaving(true);
      const flip = (list) => list.map((j) => (getId(j) === id ? { ...j, isSaved: !j.isSaved } : j));
      setJobs(flip);
      try {
         if (job.isSaved) await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(id));
         else await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(id));
      } catch {
         setJobs(flip);
      } finally {
         setIsSaving(false);
      }
   };

   const handleApply = async (job) => {
      const id = getId(job);
      if (!user?.resume) {
         setResumeMessage("Upload your resume first, then apply.");
         return;
      }
      setIsApplying(true);
      const markApplied = (list) =>
         list.map((j) => (getId(j) === id ? { ...j, applicationStatus: "Applied" } : j));
      try {
         await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(id));
         setJobs(markApplied);
      } catch (err) {
         if (err?.response?.status === 400) setJobs(markApplied);
      } finally {
         setIsApplying(false);
      }
   };

   const handleResumeUpload = async () => {
      if (!resumeFile) return setResumeMessage("Choose a PDF file first.");
      if (resumeFile.type !== "application/pdf")
         return setResumeMessage("Your resume must be a PDF.");
      setResumeUploading(true);
      setResumeMessage("");
      try {
         const res = await uploadImage(resumeFile);
         const url = res?.imageUrl;
         if (!url) return setResumeMessage("Upload failed. Please try again.");
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, { resume: url });
         updateUser({ resume: url });
         setResumeMessage("Resume uploaded. You can apply now.");
      } catch {
         setResumeMessage("We couldn't upload your resume right now.");
      } finally {
         setResumeUploading(false);
      }
   };

   const company = selected?.company?.companyName || selected?.company?.name || "Company";

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap items-center gap-2">
            <SearchBox
               value={query}
               onChange={setQuery}
               placeholder="Search by role, company or city"
            />
            {WORK_MODES.map((m) => (
               <FilterChip key={m} active={workModes.includes(m)} onClick={() => toggle(setWorkModes)(m)}>
                  {m}
               </FilterChip>
            ))}
            <FilterMenu
               label="Category"
               options={CATEGORIES}
               selected={categories}
               onToggle={toggle(setCategories)}
            />
         </div>

         <ResultsLine
            shown={filtered.length}
            total={jobs.length}
            noun={jobs.length === 1 ? "internship" : "internships"}
            hasFilters={hasFilters}
            onClear={() => {
               setQuery("");
               setWorkModes([]);
               setCategories([]);
            }}
         />

         {filtered.length === 0 ? (
            <EmptyState
               icon={SlidersHorizontal}
               title="No internships match"
               description="Try another keyword or remove a filter."
            />
         ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {filtered.map((job) => (
                     <JobCard
                        key={getId(job)}
                        job={job}
                        selected={getId(job) === selectedId}
                        onClick={() => {
                           setSelectedId(getId(job));
                           scrollToDetail();
                        }}
                     />
                  ))}
               </div>

               {selected && (
                  <aside ref={detailRef} className="scroll-mt-20 lg:sticky lg:top-24">
                     <div className="rounded-xl border border-outline bg-white">
                        <div className="border-b border-outline p-5">
                           <div className="flex items-start gap-3">
                              <OrgTile name={company} logo={selected.company?.companyLogo} size="h-12 w-12 text-base" />
                              <div className="min-w-0 flex-1">
                                 <h2 className="text-lg font-semibold text-text">{selected.title}</h2>
                                 <p className="text-sm text-label">{company}</p>
                              </div>
                              {selected.applicationStatus && <StatusBadge status={selected.applicationStatus} />}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 border-b border-outline px-5">
                           <DetailRow icon={MapPin} label="Location">
                              {selected.location || "—"} · {selected.workMode}
                           </DetailRow>
                           <DetailRow icon={Briefcase} label="Stipend">
                              <span className="tabular">
                                 {selected.stipend ? `${formatBaht(selected.stipend)} / month` : "Unpaid"}
                              </span>
                           </DetailRow>
                           {selected.duration && (
                              <DetailRow icon={Clock} label="Duration">
                                 {selected.duration}
                              </DetailRow>
                           )}
                           {selected.deadline && (
                              <DetailRow icon={CalendarDays} label="Apply by">
                                 {formatDate(selected.deadline)}
                              </DetailRow>
                           )}
                        </div>

                        <div className="space-y-4 p-5 text-sm leading-relaxed text-paragraph">
                           <p>{selected.description}</p>
                           {selected.requirements && (
                              <div>
                                 <h3 className="mb-1 text-sm font-semibold text-text">Requirements</h3>
                                 <p>{selected.requirements}</p>
                              </div>
                           )}
                           {selected.responsibilities && (
                              <div>
                                 <h3 className="mb-1 text-sm font-semibold text-text">Responsibilities</h3>
                                 <p>{selected.responsibilities}</p>
                              </div>
                           )}
                        </div>

                        {!user?.resume && !selected.applicationStatus && (
                           <div className="mx-5 mb-5 rounded-lg border border-dashed border-outline bg-neutral/60 p-4">
                              <p className="text-sm font-semibold text-text">Add your resume to apply</p>
                              <p className="mt-0.5 text-xs text-label">
                                 PDF only. It's attached to every application you send.
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                 <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                    className="max-w-full text-xs text-label file:mr-2 file:rounded-md file:border-0 file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-text"
                                 />
                                 <button
                                    type="button"
                                    onClick={handleResumeUpload}
                                    disabled={resumeUploading}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-text hover:border-primary/40 disabled:opacity-60"
                                 >
                                    <Upload className="h-3.5 w-3.5" />
                                    {resumeUploading ? "Uploading…" : "Upload PDF"}
                                 </button>
                              </div>
                              {resumeMessage && <p className="mt-2 text-xs text-label">{resumeMessage}</p>}
                           </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 border-t border-outline p-5">
                           <button
                              type="button"
                              onClick={() => handleApply(selected)}
                              disabled={
                                 isApplying ||
                                 !!selected.applicationStatus ||
                                 !user?.resume ||
                                 daysUntil(selected.deadline) < 0
                              }
                              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                           >
                              {selected.applicationStatus
                                 ? "Applied"
                                 : daysUntil(selected.deadline) < 0
                                   ? "Applications closed"
                                   : isApplying
                                     ? "Applying…"
                                     : "Apply now"}
                           </button>
                           <button
                              type="button"
                              onClick={() => handleSave(selected)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/40"
                           >
                              {selected.isSaved ? (
                                 <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                 <Bookmark className="h-4 w-4" />
                              )}
                              {selected.isSaved ? "Saved" : "Save"}
                           </button>
                           <Link
                              to={`/jobs/${getId(selected)}`}
                              className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                           >
                              Full details <ArrowRight className="h-4 w-4" />
                           </Link>
                        </div>
                     </div>
                  </aside>
               )}
            </div>
         )}
      </div>
   );
};

// ─────────────────────────────────────────────
// EVENTS TAB
// ─────────────────────────────────────────────
const EventsTab = ({ events, setEvents, loading }) => {
   const [query, setQuery] = useState("");
   const [eventType, setEventType] = useState("");
   const [modes, setModes] = useState([]);
   const [selectedId, setSelectedId] = useState(null);
   const [busy, setBusy] = useState(false);
   const [detailRef, scrollToDetail] = useScrollDetailOnMobile();

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return events.filter((ev) => {
         const org = (ev.organizer?.companyName || ev.organizer?.name || "").toLowerCase();
         const matchQ =
            !q || ev.title?.toLowerCase().includes(q) || org.includes(q) || ev.tags?.toLowerCase().includes(q);
         const matchT = !eventType || ev.eventType === eventType;
         const matchM = !modes.length || modes.includes(ev.mode);
         return matchQ && matchT && matchM;
      });
   }, [events, query, eventType, modes]);

   useEffect(() => {
      if (!filtered.some((e) => getId(e) === selectedId))
         setSelectedId(filtered[0] ? getId(filtered[0]) : null);
   }, [filtered, selectedId]);

   const selected = filtered.find((e) => getId(e) === selectedId);
   const isFull = (ev) => ev.seats && (ev.registrantCount || 0) >= ev.seats;
   const regClosed = (ev) => ev.deadline && daysUntil(ev.deadline) < 0;
   const hasFilters = query || eventType || modes.length;

   const update = (id, changes) =>
      setEvents((prev) => prev.map((e) => (getId(e) === id ? { ...e, ...changes(e) } : e)));

   const handleRegister = async (ev) => {
      if (busy) return;
      setBusy(true);
      const id = getId(ev);
      const was = ev.isRegistered;
      try {
         if (was) await axiosInstance.delete(API_PATHS.EVENTS.UNREGISTER(id));
         else await axiosInstance.post(API_PATHS.EVENTS.REGISTER(id));
         update(id, (e) => ({
            isRegistered: !was,
            registrantCount: Math.max((e.registrantCount || 0) + (was ? -1 : 1), 0),
         }));
      } catch {
         // keep current state; the button stays available to retry
      } finally {
         setBusy(false);
      }
   };

   const handleSave = async (ev) => {
      const id = getId(ev);
      const was = ev.isSaved;
      update(id, () => ({ isSaved: !was }));
      try {
         if (was) await axiosInstance.delete(API_PATHS.EVENTS.UNSAVE_EVENT(id));
         else await axiosInstance.post(API_PATHS.EVENTS.SAVE_EVENT(id));
      } catch {
         update(id, () => ({ isSaved: was }));
      }
   };

   if (loading)
      return <div className="py-20 text-center text-sm text-label">Loading events…</div>;

   const organiser = selected?.organizer?.companyName || selected?.organizer?.name || "Organiser";

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Search events, organisers or topics" />
            {EVENT_MODES.map((m) => (
               <FilterChip
                  key={m}
                  active={modes.includes(m)}
                  onClick={() =>
                     setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
                  }
               >
                  {m}
               </FilterChip>
            ))}
            <FilterMenu
               label={eventType || "Event type"}
               options={EVENT_TYPES}
               selected={eventType}
               multiple={false}
               onToggle={(v) => setEventType((prev) => (prev === v ? "" : v))}
            />
         </div>

         <ResultsLine
            shown={filtered.length}
            total={events.length}
            noun={events.length === 1 ? "event" : "events"}
            hasFilters={hasFilters}
            onClear={() => {
               setQuery("");
               setEventType("");
               setModes([]);
            }}
         />

         {filtered.length === 0 ? (
            <EmptyState
               icon={CalendarDays}
               title={events.length ? "No events match" : "No upcoming events yet"}
               description={
                  events.length
                     ? "Try another keyword or remove a filter."
                     : "Workshops, webinars and career fairs will appear here."
               }
            />
         ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {filtered.map((ev) => (
                     <EventCard
                        key={getId(ev)}
                        event={ev}
                        selected={getId(ev) === selectedId}
                        onClick={() => {
                           setSelectedId(getId(ev));
                           scrollToDetail();
                        }}
                     />
                  ))}
               </div>

               {selected && (
                  <aside ref={detailRef} className="scroll-mt-20 lg:sticky lg:top-24">
                     <div className="overflow-hidden rounded-xl border border-outline bg-white">
                        {selected.coverImage && (
                           <img src={selected.coverImage} alt="" className="h-40 w-full object-cover" />
                        )}
                        <div className="border-b border-outline p-5">
                           <div className="flex items-start gap-4">
                              <DateStub date={selected.date} size="lg" />
                              <div className="min-w-0 flex-1">
                                 <div className="flex flex-wrap gap-1.5">
                                    {selected.eventType && <Tag>{selected.eventType}</Tag>}
                                    {selected.isRegistered && <Tag tone="success">Registered</Tag>}
                                 </div>
                                 <h2 className="mt-1.5 text-lg font-semibold text-text">{selected.title}</h2>
                                 <p className="text-sm text-label">by {organiser}</p>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 border-b border-outline px-5">
                           <DetailRow icon={CalendarDays} label="When">
                              {formatDateTime(selected.date)}
                           </DetailRow>
                           <DetailRow icon={MapPin} label="Where">
                              {selected.mode}
                              {selected.location ? ` · ${selected.location}` : ""}
                           </DetailRow>
                           {selected.deadline && (
                              <DetailRow icon={Clock} label="Register by">
                                 {formatDate(selected.deadline)}
                              </DetailRow>
                           )}
                           {selected.seats ? (
                              <DetailRow icon={Users} label="Capacity">
                                 <span className="tabular">{selected.seats} seats</span>
                              </DetailRow>
                           ) : null}
                        </div>

                        <div className="space-y-4 p-5">
                           {selected.seats ? (
                              <SeatsBar seats={selected.seats} registered={selected.registrantCount || 0} />
                           ) : null}
                           <p className="text-sm leading-relaxed text-paragraph">{selected.description}</p>
                           {selected.tags && (
                              <div className="flex flex-wrap gap-1.5">
                                 {selected.tags
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                                    .map((t) => (
                                       <Tag key={t}>#{t}</Tag>
                                    ))}
                              </div>
                           )}
                           {selected.link && selected.isRegistered && (
                              <a
                                 href={selected.link}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                 Join link <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                           )}
                        </div>

                        {!selected.isClosed && (
                           <div className="flex flex-wrap items-center gap-2 border-t border-outline p-5">
                              {selected.isRegistered ? (
                                 <>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                                       <CheckCircle2 className="h-4 w-4" /> You're registered
                                    </span>
                                    <button
                                       type="button"
                                       onClick={() => handleRegister(selected)}
                                       disabled={busy}
                                       className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-label hover:bg-neutral hover:text-error disabled:opacity-60"
                                    >
                                       Cancel registration
                                    </button>
                                 </>
                              ) : (
                                 <>
                                    <button
                                       type="button"
                                       onClick={() => handleRegister(selected)}
                                       disabled={busy || isFull(selected) || regClosed(selected)}
                                       className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                       {isFull(selected)
                                          ? "Fully booked"
                                          : regClosed(selected)
                                            ? "Registration closed"
                                            : busy
                                              ? "Registering…"
                                              : "Register"}
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => handleSave(selected)}
                                       className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/40"
                                    >
                                       {selected.isSaved ? (
                                          <BookmarkCheck className="h-4 w-4 text-primary" />
                                       ) : (
                                          <Bookmark className="h-4 w-4" />
                                       )}
                                       {selected.isSaved ? "Saved" : "Save"}
                                    </button>
                                    {selected.deadline && (
                                       <span className="ml-auto">
                                          <DeadlineHint deadline={selected.deadline} label="Register by" />
                                       </span>
                                    )}
                                 </>
                              )}
                           </div>
                        )}
                     </div>
                  </aside>
               )}
            </div>
         )}
      </div>
   );
};

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
const ApplicantsDashboard = () => {
   const { user, updateUser } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();

   // /events opens the Events tab; /find-jobs (and others) open Internships
   const activeTab = location.pathname.toLowerCase().startsWith("/events") ? "events" : "jobs";
   const setTab = (tab) => navigate(tab === "events" ? "/events" : "/find-jobs", { replace: true });

   const [jobs, setJobs] = useState([]);
   const [events, setEvents] = useState([]);
   const [registrations, setRegistrations] = useState([]);
   const [loadingEvents, setLoadingEvents] = useState(true);

   useEffect(() => {
      if (!user) return;
      const userId = user._id || user.id;
      axiosInstance
         .get(API_PATHS.JOBS.GET_ALL_JOBS, { params: { userId } })
         .then((res) =>
            setJobs((res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),
         )
         .catch(() => setJobs([]));
      axiosInstance
         .get(API_PATHS.EVENTS.GET_ALL_EVENTS, { params: { userId } })
         .then((res) =>
            setEvents(
               (res.data || [])
                  .filter((ev) => daysUntil(ev.endDate || ev.date) >= 0)
                  .sort((a, b) => new Date(a.date) - new Date(b.date)),
            ),
         )
         .catch(() => setEvents([]))
         .finally(() => setLoadingEvents(false));
      axiosInstance
         .get(API_PATHS.EVENTS.GET_MY_REGISTRATIONS)
         .then((res) => setRegistrations(res.data || []))
         .catch(() => setRegistrations([]));
   }, [user]);

   // Keep "Coming up" in sync when the student registers/unregisters here
   const registeredHere = events.filter((e) => e.isRegistered).map((event) => ({ event }));
   const comingUpRegs = events.length ? registeredHere : registrations;

   const firstName = (user?.name || "").split(" ")[0];
   const tabs = [
      { id: "jobs", label: "Internships", count: jobs.length },
      { id: "events", label: "Events", count: events.length },
   ];

   return (
      <DashboardLayout activeMenu="find-jobs" navItems={NAVIGATION_MENU_APPLICANT}>
         <div className="space-y-6">
            <div>
               <p className="text-sm text-label">{firstName ? `Hi ${firstName},` : "Welcome,"}</p>
               <h1 className="text-2xl font-semibold text-text md:text-3xl">Find opportunities</h1>
               <p className="mt-1 text-sm text-label">
                  Internships to apply for and career events to grow your network.
               </p>
            </div>

            <ComingUp jobs={jobs} registrations={comingUpRegs} onOpenTab={setTab} />

            <div className="border-b border-outline" role="tablist" aria-label="Opportunity type">
               <div className="flex gap-6">
                  {tabs.map((tab) => {
                     const isActive = activeTab === tab.id;
                     return (
                        <button
                           key={tab.id}
                           type="button"
                           role="tab"
                           aria-selected={isActive}
                           onClick={() => setTab(tab.id)}
                           className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                              isActive
                                 ? "border-primary text-text"
                                 : "border-transparent text-label hover:text-text"
                           }`}
                        >
                           {tab.label}
                           <span
                              className={`tabular rounded-md px-1.5 py-0.5 text-xs ${isActive ? "bg-primary text-white" : "bg-neutral text-label"}`}
                           >
                              {tab.count}
                           </span>
                        </button>
                     );
                  })}
               </div>
            </div>

            {activeTab === "jobs" ? (
               <JobsTab jobs={jobs} setJobs={setJobs} user={user} updateUser={updateUser} />
            ) : (
               <EventsTab events={events} setEvents={setEvents} loading={loadingEvents} />
            )}
         </div>
      </DashboardLayout>
   );
};

export default ApplicantsDashboard;

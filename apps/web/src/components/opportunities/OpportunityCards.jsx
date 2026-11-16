import { Bookmark, CheckCircle2, MapPin } from "lucide-react";
import StatusBadge from "../cards/StatusBadge";
import {
   dateStub,
   daysUntil,
   formatBaht,
   formatDateTime,
   initial,
   postedAgo,
} from "../../utils/format";

/** Small grey meta tag, e.g. "Hybrid" or "Workshop". */
export const Tag = ({ children, tone = "neutral" }) => {
   const tones = {
      neutral: "bg-neutral text-label",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      error: "bg-error/10 text-error",
   };
   return (
      <span
         className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
      >
         {children}
      </span>
   );
};

/** Square tile with the organisation's logo or first letter. */
export const OrgTile = ({ name, logo, size = "h-10 w-10 text-sm" }) => (
   <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/[0.07] font-semibold text-primary ring-1 ring-inset ring-primary/10 ${size}`}
   >
      {logo ? (
         <img src={logo} alt="" className="h-full w-full object-cover" />
      ) : (
         initial(name)
      )}
   </div>
);

/** Deadline hint, highlighted when it's close. */
export const DeadlineHint = ({ deadline, label = "Apply by" }) => {
   const days = daysUntil(deadline);
   if (days === null) return null;
   if (days < 0) return <Tag tone="error">Closed</Tag>;
   if (days <= 7)
      return (
         <Tag tone="warning">
            {days === 0 ? "Closes today" : `Closes in ${days}d`}
         </Tag>
      );
   return (
      <span className="text-xs text-muted">
         {label}{" "}
         {new Date(deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
         })}
      </span>
   );
};

const cardBase =
   "group w-full rounded-xl border bg-white p-4 text-left transition-colors";
const cardState = (selected) =>
   selected
      ? "border-primary ring-1 ring-primary"
      : "border-outline hover:border-primary/40";

/** Internship listing card. */
export const JobCard = ({ job, selected, onClick }) => {
   const company = job.company?.companyName || job.company?.name || "Company";
   return (
      <button
         type="button"
         onClick={onClick}
         aria-pressed={selected}
         className={`${cardBase} ${cardState(selected)}`}
      >
         <div className="flex items-start gap-3">
            <OrgTile name={company} logo={job.company?.companyLogo} />
            <div className="min-w-0 flex-1">
               <p className="truncate text-sm font-semibold text-text group-hover:text-primary">
                  {job.title}
               </p>
               <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-label">
                  {company}
                  {job.location && (
                     <>
                        <span aria-hidden="true">·</span>
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                     </>
                  )}
               </p>
            </div>
            {job.applicationStatus ? (
               <StatusBadge status={job.applicationStatus} />
            ) : (
               job.isSaved && (
                  <Bookmark
                     className="h-4 w-4 flex-shrink-0 fill-primary text-primary"
                     aria-label="Saved"
                  />
               )
            )}
         </div>

         <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {job.workMode && <Tag>{job.workMode}</Tag>}
            {job.category && <Tag>{job.category}</Tag>}
            {job.duration && <Tag>{job.duration}</Tag>}
         </div>

         <div className="mt-3 flex items-center justify-between gap-2 border-t border-outline pt-3">
            <span className="tabular text-sm font-semibold text-text">
               {job.stipend ? (
                  <>
                     {formatBaht(job.stipend)}
                     <span className="font-normal text-muted">/mo</span>
                  </>
               ) : (
                  <span className="font-normal text-muted">Unpaid</span>
               )}
            </span>
            {job.deadline ? (
               <DeadlineHint deadline={job.deadline} />
            ) : (
               <span className="text-xs text-muted">{postedAgo(job.createdAt)}</span>
            )}
         </div>
      </button>
   );
};

/** Calendar-style date stub used on event cards. */
export const DateStub = ({ date, size = "md" }) => {
   const { month, day } = dateStub(date);
   const big = size === "lg";
   return (
      <div
         className={`flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-outline bg-white text-center ${big ? "h-16 w-16" : "h-14 w-14"}`}
         aria-hidden="true"
      >
         <span className="w-full bg-primary py-0.5 text-[10px] font-semibold tracking-wider text-white">
            {month}
         </span>
         <span
            className={`tabular flex flex-1 items-center font-semibold text-text ${big ? "text-2xl" : "text-xl"}`}
         >
            {day}
         </span>
      </div>
   );
};

/** "12 of 80 seats left" bar. */
export const SeatsBar = ({ seats, registered = 0 }) => {
   if (!seats) return null;
   const left = Math.max(seats - registered, 0);
   const pct = Math.min((registered / seats) * 100, 100);
   const tone =
      left === 0 ? "bg-error" : left / seats <= 0.2 ? "bg-warning" : "bg-primary";
   return (
      <div>
         <div className="flex items-center justify-between text-xs">
            <span className="text-label">
               {left === 0 ? "Fully booked" : `${left} of ${seats} seats left`}
            </span>
         </div>
         <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral">
            <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
         </div>
      </div>
   );
};

/** Event listing card. */
export const EventCard = ({ event, selected, onClick }) => {
   const organiser =
      event.organizer?.companyName || event.organizer?.name || "Organiser";
   return (
      <button
         type="button"
         onClick={onClick}
         aria-pressed={selected}
         className={`${cardBase} ${cardState(selected)}`}
      >
         <div className="flex items-start gap-3">
            <DateStub date={event.date} />
            <div className="min-w-0 flex-1">
               <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-semibold text-text group-hover:text-primary">
                     {event.title}
                  </p>
                  {event.isRegistered ? (
                     <CheckCircle2
                        className="h-4 w-4 flex-shrink-0 text-success"
                        aria-label="Registered"
                     />
                  ) : (
                     event.isSaved && (
                        <Bookmark
                           className="h-4 w-4 flex-shrink-0 fill-primary text-primary"
                           aria-label="Saved"
                        />
                     )
                  )}
               </div>
               <p className="mt-0.5 truncate text-xs text-label">{organiser}</p>
               <p className="mt-1 text-xs text-muted">{formatDateTime(event.date)}</p>
            </div>
         </div>

         <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {event.eventType && <Tag>{event.eventType}</Tag>}
            {event.mode && <Tag>{event.mode}</Tag>}
            {event.isRegistered && <Tag tone="success">Registered</Tag>}
         </div>

         {event.seats ? (
            <div className="mt-3 border-t border-outline pt-3">
               <SeatsBar seats={event.seats} registered={event.registrantCount || 0} />
            </div>
         ) : null}
      </button>
   );
};

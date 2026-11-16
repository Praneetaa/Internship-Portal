// Colour carries meaning: blue = submitted, amber = waiting on someone,
// green = good outcome / open, red = negative outcome / closed.
const STATUS_STYLES = {
   applied: "bg-accent/10 text-accent ring-accent/20",
   "in review": "bg-warning/10 text-warning ring-warning/20",
   rejected: "bg-error/10 text-error ring-error/20",
   accepted: "bg-success/10 text-success ring-success/20",
   open: "bg-success/10 text-success ring-success/20",
   closed: "bg-neutral text-label ring-outline",
   draft: "bg-neutral text-label ring-outline",
   registered: "bg-success/10 text-success ring-success/20",
};

const StatusBadge = ({ status }) => {
   const key = status?.toLowerCase();
   return (
      <span
         className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
            STATUS_STYLES[key] || "bg-neutral text-label ring-outline"
         }`}
      >
         <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
         {status}
      </span>
   );
};

export default StatusBadge;

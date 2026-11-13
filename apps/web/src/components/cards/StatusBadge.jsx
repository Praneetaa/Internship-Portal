const STATUS_STYLES = {
   applied: "bg-accent/15 text-accent",
   "in review": "bg-secondary/15 text-secondary",
   rejected: "bg-error/10 text-error",
   accepted: "bg-success/10 text-success",
   open: "bg-success/10 text-success",
   closed: "bg-error/10 text-error",
   draft: "bg-secondary/15 text-secondary",
};

const StatusBadge = ({ status }) => {
   const key = status?.toLowerCase();
   return (
      <span
         className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[key] || "bg-neutral text-label"
         }`}
      >
         {status}
      </span>
   );
};

export default StatusBadge;

const DOT_COLORS = {
   applied: "bg-accent",
   "in review": "bg-secondary",
   rejected: "bg-error",
   accepted: "bg-success",
   open: "bg-success",
   closed: "bg-error",
   draft: "bg-secondary",
};

const STATUS_STYLES = {
   applied: "bg-accent/10 text-accent border-accent/20",
   "in review": "bg-secondary/10 text-secondary border-secondary/20",
   rejected: "bg-error/10 text-error border-error/20",
   accepted: "bg-success/10 text-success border-success/20",
   open: "bg-success/10 text-success border-success/20",
   closed: "bg-error/10 text-error border-error/20",
   draft: "bg-secondary/10 text-secondary border-secondary/20",
};

const StatusBadge = ({ status }) => {
   const key = status?.toLowerCase();
   return (
      <span
         className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            STATUS_STYLES[key] || "border-outline bg-neutral text-label"
         }`}
      >
         <span
            className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[key] || "bg-muted"}`}
         />
         {status}
      </span>
   );
};

export default StatusBadge;

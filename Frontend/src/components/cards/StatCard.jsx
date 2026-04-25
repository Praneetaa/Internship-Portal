const ACCENT_COLORS = [
   "from-primary/80 to-secondary/80",
   "from-accent/80 to-primary/80",
   "from-success/80 to-accent/80",
   "from-secondary/80 to-accent/80",
];

let counter = 0;

const StatCard = ({ label, value, change, index }) => {
   const gradient = ACCENT_COLORS[(index ?? counter++) % ACCENT_COLORS.length];

   return (
      <div className="group relative overflow-hidden rounded-2xl border border-outline/60 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
         <div
            className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${gradient}`}
         />
         <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {label}
         </p>
         <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-3xl font-bold tracking-tight text-primary">
               {value}
            </span>
            {change && (
               <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  ↑ {change}
               </span>
            )}
         </div>
      </div>
   );
};

export default StatCard;

const StatCard = ({ label, value, change, icon: Icon }) => {
   const isNegative = typeof change === "string" && change.trim().startsWith("-");
   return (
      <div className="rounded-xl border border-outline bg-white p-5">
         <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-label">{label}</p>
            {Icon && <Icon className="h-4 w-4 text-icon" />}
         </div>
         <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="tabular text-3xl font-semibold tracking-tight text-text">
               {value}
            </span>
            {change && (
               <span
                  className={`tabular text-xs font-medium ${isNegative ? "text-error" : "text-success"}`}
               >
                  {change}
               </span>
            )}
         </div>
      </div>
   );
};

export default StatCard;

const StatCard = ({ label, value, change }) => {
   return (
      <div className="rounded-2xl border border-outline bg-white/90 p-5 shadow-sm">
         <p className="text-xs uppercase tracking-[0.2em] text-label">
            {label}
         </p>
         <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-semibold text-primary">
               {value}
            </span>
            {change && (
               <span className="text-xs font-medium text-success">
                  {change}
               </span>
            )}
         </div>
      </div>
   );
};

export default StatCard;

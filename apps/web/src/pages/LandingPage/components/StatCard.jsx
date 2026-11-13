const StatCard = ({ value, label }) => {
   return (
      <div className="rounded-2xl border border-outline bg-white/80 px-5 py-4 text-left shadow-sm">
         <div className="text-2xl font-semibold text-primary">{value}</div>
         <div className="text-xs uppercase tracking-[0.2em] text-label">
            {label}
         </div>
      </div>
   );
};

export default StatCard;

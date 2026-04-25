const StatCard = ({ value, label }) => {
   return (
      <div className="rounded-2xl border border-outline/60 bg-white px-5 py-4 text-left shadow-sm">
         <div className="text-2xl font-bold tracking-tight text-primary">
            {value}
         </div>
         <div className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted">
            {label}
         </div>
      </div>
   );
};

export default StatCard;

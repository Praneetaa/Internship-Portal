const SectionCard = ({ title, subtitle, action, children, noPad }) => {
   return (
      <div className="overflow-hidden rounded-2xl border border-outline/60 bg-white shadow-sm">
         {(title || subtitle || action) && (
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline/60 px-6 py-4">
               <div>
                  {title && (
                     <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
                        {title}
                     </h3>
                  )}
                  {subtitle && (
                     <p className="mt-0.5 text-xs text-label">{subtitle}</p>
                  )}
               </div>
               {action}
            </div>
         )}
         <div className={noPad ? "" : "p-6"}>{children}</div>
      </div>
   );
};

export default SectionCard;

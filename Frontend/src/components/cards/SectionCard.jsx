const SectionCard = ({ title, subtitle, action, children }) => {
   return (
      <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
         {(title || subtitle || action) && (
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  {title && (
                     <h3 className="text-lg font-semibold text-primary">
                        {title}
                     </h3>
                  )}
                  {subtitle && (
                     <p className="mt-1 text-sm text-label">{subtitle}</p>
                  )}
               </div>
               {action}
            </div>
         )}
         <div className="mt-5">{children}</div>
      </div>
   );
};

export default SectionCard;

const SectionCard = ({ title, subtitle, action, children, className = "" }) => {
   return (
      <section
         className={`rounded-xl border border-outline bg-white p-5 md:p-6 ${className}`}
      >
         {(title || subtitle || action) && (
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div className="min-w-0">
                  {title && (
                     <h3 className="text-base font-semibold text-text">
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
         <div className={title || subtitle || action ? "mt-5" : ""}>
            {children}
         </div>
      </section>
   );
};

export default SectionCard;

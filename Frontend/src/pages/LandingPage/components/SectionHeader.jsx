const SectionHeader = ({
   eyebrow,
   title,
   subtitle,
   align = "left",
   tone = "default",
}) => {
   const alignClass =
      align === "center"
         ? "text-center items-center"
         : "text-left items-start";
   const titleClass =
      tone === "inverse" ? "text-white" : "text-primary";
   const subtitleClass =
      tone === "inverse" ? "text-white/80" : "text-paragraph";
   const eyebrowClass =
      tone === "inverse" ? "text-white/70" : "text-label";

   return (
      <div className={`flex flex-col gap-3 ${alignClass}`}>
         {eyebrow && (
            <span
               className={`text-xs uppercase tracking-[0.25em] ${eyebrowClass}`}
            >
               {eyebrow}
            </span>
         )}
         <h2 className={`text-3xl sm:text-4xl font-semibold ${titleClass}`}>
            {title}
         </h2>
         {subtitle && (
            <p className={`text-base sm:text-lg ${subtitleClass} max-w-2xl`}>
               {subtitle}
            </p>
         )}
      </div>
   );
};

export default SectionHeader;

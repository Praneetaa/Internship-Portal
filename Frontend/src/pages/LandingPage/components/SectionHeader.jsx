const SectionHeader = ({
   eyebrow,
   title,
   subtitle,
   align = "left",
   tone = "default",
}) => {
   const alignClass =
      align === "center" ? "text-center items-center" : "text-left items-start";
   const titleClass = tone === "inverse" ? "text-white" : "text-text";
   const subtitleClass =
      tone === "inverse" ? "text-white/75" : "text-paragraph";
   const eyebrowClass =
      tone === "inverse" ? "text-white/60" : "text-accent";

   return (
      <div className={`flex flex-col gap-2.5 ${alignClass}`}>
         {eyebrow && (
            <span
               className={`text-[11px] font-bold uppercase tracking-[0.28em] ${eyebrowClass}`}
            >
               {eyebrow}
            </span>
         )}
         <h2
            className={`text-3xl font-bold leading-tight sm:text-4xl ${titleClass}`}
         >
            {title}
         </h2>
         {subtitle && (
            <p
               className={`text-base leading-relaxed sm:text-lg ${subtitleClass} max-w-2xl`}
            >
               {subtitle}
            </p>
         )}
      </div>
   );
};

export default SectionHeader;

/** Beaconn mark: a beacon dot sending out a signal. */
export const BeaconnMark = ({ className = "h-8 w-8" }) => (
   <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <circle cx="16" cy="19" r="3" fill="#fff" />
      <path
         d="M10.5 13.5a7.8 7.8 0 0 1 11 0"
         fill="none"
         stroke="#fff"
         strokeWidth="2.2"
         strokeLinecap="round"
      />
      <path
         d="M7 10a12.7 12.7 0 0 1 18 0"
         fill="none"
         stroke="#fff"
         strokeOpacity=".55"
         strokeWidth="2.2"
         strokeLinecap="round"
      />
   </svg>
);

const BeaconnLogo = ({ className = "", markClassName = "h-8 w-8" }) => (
   <span className={`inline-flex items-center gap-2.5 text-primary ${className}`}>
      <BeaconnMark className={markClassName} />
      <span className="text-lg font-semibold tracking-tight text-text">
         Beaconn
      </span>
   </span>
);

export default BeaconnLogo;

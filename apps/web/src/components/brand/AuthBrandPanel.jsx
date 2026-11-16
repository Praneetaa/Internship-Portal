import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { BeaconnMark } from "./BeaconnLogo";

/** Left-hand brand panel shared by the sign-in and sign-up pages. */
const AuthBrandPanel = ({
   title = "Your next internship starts here.",
   text = "Internships and career events for students, in one place.",
   points = [
      "Search internships by role, city and work mode",
      "Register for workshops, webinars and career fairs",
      "Track every application from one dashboard",
   ],
}) => (
   <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex lg:w-[45%]">
      {/* Beacon signal arcs */}
      <svg
         className="pointer-events-none absolute -right-24 -bottom-24 h-[520px] w-[520px] text-white/[0.07]"
         viewBox="0 0 200 200"
         fill="none"
         aria-hidden="true"
      >
         <circle cx="100" cy="100" r="10" fill="currentColor" />
         <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="4" />
         <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="4" />
         <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="4" />
      </svg>

      <Link to="/" className="relative inline-flex items-center gap-2.5" aria-label="Beaconn home">
         <BeaconnMark className="h-9 w-9 text-white/15" />
         <span className="text-lg font-semibold">Beaconn</span>
      </Link>

      <div className="relative max-w-sm">
         <h2 className="text-4xl font-semibold leading-tight">{title}</h2>
         <p className="mt-4 text-base text-white/70">{text}</p>
         <ul className="mt-8 space-y-3">
            {points.map((p) => (
               <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                  {p}
               </li>
            ))}
         </ul>
      </div>

      <p className="relative text-sm text-white/40">© 2026 Beaconn</p>
   </div>
);

export default AuthBrandPanel;

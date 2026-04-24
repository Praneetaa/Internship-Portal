import { Link } from "react-router-dom";
import {
   Building2,
   Mail,
   Globe,
   Users,
   MapPin,
   Briefcase,
   Pencil,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

const EmployerProfilePage = () => {
   const { user } = useAuth();
   const companyName = user?.companyName || user?.name || "Your Company";
   const email = user?.email || "—";
   const logo = user?.companyLogo || user?.avatar || null;
   const about =
      user?.companyDescription ||
      user?.about ||
      "Add a company description to help candidates learn about your organization.";

   const infoItems = [
      { icon: Mail, label: "Email", value: email },
      { icon: Globe, label: "Website", value: user?.website || "Not added" },
      {
         icon: Users,
         label: "Company size",
         value: user?.companySize || "Not added",
      },
      {
         icon: Briefcase,
         label: "Industry",
         value: user?.industry || "Not added",
      },
      { icon: MapPin, label: "Location", value: user?.location || "Not added" },
   ];

   return (
      <DashboardLayout activeMenu="company-profile">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-primary">
                     Company profile
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Your public profile visible to candidates.
                  </p>
               </div>
               <Link
                  to="/edit-profile"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary transition"
               >
                  <Pencil className="h-4 w-4" /> Edit profile
               </Link>
            </div>

            {/* Profile hero */}
            <div className="overflow-hidden rounded-2xl border border-outline bg-white/90 shadow-sm">
               <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
               <div className="px-6 pb-6">
                  <div className="-mt-10 flex items-end justify-between gap-4">
                     <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-sm flex items-center justify-center">
                        {logo ? (
                           <img
                              src={logo}
                              alt={companyName}
                              className="h-full w-full object-cover"
                           />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 text-2xl font-bold text-primary">
                              {companyName[0].toUpperCase()}
                           </div>
                        )}
                     </div>
                     <Link
                        to="/edit-profile"
                        className="mb-1 inline-flex items-center gap-1.5 rounded-xl border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                     >
                        <Pencil className="h-3 w-3" /> Edit
                     </Link>
                  </div>
                  <div className="mt-3">
                     <h2 className="text-xl font-bold text-primary">
                        {companyName}
                     </h2>
                     <p className="text-sm text-label mt-0.5">
                        Organization · Internship recruiter
                     </p>
                  </div>
               </div>
            </div>

            {/* Info grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {infoItems.map(({ icon: Icon, label, value }) => (
                  <div
                     key={label}
                     className="rounded-2xl border border-outline bg-white/90 p-4 shadow-sm"
                  >
                     <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                           <Icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-label">
                           {label}
                        </p>
                     </div>
                     <p
                        className={`text-sm font-medium ${value === "Not added" ? "text-label italic" : "text-primary"}`}
                     >
                        {value}
                     </p>
                  </div>
               ))}
            </div>

            {/* About */}
            <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
               <h3 className="text-base font-semibold text-primary mb-3">
                  About the company
               </h3>
               <p
                  className={`text-sm leading-relaxed ${about.includes("Add a") ? "italic text-label" : "text-paragraph"}`}
               >
                  {about}
               </p>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default EmployerProfilePage;

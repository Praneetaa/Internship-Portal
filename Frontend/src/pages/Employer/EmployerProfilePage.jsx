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
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                     Profile
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-text">
                     Company profile
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Your public profile visible to candidates.
                  </p>
               </div>
               <Link
                  to="/edit-profile"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
               >
                  <Pencil className="h-4 w-4" /> Edit profile
               </Link>
            </div>

            {/* Profile hero card */}
            <div className="overflow-hidden rounded-2xl border border-outline/60 bg-white shadow-sm">
               <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
               <div className="h-28 bg-gradient-to-br from-primary/8 to-secondary/8" />
               <div className="px-6 pb-6">
                  <div className="-mt-10 flex items-end justify-between gap-4">
                     <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
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
                        className="mb-1 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-neutral"
                     >
                        <Pencil className="h-3 w-3" /> Edit
                     </Link>
                  </div>
                  <div className="mt-3">
                     <h2 className="text-xl font-bold text-text">
                        {companyName}
                     </h2>
                     <p className="mt-0.5 text-sm text-muted">
                        Organization · Internship recruiter
                     </p>
                  </div>
               </div>
            </div>

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {infoItems.map(({ icon: Icon, label, value }) => (
                  <div
                     key={label}
                     className="flex items-start gap-3 rounded-2xl border border-outline/60 bg-white p-4 shadow-sm"
                  >
                     <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8">
                        <Icon className="h-4 w-4 text-primary" />
                     </span>
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                           {label}
                        </p>
                        <p
                           className={`mt-1 text-sm font-medium ${value === "Not added" ? "italic text-muted" : "text-text"}`}
                        >
                           {value}
                        </p>
                     </div>
                  </div>
               ))}
            </div>

            {/* About */}
            <div className="overflow-hidden rounded-2xl border border-outline/60 bg-white shadow-sm">
               <div className="border-b border-outline/60 px-6 py-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
                     About the company
                  </h3>
               </div>
               <div className="px-6 py-5">
                  <p
                     className={`text-sm leading-relaxed ${about.includes("Add a") ? "italic text-muted" : "text-paragraph"}`}
                  >
                     {about}
                  </p>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default EmployerProfilePage;

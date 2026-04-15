import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";

const EmployerProfilePage = () => {
   const { user } = useAuth();

   const profile = {
      companyName: user?.companyName || user?.name || "Beaconn Studio",
      email: user?.companyEmail || user?.email || "hello@beaconn.io",
      website: user?.website || "www.beaconn.io",
      size: user?.companySize || "51-200",
      industry: user?.industry || "Career Development",
      location: user?.location || "Bangkok, Thailand",
      logo: user?.logo || user?.avatar || null,
      about:
         user?.about ||
         "We build internship-first experiences to guide emerging talent into confident careers.",
   };

   return (
      <DashboardLayout activeMenu="company-profile">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Company profile
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Keep your organization profile up to date.
                  </p>
               </div>
               <Link
                  to="/edit-profile"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
               >
                  Edit profile
               </Link>
            </div>

            <SectionCard title="Overview" subtitle="Public profile details">
               <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Company logo
                     </p>
                     <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral">
                           {profile.logo ? (
                              <img
                                 src={profile.logo}
                                 alt={profile.companyName}
                                 className="h-12 w-12 rounded-xl object-cover"
                              />
                           ) : (
                              <span className="text-xs text-label">Logo</span>
                           )}
                        </div>
                        <p className="text-sm text-label">
                           Upload your logo in edit profile.
                        </p>
                     </div>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Company name
                     </p>
                     <p className="mt-1 text-sm font-semibold text-primary">
                        {profile.companyName}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Email
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.email}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Website
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.website}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Company size
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.size}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Industry
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.industry}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Location
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.location}
                     </p>
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="About" subtitle="Short company introduction">
               <p className="text-sm text-paragraph leading-relaxed">
                  {profile.about}
               </p>
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default EmployerProfilePage;

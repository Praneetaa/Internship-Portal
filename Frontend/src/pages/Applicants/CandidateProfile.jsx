import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import { NAVIGATION_MENU_APPLICANT } from "../../utils/data";

const CandidateProfile = () => {
   const { user } = useAuth();

   const profile = {
      name: user?.name || user?.fullName || "Alex Chen",
      email: user?.email || user?.personalEmail || "alex@email.com",
      location: user?.location || "Bangkok, Thailand",
      education: user?.education || "BSc Computer Science",
      skills: user?.skills || ["React", "Figma", "Analytics"],
      about:
         user?.about ||
         "Aspiring product builder focused on internship opportunities in UX and frontend development.",
   };

   return (
      <DashboardLayout
         activeMenu="candidate-profile"
         navItems={NAVIGATION_MENU_APPLICANT}
      >
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold text-primary">
                  My profile
               </h1>
               <p className="mt-1 text-sm text-label">
                  Keep your profile updated to improve match quality.
               </p>
            </div>

            <SectionCard title="Overview">
               <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Name
                     </p>
                     <p className="mt-1 text-sm font-semibold text-primary">
                        {profile.name}
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
                        Location
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.location}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Education
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {profile.education}
                     </p>
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Skills">
               <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                     <span
                        key={skill}
                        className="rounded-full border border-outline bg-white px-3 py-1 text-xs text-primary"
                     >
                        {skill}
                     </span>
                  ))}
               </div>
            </SectionCard>

            <SectionCard title="About">
               <p className="text-sm text-paragraph leading-relaxed">
                  {profile.about}
               </p>
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default CandidateProfile;

import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";

const seedApplicants = {
   "app-1": {
      name: "Aisha Khan",
      email: "aisha@email.com",
      location: "Bangkok, Thailand",
      skills: ["UX Design", "Figma", "Prototyping"],
      education: "B.Des, Chulalongkorn University",
      summary:
         "Product design student focused on clean UX and early-stage prototyping.",
   },
   "app-2": {
      name: "Rahul Sen",
      email: "rahul@email.com",
      location: "Chiang Mai, Thailand",
      skills: ["Marketing", "Content", "Analytics"],
      education: "BBA, Chiang Mai University",
      summary:
         "Marketing generalist with experience in campaigns and growth experiments.",
   },
   "app-3": {
      name: "Yara Solis",
      email: "yara@email.com",
      location: "Phuket, Thailand",
      skills: ["Research", "User Interviews", "Insights"],
      education: "B.A., Thammasat University",
      summary:
         "Research-minded intern interested in qualitative studies and UX strategy.",
   },
};

const UserProfile = () => {
   const { id } = useParams();
   const applicant = seedApplicants[id];

   if (!applicant) {
      return (
         <DashboardLayout activeMenu="applications">
            <SectionCard title="Applicant not found">
               <p className="text-sm text-label">
                  This applicant profile is not available.
               </p>
            </SectionCard>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout activeMenu="applications">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     {applicant.name}
                  </h1>
                  <p className="mt-1 text-sm text-label">{applicant.email}</p>
               </div>
               <Link
                  to={`/applicants/resume/${id}`}
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  View resume
               </Link>
            </div>

            <SectionCard title="Profile summary">
               <p className="text-sm text-paragraph">{applicant.summary}</p>
            </SectionCard>

            <SectionCard title="Details">
               <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Location
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {applicant.location}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-[0.2em] text-label">
                        Education
                     </p>
                     <p className="mt-1 text-sm text-paragraph">
                        {applicant.education}
                     </p>
                  </div>
               </div>
            </SectionCard>

            <SectionCard title="Skills">
               <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
                     <span
                        key={skill}
                        className="rounded-full border border-outline bg-white px-3 py-1 text-xs text-primary"
                     >
                        {skill}
                     </span>
                  ))}
               </div>
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default UserProfile;

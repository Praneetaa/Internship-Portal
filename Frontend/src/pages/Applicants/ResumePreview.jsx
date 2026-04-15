import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";

const seedResumes = {
   "app-1": {
      name: "Aisha Khan",
      highlights: [
         "Led UI redesign for campus app (3k+ users).",
         "Figma + prototype workflow for design sprints.",
         "Presented research insights to product team.",
      ],
   },
   "app-2": {
      name: "Rahul Sen",
      highlights: [
         "Managed 4 social campaigns with 18% engagement lift.",
         "Built monthly reporting dashboards in Google Sheets.",
         "Coordinated influencer outreach for product launch.",
      ],
   },
   "app-3": {
      name: "Yara Solis",
      highlights: [
         "Conducted 12 user interviews and synthesized insights.",
         "Mapped journey flows for early-stage products.",
         "Created research repository and tagging system.",
      ],
   },
};

const ResumePreview = () => {
   const { id } = useParams();
   const resume = seedResumes[id];

   if (!resume) {
      return (
         <DashboardLayout activeMenu="applications">
            <SectionCard title="Resume not found">
               <p className="text-sm text-label">
                  This resume is not available.
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
                     {resume.name}'s resume
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Quick preview of key highlights.
                  </p>
               </div>
               <Link
                  to={`/applicants/profile/${id}`}
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  View profile
               </Link>
            </div>

            <SectionCard title="Highlights">
               <ul className="space-y-3 text-sm text-paragraph">
                  {resume.highlights.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </SectionCard>
         </div>
      </DashboardLayout>
   );
};

export default ResumePreview;

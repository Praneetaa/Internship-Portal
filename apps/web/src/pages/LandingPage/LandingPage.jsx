import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   ArrowRight,
   BarChart3,
   Bookmark,
   CalendarCheck,
   CheckCircle2,
   ClipboardList,
   FileText,
   GraduationCap,
   ListChecks,
   PenSquare,
   Search,
   Building2,
   UserPlus,
   Users,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import BeaconnLogo from "../../components/brand/BeaconnLogo";
import { EventCard, JobCard } from "../../components/opportunities/OpportunityCards";
import { daysUntil } from "../../utils/format";

// Shown in the preview if live data can't be loaded
const SAMPLE_JOB = {
   _id: "sample-job",
   title: "Frontend Developer Intern",
   company: { companyName: "TechCorp Bangkok" },
   location: "Bangkok",
   workMode: "Hybrid",
   category: "Software Development",
   duration: "3 months",
   stipend: 12000,
};
const SAMPLE_EVENT = {
   _id: "sample-event",
   title: "React & Node.js Bootcamp",
   organizer: { companyName: "StartupHub Thailand" },
   eventType: "Workshop",
   mode: "Online",
   date: new Date(Date.now() + 7 * 86400000).toISOString(),
   seats: 50,
   registrantCount: 12,
};

const studentFeatures = [
   { icon: Search, title: "Search and filter", text: "Find internships by role, company, city, work mode and category." },
   { icon: Bookmark, title: "Save for later", text: "Bookmark internships and events, and see which deadlines are coming up." },
   { icon: FileText, title: "Apply with one resume", text: "Upload your resume once and it's attached to every application." },
   { icon: ListChecks, title: "Track every application", text: "See whether each one is applied, in review, accepted or not selected." },
   { icon: CalendarCheck, title: "Register for events", text: "Join workshops, webinars and career fairs, with live seat availability." },
];

const orgFeatures = [
   { icon: PenSquare, title: "Post internships", text: "Publish roles with stipend, duration, work mode and an application deadline." },
   { icon: CalendarCheck, title: "Host events", text: "Post workshops and career fairs with a seat limit and registration deadline." },
   { icon: ClipboardList, title: "Review applicants", text: "Read each applicant's profile and resume, and update their status." },
   { icon: BarChart3, title: "See your numbers", text: "Active roles, applications and hires, compared with the previous week." },
];

const steps = [
   { icon: UserPlus, title: "Create an account", text: "Sign up as a student or an organisation. It takes a minute." },
   { icon: Search, title: "Find what fits", text: "Browse internships and upcoming career events in one place." },
   { icon: CheckCircle2, title: "Apply or register", text: "Send applications and save your seat, then track it all from your dashboard." },
];

const FeatureList = ({ items }) => (
   <ul className="mt-6 space-y-5">
      {items.map(({ icon, title, text }) => {
         const ItemIcon = icon;
         return (
         <li key={title} className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
               <ItemIcon className="h-4 w-4" />
            </span>
            <div>
               <p className="text-sm font-semibold text-text">{title}</p>
               <p className="mt-0.5 text-sm text-label">{text}</p>
            </div>
         </li>
         );
      })}
   </ul>
);

const LandingPage = () => {
   const [jobs, setJobs] = useState(null);
   const [events, setEvents] = useState(null);

   // Live numbers and preview cards from the real platform
   useEffect(() => {
      axiosInstance
         .get(API_PATHS.JOBS.GET_ALL_JOBS)
         .then((res) => setJobs((res.data || []).filter((j) => !j.isClosed && !(daysUntil(j.deadline) < 0))))
         .catch(() => setJobs([]));
      axiosInstance
         .get(API_PATHS.EVENTS.GET_ALL_EVENTS)
         .then((res) =>
            setEvents(
               (res.data || [])
                  .filter((e) => daysUntil(e.endDate || e.date) >= 0)
                  .sort((a, b) => new Date(a.date) - new Date(b.date)),
            ),
         )
         .catch(() => setEvents([]));
   }, []);

   const previewJob = jobs?.[0] || SAMPLE_JOB;
   const previewEvent = events?.[0] || SAMPLE_EVENT;
   const hasLiveCounts = jobs !== null && events !== null && (jobs.length || events.length);

   return (
      <div className="min-h-screen bg-white text-paragraph">
         {/* ── NAV ── */}
         <header className="sticky top-0 z-50 border-b border-outline bg-white/95">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
               <Link to="/" aria-label="Beaconn home">
                  <BeaconnLogo />
               </Link>
               <nav className="hidden items-center gap-8 text-sm text-label md:flex" aria-label="Sections">
                  <a href="#students" className="hover:text-text">For students</a>
                  <a href="#organisations" className="hover:text-text">For organisations</a>
                  <a href="#how" className="hover:text-text">How it works</a>
               </nav>
               <div className="flex items-center gap-2">
                  <Link to="/Login" className="rounded-lg px-3 py-2 text-sm font-semibold text-text hover:bg-neutral">
                     Sign in
                  </Link>
                  <Link
                     to="/Signup"
                     className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     Get started
                  </Link>
               </div>
            </div>
         </header>

         <main>
            {/* ── HERO ── */}
            <section className="border-b border-outline bg-background">
               <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
                  <div>
                     <p className="text-sm font-semibold text-primary">
                        Internships and career events for students
                     </p>
                     <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-text sm:text-5xl">
                        Find your first internship, and the events that get you there.
                     </h1>
                     <p className="mt-5 max-w-lg text-base leading-relaxed text-label sm:text-lg">
                        Beaconn brings internships and career events into one place. Students search,
                        apply and register; organisations post roles and events and manage applicants.
                     </p>
                     <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                           to="/Signup"
                           className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary"
                        >
                           Create a free account <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                           to="/Login"
                           className="rounded-lg border border-outline bg-white px-5 py-3 text-sm font-semibold text-text hover:border-primary/40"
                        >
                           Sign in
                        </Link>
                     </div>
                     {hasLiveCounts ? (
                        <p className="mt-8 flex items-center gap-2 text-sm text-label">
                           <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                           </span>
                           <span className="tabular">
                              <strong className="font-semibold text-text">{jobs.length}</strong> open internships ·{" "}
                              <strong className="font-semibold text-text">{events.length}</strong> upcoming events right now
                           </span>
                        </p>
                     ) : null}
                  </div>

                  {/* Product preview: the real cards students see */}
                  <div className="relative" aria-label="Preview of Beaconn listings">
                     <div className="space-y-3 rounded-2xl border border-outline bg-white p-4 shadow-[0_24px_48px_-24px_rgba(16,26,58,0.18)] sm:p-5">
                        <div className="flex items-center justify-between">
                           <p className="text-sm font-semibold text-text">Find opportunities</p>
                           <span className="text-xs text-muted">Live preview</span>
                        </div>
                        <div className="pointer-events-none space-y-3" aria-hidden="true">
                           <JobCard job={previewJob} />
                           <EventCard event={previewEvent} />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* ── AUDIENCES ── */}
            <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2">
               <div id="students" className="scroll-mt-24 rounded-2xl border border-outline p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                     <GraduationCap className="h-5 w-5" /> For students
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-text">Everything for your search, in one place.</h2>
                  <FeatureList items={studentFeatures} />
                  <Link
                     to="/Signup"
                     className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                     Join as a student <ArrowRight className="h-4 w-4" />
                  </Link>
               </div>

               <div id="organisations" className="scroll-mt-24 rounded-2xl border border-outline p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                     <Building2 className="h-5 w-5" /> For organisations
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-text">Reach students and manage applicants.</h2>
                  <FeatureList items={orgFeatures} />
                  <Link
                     to="/Signup"
                     className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                     Join as an organisation <ArrowRight className="h-4 w-4" />
                  </Link>
               </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" className="scroll-mt-16 border-y border-outline bg-background">
               <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
                  <h2 className="text-2xl font-semibold text-text sm:text-3xl">How it works</h2>
                  <ol className="mt-10 grid gap-8 md:grid-cols-3">
                     {steps.map(({ icon, title, text }, i) => {
                     const StepIcon = icon;
                     return (
                        <li key={title} className="relative border-t-2 border-primary pt-5">
                           <div className="flex items-center justify-between">
                              <span className="tabular text-sm font-semibold text-primary">
                                 Step {i + 1}
                              </span>
                              <StepIcon className="h-5 w-5 text-icon" />
                           </div>
                           <h3 className="mt-3 text-lg font-semibold text-text">{title}</h3>
                           <p className="mt-1 text-sm text-label">{text}</p>
                        </li>
                     );
                     })}
                  </ol>
               </div>
            </section>

            {/* ── CTA ── */}
            <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
               <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-6 py-10 text-white sm:px-10 md:flex-row md:items-center">
                  <div>
                     <h2 className="text-2xl font-semibold">Ready to start?</h2>
                     <p className="mt-1 text-sm text-white/75">
                        Create an account to apply for internships and register for events.
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     <Link
                        to="/Signup"
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-white/90"
                     >
                        Get started <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link
                        to="/Login"
                        className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                     >
                        Sign in
                     </Link>
                  </div>
               </div>
            </section>
         </main>

         <footer className="border-t border-outline">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-label sm:flex-row sm:items-center sm:px-6">
               <BeaconnLogo markClassName="h-6 w-6" />
               <p className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-icon" />
                  Internships and career events for students.
               </p>
            </div>
         </footer>
      </div>
   );
};

export default LandingPage;

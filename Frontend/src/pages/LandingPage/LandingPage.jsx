import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
   ArrowUpRight,
   BadgeCheck,
   Briefcase,
   GraduationCap,
   Search,
   Send,
   Sparkles,
   Target,
   UserPlus,
   Users,
} from "lucide-react";

import SectionHeader from "./components/SectionHeader";
import FeatureCard from "./components/FeatureCard";
import RoleCard from "./components/RoleCard";
import StatCard from "./components/StatCard";

const steps = [
   {
      icon: UserPlus,
      title: "Create your profile",
      description:
         "Set your skills, interests, and goals in under two minutes.",
   },
   {
      icon: Search,
      title: "Discover internships",
      description:
         "Browse curated roles matched to your profile and interests.",
   },
   {
      icon: Send,
      title: "Apply in one click",
      description:
         "Submit applications quickly and track each step in one place.",
   },
   {
      icon: BadgeCheck,
      title: "Grow with feedback",
      description:
         "Get clear updates and next steps from responsive teams.",
   },
];

const features = [
   {
      icon: Target,
      title: "Internship-first clarity",
      description:
         "Every listing is focused on internships so you know exactly where to start.",
   },
   {
      icon: Users,
      title: "Simple organization tools",
      description:
         "Teams can post, review, and respond without messy email chains.",
   },
   {
      icon: Sparkles,
      title: "Guided next steps",
      description:
         "Friendly prompts help applicants build profiles and apply with confidence.",
   },
   {
      icon: Briefcase,
      title: "Growth-ready foundation",
      description:
         "Designed to expand into full-time roles, events, and mentorship soon.",
   },
];

const LandingPage = () => {
   useEffect(() => {
      const elements = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
         (entries, obs) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  obs.unobserve(entry.target);
               }
            });
         },
         { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
   }, []);

   return (
      <div className="min-h-screen bg-neutral text-paragraph">
         <nav className="sticky top-0 z-50 border-b border-outline/60 bg-neutral/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
               <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                     B
                  </span>
                  Beaconn
               </div>
               <div className="hidden items-center gap-8 text-sm text-label md:flex">
                  <a href="#features" className="hover:text-primary">
                     Features
                  </a>
                  <a href="#paths" className="hover:text-primary">
                     Paths
                  </a>
                  <a href="#steps" className="hover:text-primary">
                     How it works
                  </a>
               </div>
               <div className="flex items-center gap-3">
                  <Link
                     to="/Login"
                     className="rounded-full px-4 py-2 text-sm font-semibold text-primary transition hover:bg-white"
                  >
                     Sign in
                  </Link>
                  <Link
                     to="/Signup"
                     className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                  >
                     Sign up
                  </Link>
               </div>
            </div>
         </nav>

         <section className="relative overflow-hidden">
            <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 pb-20 pt-10 sm:pt-12 lg:grid-cols-[1.1fr_0.9fr]">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-outline bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-label">
                     <Sparkles className="h-4 w-4 text-accent" />
                     Career development platform
                  </div>
                  <h1 className="text-4xl font-semibold text-primary sm:text-5xl lg:text-6xl">
                     Beaconn is a guiding light for emerging careers.
                  </h1>
                  <p className="text-base text-paragraph sm:text-lg">
                     A clean, friendly place to discover internships, connect
                     with organizations, and take your first confident step into
                     the industry. Built to expand into a full career platform
                     as we grow.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                     <Link
                        to="/Signup"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 sm:px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                     >
                        Start your journey
                        <ArrowUpRight className="h-4 w-4" />
                     </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                     <StatCard value="200+" label="Internship Roles" />
                     <StatCard value="3k+" label="Active Applicants" />
                     <StatCard value="60+" label="Partner Teams" />
                  </div>
               </div>

               <div className="relative reveal">
                  <div className="rounded-3xl border border-outline bg-white/90 p-8 shadow-lg">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-xs uppercase tracking-[0.2em] text-label">
                              Internship spotlight
                           </p>
                           <h3 className="mt-2 text-xl font-semibold text-primary">
                              Beaconn Launch Internships
                           </h3>
                        </div>
                        <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                           Now open
                        </span>
                     </div>
                     <p className="mt-4 text-sm text-paragraph">
                        Fresh roles from trusted teams, designed for students
                        and early career talent who want real-world experience.
                     </p>
                     <div className="mt-6 space-y-4">
                        {[
                           {
                              icon: Briefcase,
                              label: "Internship-first opportunities",
                           },
                           {
                              icon: Target,
                              label: "Clear role expectations",
                           },
                           {
                              icon: Users,
                              label: "Hiring teams ready to respond",
                           },
                        ].map((item) => (
                           <div
                              key={item.label}
                              className="flex items-center gap-3 text-sm text-label"
                           >
                              <item.icon className="h-4 w-4 text-accent" />
                              {item.label}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 hidden rounded-2xl border border-outline bg-white/90 p-4 shadow-md lg:block">
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral">
                           <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                           <p className="text-xs uppercase tracking-[0.2em] text-label">
                              Match rate
                           </p>
                           <p className="text-lg font-semibold text-primary">
                              92% verified fit
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section id="paths" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16 reveal">
            <SectionHeader
               eyebrow="Choose your path"
               title="Two tailored experiences, one shared mission."
               subtitle="Whether you are growing your career or building a team, Beaconn keeps everything focused and easy to navigate."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
               <div className="reveal" style={{ "--delay": "60ms" }}>
                  <RoleCard
                     icon={GraduationCap}
                     title="For Candidates"
                     description="Build your career with curated internship roles, quick applications, and direct access to teams who want to meet you."
                     bullets={[
                        "Personalized internship feed",
                        "Profile-first application flow",
                        "Clear next-step guidance",
                     ]}
                     actionLabel="Build your career"
                     actionTo="/Signup"
                  />
               </div>
               <div className="reveal" style={{ "--delay": "120ms" }}>
                  <RoleCard
                     icon={Briefcase}
                     title="For Organizations"
                     description="Post internship opportunities and meet motivated applicants with a workflow that keeps hiring simple."
                     bullets={[
                        "Targeted internship posting",
                        "Shortlists in one dashboard",
                        "Fast feedback loops",
                     ]}
                     actionLabel="Post opportunities"
                     actionTo="/Signup"
                  />
               </div>
            </div>
         </section>

         <section id="features" className="relative overflow-hidden py-12 sm:py-16 reveal">
            <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
               <div className="rounded-3xl border border-outline bg-white/80 p-8 shadow-lg backdrop-blur">
                  <SectionHeader
                     eyebrow="Why Beaconn"
                     title="A welcoming start for new careers."
                     subtitle="Beaconn is a steady guide for people building a future without a clear platform. We are focused on internships today, and growing toward a full career journey tomorrow."
                  />
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                     {features.map((feature, index) => (
                        <div
                           key={feature.title}
                           className="reveal"
                           style={{ "--delay": `${index * 60}ms` }}
                        >
                           <FeatureCard {...feature} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section id="steps" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16 reveal">
            <div className="flex flex-col gap-10">
               <SectionHeader
                  eyebrow="How it works"
                  title="Four simple steps to your first internship."
                  subtitle="No clutter. Just a clear path from profile to offer-ready."
               />
               <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="absolute left-6 right-6 top-1/2 hidden h-px -translate-y-1/2 bg-outline/70 lg:block" />
                  {steps.map((step, index) => (
                     <div
                        key={step.title}
                        className="relative rounded-3xl border border-outline bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md reveal"
                        style={{ "--delay": `${index * 70}ms` }}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral">
                              <step.icon className="h-5 w-5 text-primary" />
                           </div>
                           <span className="text-xs font-semibold text-label">
                              0{index + 1}
                           </span>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-primary">
                           {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-paragraph">
                           {step.description}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className="relative overflow-hidden py-12 sm:py-16 reveal">
            <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
               <div className="grid items-center gap-10 rounded-3xl border border-outline bg-primary px-8 py-10 text-white shadow-xl md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                     <span className="text-xs uppercase tracking-[0.25em] text-white/70">
                        Ready to get started
                     </span>
                     <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                        Your internship journey starts with one account.
                     </h2>
                     <p className="mt-3 text-sm text-white/80">
                        Join Beaconn today, build your profile, and start
                        applying to internships designed for early talent.
                     </p>
                     <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                           to="/Signup"
                           className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-neutral"
                        >
                           Create your account
                        </Link>
                        <Link
                           to="/Login"
                           className="inline-flex items-center rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                           Sign in
                        </Link>
                     </div>
                  </div>
                  <div className="grid gap-4">
                     {[
                        "Profile in minutes",
                        "Internship-only listings",
                        "Track every application",
                     ].map((item) => (
                        <div
                           key={item}
                           className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4"
                        >
                           <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                              <Sparkles className="h-5 w-5" />
                           </span>
                           <span className="text-sm font-semibold">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 text-sm text-label reveal">
            <div className="flex flex-col gap-4 border-t border-outline pt-6 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-3 text-primary font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-xs">
                     B
                  </span>
                  Beaconn
               </div>
               <div className="flex flex-wrap items-center gap-4">
                  <span>Modern career development, built for 2026.</span>
                  <span className="text-xs text-label">(c) 2026 Beaconn</span>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default LandingPage;


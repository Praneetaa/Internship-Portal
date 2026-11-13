import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
   ArrowRight,
   BadgeCheck,
   Briefcase,
   CalendarDays,
   GraduationCap,
   Search,
   Send,
   Sparkles,
   Target,
   UserPlus,
   Users,
   CheckCircle2,
   Zap,
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
      description: "Get clear updates and next steps from responsive teams.",
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
      icon: CalendarDays,
      title: "Events & workshops",
      description:
         "Join webinars, seminars, and career events posted by top organizations.",
   },
   {
      icon: Zap,
      title: "Growth-ready foundation",
      description:
         "Designed to expand into full-time roles, mentorship, and more.",
   },
];

const highlights = [
   "Profile in under 2 minutes",
   "Internship-only listings",
   "Track every application",
   "Events & career workshops",
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
         { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
   }, []);

   return (
      <div className="min-h-screen bg-neutral text-paragraph">
         {/* ── NAV ── */}
         <nav className="sticky top-0 z-50 border-b border-outline/60 bg-neutral/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
               <Link
                  to="/"
                  className="flex items-center gap-2.5 text-xl font-bold text-primary"
               >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold">
                     B
                  </span>
                  Beaconn
               </Link>
               <div className="hidden items-center gap-8 text-sm text-label md:flex">
                  <a href="#features" className="hover:text-primary transition">
                     Features
                  </a>
                  <a href="#paths" className="hover:text-primary transition">
                     Paths
                  </a>
                  <a href="#steps" className="hover:text-primary transition">
                     How it works
                  </a>
               </div>
               <div className="flex items-center gap-2">
                  <Link
                     to="/Login"
                     className="rounded-full px-4 py-2 text-sm font-semibold text-primary transition hover:bg-white"
                  >
                     Sign in
                  </Link>
                  <Link
                     to="/Signup"
                     className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                  >
                     Get started <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
               </div>
            </div>
         </nav>

         {/* ── HERO ── */}
         <section className="relative overflow-hidden">
            {/* Blobs */}
            <div className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-secondary/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 pb-24 pt-14 lg:grid-cols-[1.15fr_0.85fr]">
               {/* Left copy */}
               <div className="space-y-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-outline bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-label shadow-sm">
                     <Sparkles className="h-3.5 w-3.5 text-accent" />
                     Career development platform
                  </div>
                  <h1 className="text-4xl font-bold text-primary leading-tight sm:text-5xl lg:text-[3.5rem]">
                     Beaconn is a guiding light for{" "}
                     <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        emerging careers.
                     </span>
                  </h1>
                  <p className="text-base text-paragraph sm:text-lg max-w-lg leading-relaxed">
                     Discover internships, join career events, and connect with
                     organizations — all in one clean, focused platform built
                     for early talent.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                     <Link
                        to="/Signup"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
                     >
                        Start your journey <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link
                        to="/Login"
                        className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-neutral"
                     >
                        Sign in
                     </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                     <StatCard value="200+" label="Open Roles" />
                     <StatCard value="3k+" label="Candidates" />
                     <StatCard value="60+" label="Partners" />
                  </div>
               </div>

               {/* Right spotlight card */}
               <div className="relative reveal">
                  <div className="rounded-3xl border border-outline bg-white/95 p-7 shadow-xl backdrop-blur">
                     <div className="flex items-start justify-between gap-3">
                        <div>
                           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-label">
                              Internship spotlight
                           </p>
                           <h3 className="mt-2 text-xl font-bold text-primary">
                              Beaconn Launch Internships
                           </h3>
                        </div>
                        <span className="flex-shrink-0 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                           Now open
                        </span>
                     </div>
                     <p className="mt-4 text-sm text-paragraph leading-relaxed">
                        Fresh roles from trusted teams, designed for students
                        and early career talent who want real-world experience.
                     </p>
                     <div className="mt-5 space-y-3">
                        {[
                           {
                              icon: Briefcase,
                              label: "Internship-first opportunities",
                           },
                           { icon: Target, label: "Clear role expectations" },
                           {
                              icon: CalendarDays,
                              label: "Career events & workshops",
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
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                 <item.icon className="h-3.5 w-3.5 text-primary" />
                              </div>
                              {item.label}
                           </div>
                        ))}
                     </div>
                     <Link
                        to="/Signup"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                     >
                        Browse internships <ArrowRight className="h-4 w-4" />
                     </Link>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-outline bg-white/95 p-4 shadow-lg lg:block">
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                           <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                           <p className="text-xs text-label">
                              Verified fit rate
                           </p>
                           <p className="text-lg font-bold text-primary">
                              92% match
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ── PATHS ── */}
         <section
            id="paths"
            className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 reveal"
         >
            <SectionHeader
               eyebrow="Choose your path"
               title="Two tailored experiences, one shared mission."
               subtitle="Whether you are growing your career or building a team, Beaconn keeps everything focused and easy to navigate."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
               <div className="reveal">
                  <RoleCard
                     icon={GraduationCap}
                     title="For Candidates"
                     description="Build your career with curated internship roles, career events, quick applications, and direct access to teams who want to meet you."
                     bullets={[
                        "Personalized internship feed",
                        "Browse & register for events",
                        "Clear next-step guidance",
                     ]}
                     actionLabel="Build your career"
                     actionTo="/Signup"
                  />
               </div>
               <div className="reveal" style={{ "--delay": "80ms" }}>
                  <RoleCard
                     icon={Briefcase}
                     title="For Organizations"
                     description="Post internship opportunities and events, then meet motivated applicants with a workflow that keeps hiring simple."
                     bullets={[
                        "Targeted internship posting",
                        "Post workshops & webinars",
                        "Shortlists in one dashboard",
                     ]}
                     actionLabel="Post opportunities"
                     actionTo="/Signup"
                  />
               </div>
            </div>
         </section>

         {/* ── FEATURES ── */}
         <section
            id="features"
            className="relative overflow-hidden py-16 reveal"
         >
            <div className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
               <div className="rounded-3xl border border-outline bg-white/85 p-8 shadow-lg backdrop-blur">
                  <SectionHeader
                     eyebrow="Why Beaconn"
                     title="A welcoming start for new careers."
                     subtitle="Beaconn is a steady guide for people building a future. We are focused on internships and events today, growing toward a full career journey tomorrow."
                  />
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                     {features.map((feature, i) => (
                        <div
                           key={feature.title}
                           className="reveal"
                           style={{ "--delay": `${i * 60}ms` }}
                        >
                           <FeatureCard {...feature} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* ── HOW IT WORKS ── */}
         <section
            id="steps"
            className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 reveal"
         >
            <SectionHeader
               eyebrow="How it works"
               title="Four simple steps to your first internship."
               subtitle="No clutter. Just a clear path from profile to offer-ready."
            />
            <div className="relative mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
               <div className="absolute left-6 right-6 top-[2.2rem] hidden h-px bg-gradient-to-r from-outline via-primary/20 to-outline lg:block" />
               {steps.map((step, i) => (
                  <div
                     key={step.title}
                     className="relative rounded-2xl border border-outline bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md reveal"
                     style={{ "--delay": `${i * 70}ms` }}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                           <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-outline">
                           0{i + 1}
                        </span>
                     </div>
                     <h3 className="mt-5 text-base font-bold text-primary">
                        {step.title}
                     </h3>
                     <p className="mt-2 text-sm text-paragraph leading-relaxed">
                        {step.description}
                     </p>
                  </div>
               ))}
            </div>
         </section>

         {/* ── CTA ── */}
         <section className="relative overflow-hidden py-16 reveal">
            <div className="pointer-events-none absolute inset-0 -z-10">
               <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
               <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            </div>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
               <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-outline/20 bg-primary px-8 py-12 shadow-2xl md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                     <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        Ready to get started
                     </span>
                     <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl leading-tight">
                        Your internship journey starts with one account.
                     </h2>
                     <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-md">
                        Join Beaconn today, build your profile, and start
                        applying to internships and career events designed for
                        early talent.
                     </p>
                     <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                           to="/Signup"
                           className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:bg-neutral"
                        >
                           Create your account{" "}
                           <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                           to="/Login"
                           className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                           Sign in
                        </Link>
                     </div>
                  </div>
                  <div className="grid gap-3">
                     {highlights.map((item) => (
                        <div
                           key={item}
                           className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                        >
                           <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                           </span>
                           <span className="text-sm font-semibold text-white">
                              {item}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* ── FOOTER ── */}
         <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
            <div className="flex flex-col gap-4 border-t border-outline pt-6 sm:flex-row sm:items-center sm:justify-between text-sm text-label">
               <Link
                  to="/"
                  className="flex items-center gap-2.5 font-bold text-primary"
               >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                     B
                  </span>
                  Beaconn
               </Link>
               <div className="flex flex-wrap items-center gap-6">
                  <a href="#features" className="hover:text-primary transition">
                     Features
                  </a>
                  <a href="#paths" className="hover:text-primary transition">
                     Paths
                  </a>
                  <a href="#steps" className="hover:text-primary transition">
                     How it works
                  </a>
               </div>
               <span className="text-xs">
                  © 2026 Beaconn · Modern career development
               </span>
            </div>
         </footer>
      </div>
   );
};

export default LandingPage;

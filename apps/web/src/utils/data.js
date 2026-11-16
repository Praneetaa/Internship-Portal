import {
   Search,
   User,
   FileText,
   MessageSquare,
   BarChart3,
   Shield,
   Clock,
   Award,
   Briefcase,
   Building2,
   LayoutDashboard,
   Plus,
   Users,
   Heart,
   Bookmark,
   CalendarDays,
   CalendarPlus,
   CalendarCheck,
} from "lucide-react";

export const candidateFeatures = [
   {
      icon: Search,
      title: "Smart Job Matching",
      description:
         "AI- powered algorithm match you with  relevant opportunities based on your skills and preferences",
   },
   {
      icon: FileText,
      title: "Resume Builder",
      description:
         "Create professional resume with our intuitive builder and templates design by experts.",
   },
   {
      icon: MessageSquare,
      title: "Direct Communication",
      description:
         "Showcase your abilities with verified skill tests and earn badges that employers trust.",
   },
];

export const employerFeatures = [
   {
      icon: Users,
      title: "Talent Pool Access",
      description:
         "Access our vast database of pre-screened candidates and find the perfect fit for your team",
   },
   {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
         "Track your hiring performance wih detail analytics and insights on candidate engagement",
   },
   {
      icon: Shield,
      title: "Verified Candidates",
      description:
         "All candidates undergo background verification to ensure you are hiring trustworthy professional",
   },

   {
      icon: Clock,
      title: "Quick Hiring",
      description:
         "Streamlined hiring process reduces time-to-hire by 60% with automated screening tools",
   },
];

//Navigation items configuration (grouped into labelled sections in the sidebar)
export const NAVIGATION_MENU = [
   { id: "organization-dashboard", name: "Dashboard", icon: LayoutDashboard, section: "Overview" },
   { id: "post-job", name: "Post internship", icon: Plus, section: "Internships" },
   { id: "manage-jobs", name: "Manage internships", icon: Briefcase, section: "Internships" },
   { id: "applications", name: "Applications", icon: FileText, section: "Internships" },
   { id: "post-event", name: "Post event", icon: CalendarPlus, section: "Events" },
   { id: "manage-events", name: "Manage events", icon: CalendarDays, section: "Events" },
   { id: "company-profile", name: "Company profile", icon: Building2, section: "Company" },
];

export const NAVIGATION_MENU_APPLICANT = [
   { id: "find-jobs", name: "Find opportunities", icon: Search, section: "Discover" },
   { id: "saved-jobs", name: "Saved", icon: Bookmark, section: "My activity" },
   { id: "my-applications", name: "My applications", icon: FileText, section: "My activity" },
   { id: "my-events", name: "My events", icon: CalendarCheck, section: "My activity" },
   { id: "candidate-profile", name: "Profile", icon: User, section: "Account" },
];

//Categories and job types
export const CATEGORIES = [
   { value: "Engineering", label: "Engineering" },
   { value: "Design", label: "Design" },
   { value: "Marketing", label: "Marketing" },
   { value: "Sales", label: "Sales" },
   { value: "IT & Software", label: "IT & Software" },
   { value: "Customer-service", label: "Customer service" },
   { value: "Product", label: "Product" },
   { value: "Operations", label: "Operations" },
   { value: "Finance", label: "Finance" },
   { value: "HR", label: "Human Resources" },
   { value: "Other", label: "Other" },
];

export const WORK_MODE = [
   { value: "Remote", label: "Remote" },
   { value: "Hybrid", label: "Hybrid" },
   { value: "On-site", label: "On-site" },
];
export const EVENT_TYPES = [
   { value: "Workshop", label: "Workshop" },
   { value: "Webinar", label: "Webinar" },
   { value: "Seminar", label: "Seminar" },
   { value: "Networking", label: "Networking" },
   { value: "Career Fair", label: "Career Fair" },
   { value: "Other", label: "Other" },
];

export const EVENT_MODES = [
   { value: "Online", label: "Online" },
   { value: "In-Person", label: "In-Person" },
   { value: "Hybrid", label: "Hybrid" },
];

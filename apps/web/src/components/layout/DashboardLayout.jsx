import { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
import ProfileDropdown from "./ProfileDropdown";
import BeaconnLogo from "../brand/BeaconnLogo";

/** Group nav items by their `section`, keeping the original order. */
const groupBySection = (items) =>
   items.reduce((groups, item) => {
      const name = item.section || "";
      const group = groups.find((g) => g.name === name);
      if (group) group.items.push(item);
      else groups.push({ name, items: [item] });
      return groups;
   }, []);

const DashboardLayout = ({
   activeMenu,
   navItems = NAVIGATION_MENU,
   children,
}) => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   const activeNavItem = activeMenu || navItems[0]?.id;
   const homePath = `/${navItems[0]?.id || ""}`;

   //Handle responsive behavior
   useEffect(() => {
      const handleResize = () => {
         const mobile = window.innerWidth < 768;
         setIsMobile(mobile);
         if (!mobile) setSidebarOpen(false);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   //Close dropdowns when clicking outside
   useEffect(() => {
      const handleClickOutside = () => {
         if (profileDropdownOpen) setProfileDropdownOpen(false);
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, [profileDropdownOpen]);

   const handleNavigation = (itemId) => {
      navigate(`/${itemId}`);
      if (isMobile) setSidebarOpen(false);
   };

   return (
      <div className="flex min-h-screen bg-background text-paragraph">
         {isMobile && sidebarOpen && (
            <div
               className="fixed inset-0 z-40 bg-text/30"
               onClick={() => setSidebarOpen(false)}
               aria-hidden="true"
            />
         )}

         {/*Sidebar*/}
         <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-outline bg-white transition-transform duration-300 ${
               isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
            }`}
         >
            <div className="flex h-16 items-center justify-between px-5">
               <Link to={homePath} aria-label="Beaconn home">
                  <BeaconnLogo />
               </Link>
               {isMobile && (
                  <button
                     type="button"
                     onClick={() => setSidebarOpen(false)}
                     className="rounded-lg p-2 text-label hover:bg-neutral"
                     aria-label="Close menu"
                  >
                     <X className="h-5 w-5" />
                  </button>
               )}
            </div>

            {/*Navigation*/}
            <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2" aria-label="Main">
               {groupBySection(navItems).map((group) => (
                  <div key={group.name || "main"} className="mt-4 first:mt-0">
                     {group.name && (
                        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                           {group.name}
                        </p>
                     )}
                     <div className="space-y-0.5">
                        {group.items.map((item) => {
                           const Icon = item.icon;
                           const isActive = activeNavItem === item.id;
                           return (
                              <button
                                 key={item.id}
                                 type="button"
                                 onClick={() => handleNavigation(item.id)}
                                 aria-current={isActive ? "page" : undefined}
                                 className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                       ? "bg-primary/[0.07] text-primary"
                                       : "text-label hover:bg-neutral hover:text-text"
                                 }`}
                              >
                                 {isActive && (
                                    <span className="absolute -left-3 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                                 )}
                                 <Icon
                                    className={`h-[18px] w-[18px] ${isActive ? "text-primary" : "text-icon"}`}
                                 />
                                 <span>{item.name}</span>
                              </button>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </nav>

            {/*Logout*/}
            <div className="border-t border-outline p-3">
               <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-label transition-colors hover:bg-neutral hover:text-text"
                  onClick={logout}
               >
                  <LogOut className="h-[18px] w-[18px] text-icon" />
                  Log out
               </button>
            </div>
         </aside>

         <div className="flex min-w-0 flex-1 flex-col md:ml-64">
            {/* Top bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-outline bg-white/95 px-4 md:justify-end md:px-8">
               {isMobile && (
                  <div className="flex items-center gap-2">
                     <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-label hover:bg-neutral"
                        aria-label="Open menu"
                     >
                        <Menu className="h-5 w-5" />
                     </button>
                     <BeaconnLogo markClassName="h-7 w-7" />
                  </div>
               )}
               <ProfileDropdown
                  user={user}
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                     e.stopPropagation();
                     setProfileDropdownOpen((prev) => !prev);
                  }}
                  onLogout={logout}
               />
            </header>

            {/*Main content area*/}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
               {children}
            </main>
         </div>
      </div>
   );
};

export default DashboardLayout;

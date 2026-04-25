import { useState, useEffect } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({
   activeMenu,
   navItems = NAVIGATION_MENU,
   children,
}) => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [activeNavItem, setActiveNavItem] = useState(
      activeMenu || "organization-dashboard",
   );
   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

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

   useEffect(() => {
      const handleClickOutside = () => {
         if (profileDropdownOpen) setProfileDropdownOpen(false);
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, [profileDropdownOpen]);

   const handleNavigation = (itemId) => {
      setActiveNavItem(itemId);
      navigate(`/${itemId}`);
      if (isMobile) setSidebarOpen(false);
   };

   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

   return (
      <div className="flex min-h-screen bg-background text-text">
         {/* Mobile overlay */}
         {isMobile && sidebarOpen && (
            <div
               className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
               onClick={toggleSidebar}
               aria-hidden="true"
            />
         )}

         {/* Sidebar */}
         <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-outline/60 bg-white transition-transform duration-300 ${
               isMobile
                  ? sidebarOpen
                     ? "translate-x-0 shadow-2xl"
                     : "-translate-x-full"
                  : "translate-x-0"
            }`}
         >
            {/* Brand header */}
            <div className="flex h-16 items-center justify-between border-b border-outline/60 bg-gradient-to-r from-primary/5 to-secondary/5 px-5">
               <Link
                  className="flex items-center gap-3"
                  to="/organization-dashboard"
               >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-sm">
                     <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-primary">
                     Beaconn
                  </span>
               </Link>
               {isMobile && (
                  <button
                     type="button"
                     onClick={toggleSidebar}
                     className="cursor-pointer rounded-lg p-1.5 text-label transition hover:bg-neutral"
                     aria-label="Close sidebar"
                  >
                     <X className="h-4 w-4" />
                  </button>
               )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
               <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                  Menu
               </p>
               <div className="space-y-0.5">
                  {navItems.map((item) => {
                     const Icon = item.icon;
                     const isActive = activeNavItem === item.id;
                     return (
                        <button
                           key={item.id}
                           type="button"
                           onClick={() => handleNavigation(item.id)}
                           className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                              isActive
                                 ? "bg-primary/10 text-primary"
                                 : "text-label hover:bg-neutral hover:text-text"
                           }`}
                        >
                           {isActive && (
                              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                           )}
                           <Icon
                              className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-icon group-hover:text-text"}`}
                           />
                           <span>{item.name}</span>
                        </button>
                     );
                  })}
               </div>
            </nav>

            {/* Logout */}
            <div className="border-t border-outline/60 p-3">
               <button
                  type="button"
                  onClick={logout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-label transition hover:bg-red-50 hover:text-error"
               >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  <span>Logout</span>
               </button>
            </div>
         </aside>

         {/* Main area */}
         <div className="flex flex-1 flex-col md:ml-64">
            {/* Top bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline/60 bg-white/95 px-4 backdrop-blur-md sm:px-6">
               {isMobile && (
                  <button
                     type="button"
                     onClick={toggleSidebar}
                     className="cursor-pointer rounded-xl p-2 text-label transition hover:bg-neutral"
                     aria-label="Open sidebar"
                  >
                     <Menu className="h-5 w-5" />
                  </button>
               )}
               <div className="flex-1" />
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

            {/* Page content */}
            <main className="flex-1 overflow-auto p-5 sm:p-6 lg:p-8">
               {children}
            </main>
         </div>
      </div>
   );
};

export default DashboardLayout;

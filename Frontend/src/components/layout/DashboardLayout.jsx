import { useState, useEffect } from "react";
import { Briefcase, Building2, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ activeMenu, children }) => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [activeNavItem, setActiveNavItem] = useState(
      activeMenu || "organization-dashboard",
   );
   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   //Handle responsive behavior
   useEffect(() => {
      const handleResize = () => {
         const mobile = window.innerWidth < 768;
         setIsMobile(mobile);
         if (!mobile) {
            setSidebarOpen(false);
         }
      };
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   //Close dropdowns when clicking outside
   useEffect(() => {
      const handleClickOutside = () => {
         if (profileDropdownOpen) {
            setProfileDropdownOpen(false);
         }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, [profileDropdownOpen]);
   const handleNavigation = (itemId) => {
      setActiveNavItem(itemId);
      navigate(`/${itemId}`);
      if (isMobile) {
         setSidebarOpen(false);
      }
   };

   const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
   };

   const sidebarCollapsed = !isMobile && false;

   return (
      <div className="flex min-h-screen bg-neutral text-paragraph">
         {isMobile && sidebarOpen && (
            <div
               className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
               onClick={toggleSidebar}
               aria-hidden="true"
            />
         )}
         {/*Sidebar*/}
         <div
            className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
               isMobile
                  ? sidebarOpen
                     ? "translate-x-0"
                     : "-translate-x-full"
                  : "translate-x-0"
            } ${sidebarCollapsed ? "w-16" : "w-64"} bg-white border-r border-outline`}
         >
            {/*Company Logo*/}
            <div className="flex items-center justify-between h-16 border-b border-outline bg-white/70 px-6">
               {!sidebarCollapsed ? (
                  <Link className="flex items-center space-x-3" to="/">
                     <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                     </div>
                     <span className="text-primary font-bold text-xl">
                        Beaconn
                     </span>
                  </Link>
               ) : (
                  <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                     <Building2 className="h-5 w-5 text-white" />
                  </div>
               )}
               {isMobile && (
                  <button
                     type="button"
                     onClick={toggleSidebar}
                     className="rounded-lg p-2 text-label hover:bg-neutral"
                     aria-label="Close sidebar"
                  >
                     <X className="h-5 w-5" />
                  </button>
               )}
            </div>
            {/*Navigation*/}
            <nav className="mt-6 space-y-1 px-3">
               {NAVIGATION_MENU.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavItem === item.id;
                  return (
                     <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigation(item.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                           isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-label hover:bg-neutral hover:text-primary"
                        }`}
                     >
                        <Icon className="h-5 w-5" />
                        {!sidebarCollapsed && <span>{item.name}</span>}
                     </button>
                  );
               })}
            </nav>

            {/*Logout*/}
            <div className="absolute bottom-4 left-4 right-4">
               <button
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-label hover:bg-neutral hover:text-primary transition-all duration-200"
                  onClick={logout}
               >
                  <LogOut className="h-5 w-5 flex-shrink-0 text-icon" />
                  {!sidebarCollapsed && <span className="ml-3">Logout</span>}
               </button>
            </div>
         </div>

         <div className="flex-1 ml-0 md:ml-64">
            {isMobile && (
               <div className="flex items-center justify-between border-b border-outline bg-white px-4 py-3">
                  <button
                     type="button"
                     onClick={toggleSidebar}
                     className="rounded-lg p-2 text-label hover:bg-neutral"
                     aria-label="Open sidebar"
                  >
                     <Menu className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-semibold text-primary">
                     Dashboard
                  </span>
               </div>
            )}
            {/* Profile dropdown */}
            <header className="flex items-center justify-end border-b border-outline bg-white px-6 py-4">
               <ProfileDropdown
                  user={user}
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                     e.stopPropagation();
                     setProfileDropdownOpen((prev) => !prev);
                  }}
                  avatar={user?.avatar || ""}
                  companyName={user?.name || ""}
                  companyEmail={user?.companyEmail || ""}
                  onLogout={logout}
               />
            </header>
            {/*Main content area*/}
            <main className="flex-1 overflow-auto p-6">{children}</main>
         </div>
      </div>
   );
};

export default DashboardLayout;

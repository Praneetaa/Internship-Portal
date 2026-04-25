import { ChevronDown, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

const getDisplayName = (user) =>
   user?.name || user?.fullName || user?.companyName || "User";

const getDisplayEmail = (user) =>
   user?.email || user?.personalEmail || user?.companyEmail || "—";

const formatRole = (role) => {
   if (!role) return "Member";
   return role.charAt(0).toUpperCase() + role.slice(1);
};

const getInitials = (name) => {
   if (!name) return "U";
   const parts = name.trim().split(" ");
   return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
};

const ProfileDropdown = ({ user, isOpen, onToggle, onLogout }) => {
   const displayName = getDisplayName(user);
   const displayEmail = getDisplayEmail(user);
   const displayRole = formatRole(user?.role);
   const initials = getInitials(displayName);
   const profilePath =
      user?.role === "organization" ? "/company-profile" : "/candidate-profile";

   return (
      <div className="relative">
         <button
            type="button"
            onClick={onToggle}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition hover:bg-neutral"
         >
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shadow-sm">
               {user?.avatar ? (
                  <img
                     src={user.avatar}
                     alt={displayName}
                     className="h-full w-full object-cover"
                  />
               ) : (
                  initials
               )}
            </span>
            <span className="hidden flex-col items-start leading-tight sm:flex">
               <span className="text-sm font-semibold text-text">
                  {displayName}
               </span>
               <span className="text-xs text-muted">{displayRole}</span>
            </span>
            <ChevronDown
               className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
         </button>

         {isOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-outline/60 bg-white shadow-xl shadow-slate-900/10">
               {/* User info header */}
               <div className="flex items-center gap-3 bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-sm">
                     {user?.avatar ? (
                        <img
                           src={user.avatar}
                           alt={displayName}
                           className="h-full w-full object-cover"
                        />
                     ) : (
                        initials
                     )}
                  </span>
                  <div className="min-w-0">
                     <p className="truncate text-sm font-semibold text-text">
                        {displayName}
                     </p>
                     <p className="truncate text-xs text-muted">
                        {displayEmail}
                     </p>
                  </div>
               </div>

               {/* Menu items */}
               <div className="p-2">
                  <Link
                     to={profilePath}
                     className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-label transition hover:bg-neutral hover:text-text"
                  >
                     <User className="h-4 w-4" />
                     View profile
                  </Link>
                  <button
                     type="button"
                     onClick={onLogout}
                     className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition hover:bg-red-50"
                  >
                     <LogOut className="h-4 w-4" />
                     Logout
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfileDropdown;

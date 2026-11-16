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

const ProfileDropdown = ({ user, isOpen, onToggle, onLogout }) => {
   const displayName = getDisplayName(user);
   const displayEmail = getDisplayEmail(user);
   const displayRole = formatRole(user?.role);
   const profilePath =
      user?.role === "organization" ? "/company-profile" : "/candidate-profile";

   return (
      <div className="relative">
         <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-paragraph transition-colors hover:bg-neutral"
         >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
               {user?.avatar ? (
                  <img
                     src={user.avatar}
                     alt={displayName}
                     className="h-full w-full object-cover"
                  />
               ) : (
                  <User className="h-4 w-4" />
               )}
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
               <span className="text-sm font-semibold text-paragraph">
                  {displayName}
               </span>
               <span className="text-xs text-label">{displayRole}</span>
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral">
               <ChevronDown className="h-4 w-4 text-icon" />
            </span>
         </button>

         {isOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-outline bg-white p-2 shadow-[0_8px_24px_rgba(16,26,58,0.08)]">
               <div className="flex items-center gap-3 border-b border-outline px-2 pb-3 pt-1">
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                     {user?.avatar ? (
                        <img
                           src={user.avatar}
                           alt={displayName}
                           className="h-full w-full object-cover"
                        />
                     ) : (
                        <User className="h-5 w-5" />
                     )}
                  </span>
                  <div className="min-w-0">
                     <p className="truncate text-sm font-semibold text-paragraph">
                        {displayName}
                     </p>
                     <p className="truncate text-xs text-label">
                        {displayEmail}
                     </p>
                  </div>
               </div>
               <div className="mt-2 space-y-1">
                  <Link
                     to={profilePath}
                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-paragraph hover:bg-neutral"
                  >
                     View profile
                  </Link>
                  <button
                     type="button"
                     onClick={onLogout}
                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/5"
                  >
                     <LogOut className="h-4 w-4" />
                     Log out
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfileDropdown;

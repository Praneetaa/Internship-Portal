import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
   const { isAuthenticated, loading, user } = useAuth();

   //Wait for initial auth check so we don't bounce a valid user
   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-neutral">
            <div className="text-paragraph">Loading...</div>
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/Login" replace />;
   }

   if (allowedRoles && !allowedRoles.includes(user?.role)) {
      //Role mismatch — send to the role's own home
      const fallback =
         user?.role === "organization"
            ? "/organization-dashboard"
            : "/find-jobs";
      return <Navigate to={fallback} replace />;
   }

   return children;
};

export default ProtectedRoute;

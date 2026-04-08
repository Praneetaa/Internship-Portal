import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
// import JobPostingForm from "./pages/Employer/JobPostingForm";
// import ManageJobs from "./pages/Employer/ManageJobs";
// import ApplicationViewer from "./pages/Employer/ApplicationViewer";
// import EditProfilePage from "./pages/Employer/EmployerProfilePage";
// import ProtectedRoute from "./routes/ProtectedRoutes";

const App = () => {
   return (
      <div>
         <Router>
            <Routes>
               {/* Public Routes */}
               <Route path="/" element={<LandingPage />} />
               <Route path="/Login" element={<Login />} />
               <Route path="/Signup" element={<Signup />} />
               <Route
                  path="/Employer-Dashboard"
                  element={<EmployerDashboard />}
               />
            </Routes>
         </Router>
      </div>
   );
};

export default App;

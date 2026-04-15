import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import EditProfileDetails from "./pages/Employer/EditProfileDetails";
import ApplicantProfile from "./pages/Applicants/UserProfile";
import ResumePreview from "./pages/Applicants/ResumePreview";
import ApplicantsDashboard from "./pages/Applicants/ApplicantsDashboard";
import SavedJobs from "./pages/Applicants/SavedJobs";
import JobDetails from "./pages/Applicants/JobDetails";
import MyApplications from "./pages/Applicants/MyApplications";
import CandidateProfile from "./pages/Applicants/CandidateProfile";
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
                  path="/organization-dashboard"
                  element={<EmployerDashboard />}
               />
               <Route path="/post-job" element={<JobPostingForm />} />
               <Route path="/manage-jobs" element={<ManageJobs />} />
               <Route path="/applications" element={<ApplicationViewer />} />
               <Route path="/company-profile" element={<EmployerProfilePage />} />
               <Route path="/edit-profile" element={<EditProfileDetails />} />
               <Route
                  path="/applicants/profile/:id"
                  element={<ApplicantProfile />}
               />
               <Route
                  path="/applicants/resume/:id"
                  element={<ResumePreview />}
               />
               <Route path="/find-jobs" element={<ApplicantsDashboard />} />
               <Route
                  path="/applicant-dashboard"
                  element={<ApplicantsDashboard />}
               />
               <Route path="/saved-jobs" element={<SavedJobs />} />
               <Route path="/jobs/:id" element={<JobDetails />} />
               <Route path="/my-applications" element={<MyApplications />} />
               <Route path="/candidate-profile" element={<CandidateProfile />} />
            </Routes>
         </Router>
      </div>
   );
};

export default App;

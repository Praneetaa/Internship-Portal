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
import EventPostingForm from "./pages/Employer/EventPostingForm";
import ManageEvents from "./pages/Employer/ManageEvents";
import ProtectedRoute from "./routes/ProtectedRoutes";

const ORG_ONLY = ["organization"];
const CANDIDATE_ONLY = ["candidate"];

const App = () => {
   return (
      <div>
         <Router>
            <Routes>
               {/* Public Routes */}
               <Route path="/" element={<LandingPage />} />
               <Route path="/Login" element={<Login />} />
               <Route path="/Signup" element={<Signup />} />
               <Route path="/jobs/:id" element={<JobDetails />} />

               {/* Organization Routes */}
               <Route
                  path="/organization-dashboard"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <EmployerDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/post-job"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <JobPostingForm />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/manage-jobs"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <ManageJobs />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/applications"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <ApplicationViewer />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/company-profile"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <EmployerProfilePage />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/edit-profile"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <EditProfileDetails />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/post-event"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <EventPostingForm />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/manage-events"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <ManageEvents />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/applicants/profile/:id"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <ApplicantProfile />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/applicants/resume/:id"
                  element={
                     <ProtectedRoute allowedRoles={ORG_ONLY}>
                        <ResumePreview />
                     </ProtectedRoute>
                  }
               />

               {/* Candidate Routes */}
               <Route
                  path="/find-jobs"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <ApplicantsDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/applicant-dashboard"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <ApplicantsDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/saved-jobs"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <SavedJobs />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/my-applications"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <MyApplications />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/events"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <ApplicantsDashboard />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/candidate-profile"
                  element={
                     <ProtectedRoute allowedRoles={CANDIDATE_ONLY}>
                        <CandidateProfile />
                     </ProtectedRoute>
                  }
               />
            </Routes>
         </Router>
      </div>
   );
};

export default App;

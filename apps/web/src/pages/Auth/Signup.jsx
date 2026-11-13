import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
   Eye,
   EyeOff,
   User,
   Building2,
   AlertCircle,
   Upload,
   Loader,
   Briefcase,
   CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useAuth } from "../../context/AuthContext";

const userRoles = { CANDIDATE: "candidate", ORGANIZATION: "organization" };

const getInitialFormData = (role) => ({
   fullName: "",
   companyName: "",
   companyEmail: "",
   personalEmail: "",
   password: "",
   confirmPassword: "",
   role,
   avatar: null,
});

const Field = ({ label, id, error, children }) => (
   <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-primary">
         {label}
      </label>
      {children}
      {error && (
         <p className="flex items-center gap-1.5 text-xs text-error">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
         </p>
      )}
   </div>
);

const inputCls = (hasError) =>
   `w-full rounded-xl border py-3 px-4 text-sm text-paragraph outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${hasError ? "border-error bg-error/5" : "border-outline bg-white"}`;

const Signup = () => {
   const { login } = useAuth();
   const navigate = useNavigate();
   const [formData, setFormData] = useState(
      getInitialFormData(userRoles.CANDIDATE),
   );
   const [formState, setFormState] = useState({
      loading: false,
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
      avatarPreview: null,
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formState.errors[name])
         setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [name]: undefined },
         }));
      if (
         name === "password" &&
         formData.confirmPassword &&
         value !== formData.confirmPassword
      ) {
         setFormState((prev) => ({
            ...prev,
            errors: {
               ...prev.errors,
               confirmPassword: "Passwords do not match.",
            },
         }));
      } else if (name === "confirmPassword" && value !== formData.password) {
         setFormState((prev) => ({
            ...prev,
            errors: {
               ...prev.errors,
               confirmPassword: "Passwords do not match.",
            },
         }));
      }
   };

   const handleRoleChange = (role) => {
      setFormData(getInitialFormData(role));
      setFormState({
         loading: false,
         errors: {},
         showPassword: false,
         showConfirmPassword: false,
         avatarPreview: null,
      });
   };

   const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
         setFormState((p) => ({
            ...p,
            errors: { ...p.errors, avatar: "Max 5MB" },
         }));
         return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
         setFormState((p) => ({
            ...p,
            errors: { ...p.errors, avatar: "JPG or PNG only" },
         }));
         return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = () =>
         setFormState((prev) => ({
            ...prev,
            avatarPreview: reader.result,
            errors: { ...prev.errors, avatar: undefined },
         }));
      reader.readAsDataURL(file);
   };

   const validateForm = () => {
      const errors = {};
      if (formData.role === userRoles.CANDIDATE) {
         if (!formData.fullName.trim())
            errors.fullName = "Full name is required.";
         if (!formData.personalEmail.trim())
            errors.personalEmail = "Email is required.";
         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail))
            errors.personalEmail = "Enter a valid email address.";
      }
      if (formData.role === userRoles.ORGANIZATION) {
         if (!formData.companyName.trim())
            errors.companyName = "Company name is required.";
         if (!formData.companyEmail.trim())
            errors.companyEmail = "Company email is required.";
         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail))
            errors.companyEmail = "Enter a valid email.";
      }
      if (!formData.password) errors.password = "Password is required.";
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password))
         errors.password = "8+ chars, uppercase, lowercase, and number.";
      if (!formData.confirmPassword)
         errors.confirmPassword = "Please confirm your password.";
      else if (formData.confirmPassword !== formData.password)
         errors.confirmPassword = "Passwords do not match.";
      return errors;
   };

   const handleSignup = async (e) => {
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
         setFormState((prev) => ({ ...prev, errors }));
         return;
      }
      setFormState((prev) => ({ ...prev, loading: true }));
      const isOrg = formData.role === userRoles.ORGANIZATION;
      try {
         let avatarUrl = "";
         if (formData.avatar) {
            const res = await uploadImage(formData.avatar);
            avatarUrl = res.imageUrl || "";
         }
         const payload = {
            name: isOrg ? formData.companyName : formData.fullName,
            email: isOrg ? formData.companyEmail : formData.personalEmail,
            password: formData.password,
            role: formData.role,
            avatar: avatarUrl,
            ...(isOrg && { companyName: formData.companyName }),
         };
         const response = await axiosInstance.post(
            API_PATHS.AUTH.REGISTER,
            payload,
         );
         const { token } = response.data;
         if (token) {
            login(response.data, token);
            toast.success("Account created — welcome!");
            navigate(isOrg ? "/organization-dashboard" : "/find-jobs", {
               replace: true,
            });
         }
      } catch (error) {
         const message =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
         const isEmailTaken = /already exists/i.test(message);
         const emailField = isOrg ? "companyEmail" : "personalEmail";
         setFormState((prev) => ({
            ...prev,
            loading: false,
            errors: isEmailTaken
               ? { [emailField]: "This email is already registered." }
               : { submit: message },
         }));
         toast.error(
            isEmailTaken ? "This email is already registered." : message,
         );
      }
   };

   const isOrg = formData.role === userRoles.ORGANIZATION;

   return (
      <div className="flex min-h-screen bg-neutral">
         {/* Left panel */}
         <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-primary p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
               <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-white" />
               <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white" />
            </div>
            <Link to="/" className="relative flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Briefcase className="h-5 w-5 text-white" />
               </div>
               <span className="text-xl font-bold text-white">Beaconn</span>
            </Link>
            <div className="relative space-y-5">
               <h2 className="text-4xl font-bold text-white leading-tight">
                  Start your journey today.
               </h2>
               <p className="text-white/70 text-base">
                  Build your profile once, apply to internships and events that
                  match where you're headed.
               </p>
               <div className="space-y-3 pt-2">
                  {[
                     "Free to join — no hidden fees",
                     "Internship-focused listings only",
                     "Track applications in one place",
                     "Get discovered by top organizations",
                  ].map((item) => (
                     <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-white/60 flex-shrink-0" />
                        <span className="text-sm text-white/80">{item}</span>
                     </div>
                  ))}
               </div>
            </div>
            <p className="relative text-sm text-white/40">
               © 2026 Beaconn. All rights reserved.
            </p>
         </div>

         {/* Right form */}
         <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 overflow-y-auto">
            <motion.div
               initial={{ opacity: 0, y: 24 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
               className="w-full max-w-md"
            >
               <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                     <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-primary">
                     Beaconn
                  </span>
               </Link>

               <div className="mb-8">
                  <h1 className="text-3xl font-bold text-primary">
                     Create your account
                  </h1>
                  <p className="mt-2 text-sm text-label">
                     Join and start your internship journey
                  </p>
               </div>

               <form onSubmit={handleSignup} className="space-y-5">
                  {/* Role selector */}
                  <div className="space-y-2">
                     <p className="text-sm font-semibold text-primary">
                        I am a
                     </p>
                     <div className="grid grid-cols-2 gap-3">
                        {[
                           {
                              role: userRoles.CANDIDATE,
                              icon: User,
                              label: "Candidate",
                              sub: "Looking for opportunities",
                           },
                           {
                              role: userRoles.ORGANIZATION,
                              icon: Building2,
                              label: "Organization",
                              sub: "Looking for talent",
                           },
                        ].map(({ role, icon: Icon, label, sub }) => (
                           <button
                              key={role}
                              type="button"
                              onClick={() => handleRoleChange(role)}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition ${formData.role === role ? "border-primary bg-primary/5" : "border-outline bg-white hover:border-primary/40"}`}
                           >
                              <div
                                 className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${formData.role === role ? "bg-primary text-white" : "bg-neutral text-icon"}`}
                              >
                                 <Icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-semibold text-primary">
                                 {label}
                              </span>
                              <span className="text-xs text-label">{sub}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <AnimatePresence mode="wait">
                     <motion.div
                        key={formData.role}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                     >
                        {!isOrg ? (
                           <>
                              <Field
                                 label="Full name"
                                 id="fullName"
                                 error={formState.errors.fullName}
                              >
                                 <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Alex Chen"
                                    className={inputCls(
                                       formState.errors.fullName,
                                    )}
                                 />
                              </Field>
                              <Field
                                 label="Email address"
                                 id="personalEmail"
                                 error={formState.errors.personalEmail}
                              >
                                 <input
                                    id="personalEmail"
                                    type="email"
                                    name="personalEmail"
                                    value={formData.personalEmail}
                                    onChange={handleInputChange}
                                    placeholder="you@email.com"
                                    className={inputCls(
                                       formState.errors.personalEmail,
                                    )}
                                 />
                              </Field>
                           </>
                        ) : (
                           <>
                              <Field
                                 label="Company name"
                                 id="companyName"
                                 error={formState.errors.companyName}
                              >
                                 <input
                                    id="companyName"
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Beaconn Studio"
                                    className={inputCls(
                                       formState.errors.companyName,
                                    )}
                                 />
                              </Field>
                              <Field
                                 label="Company email"
                                 id="companyEmail"
                                 error={formState.errors.companyEmail}
                              >
                                 <input
                                    id="companyEmail"
                                    type="email"
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleInputChange}
                                    placeholder="hello@company.com"
                                    className={inputCls(
                                       formState.errors.companyEmail,
                                    )}
                                 />
                              </Field>
                           </>
                        )}

                        <Field
                           label="Password"
                           id="password"
                           error={formState.errors.password}
                        >
                           <div className="relative">
                              <input
                                 id="password"
                                 name="password"
                                 type={
                                    formState.showPassword ? "text" : "password"
                                 }
                                 value={formData.password}
                                 onChange={handleInputChange}
                                 placeholder="8+ characters"
                                 className={
                                    inputCls(formState.errors.password) +
                                    " pr-11"
                                 }
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setFormState((p) => ({
                                       ...p,
                                       showPassword: !p.showPassword,
                                    }))
                                 }
                                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-icon hover:text-primary transition"
                              >
                                 {formState.showPassword ? (
                                    <Eye className="h-4 w-4" />
                                 ) : (
                                    <EyeOff className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                        </Field>

                        <Field
                           label="Confirm password"
                           id="confirmPassword"
                           error={formState.errors.confirmPassword}
                        >
                           <div className="relative">
                              <input
                                 id="confirmPassword"
                                 name="confirmPassword"
                                 type={
                                    formState.showConfirmPassword
                                       ? "text"
                                       : "password"
                                 }
                                 value={formData.confirmPassword}
                                 onChange={handleInputChange}
                                 placeholder="Re-enter password"
                                 className={
                                    inputCls(formState.errors.confirmPassword) +
                                    " pr-11"
                                 }
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setFormState((p) => ({
                                       ...p,
                                       showConfirmPassword:
                                          !p.showConfirmPassword,
                                    }))
                                 }
                                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-icon hover:text-primary transition"
                              >
                                 {formState.showConfirmPassword ? (
                                    <Eye className="h-4 w-4" />
                                 ) : (
                                    <EyeOff className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                        </Field>

                        {/* Avatar upload */}
                        <div className="space-y-2">
                           <p className="text-sm font-semibold text-primary">
                              Profile photo{" "}
                              <span className="font-normal text-label">
                                 (optional)
                              </span>
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-neutral border border-outline flex items-center justify-center">
                                 {formState.avatarPreview ? (
                                    <img
                                       src={formState.avatarPreview}
                                       alt="Preview"
                                       className="h-full w-full object-cover"
                                    />
                                 ) : (
                                    <User className="h-6 w-6 text-icon" />
                                 )}
                              </div>
                              <div>
                                 <input
                                    id="avatar"
                                    type="file"
                                    name="avatar"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                 />
                                 <label
                                    htmlFor="avatar"
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral transition"
                                 >
                                    <Upload className="h-4 w-4" /> Upload photo
                                 </label>
                                 <p className="mt-1 text-xs text-label">
                                    JPG, PNG · Max 5MB
                                 </p>
                              </div>
                           </div>
                           {formState.errors.avatar && (
                              <p className="flex items-center gap-1.5 text-xs text-error">
                                 <AlertCircle className="h-3.5 w-3.5" />
                                 {formState.errors.avatar}
                              </p>
                           )}
                        </div>
                     </motion.div>
                  </AnimatePresence>

                  {formState.errors.submit && (
                     <div className="flex items-center gap-2.5 rounded-xl border border-error/30 bg-error/5 p-3.5">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-error" />
                        <p className="text-sm text-error">
                           {formState.errors.submit}
                        </p>
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={formState.loading}
                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:opacity-60"
                  >
                     {formState.loading ? (
                        <>
                           <Loader className="h-4 w-4 animate-spin" /> Creating
                           account…
                        </>
                     ) : (
                        "Create account"
                     )}
                  </button>
               </form>

               <p className="mt-6 text-center text-sm text-label">
                  Already have an account?{" "}
                  <Link
                     to="/Login"
                     className="font-semibold text-primary hover:text-secondary transition"
                  >
                     Sign in
                  </Link>
               </p>
            </motion.div>
         </div>
      </div>
   );
};

export default Signup;

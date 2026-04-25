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
   CheckCircle2,
   ArrowRight,
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

const panelItems = [
   "Free to join — no hidden fees",
   "Internship-focused listings only",
   "Track applications in one place",
   "Get discovered by top organizations",
];

const Field = ({ label, id, error, children }) => (
   <div className="flex flex-col gap-1.5">
      <label
         htmlFor={id}
         className="text-xs font-semibold uppercase tracking-wide text-label"
      >
         {label}
      </label>
      {children}
      {error && (
         <p className="flex items-center gap-1.5 text-xs font-medium text-error">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
         </p>
      )}
   </div>
);

const inputCls = (hasError) =>
   `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-paragraph outline-none transition-all placeholder:text-icon focus:border-accent focus:ring-2 focus:ring-accent/20 ${hasError ? "border-error/60 focus:border-error focus:ring-error/20" : "border-outline hover:border-muted"}`;

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
         else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)
         )
            errors.personalEmail = "Enter a valid email address.";
      }
      if (formData.role === userRoles.ORGANIZATION) {
         if (!formData.companyName.trim())
            errors.companyName = "Company name is required.";
         if (!formData.companyEmail.trim())
            errors.companyEmail = "Company email is required.";
         else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)
         )
            errors.companyEmail = "Enter a valid email.";
      }
      if (!formData.password) errors.password = "Password is required.";
      else if (
         !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
      )
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
      <div className="flex min-h-screen bg-background">
         {/* Left branding panel */}
         <div className="relative hidden overflow-hidden lg:flex lg:w-[40%] lg:flex-col lg:justify-between bg-gradient-to-br from-primary via-primary to-[#1a246b] p-12">
            <div className="pointer-events-none absolute inset-0">
               <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
               <div className="absolute bottom-24 left-8 h-52 w-52 rounded-full border border-white/8" />
               <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <Link to="/" className="relative flex items-center gap-3">
               <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
                  B
               </span>
               <span className="text-xl font-bold text-white">Beaconn</span>
            </Link>

            <div className="relative space-y-5">
               <h2 className="text-4xl font-bold leading-tight text-white">
                  Start your journey
                  <br />
                  today.
               </h2>
               <p className="max-w-xs text-base leading-relaxed text-white/65">
                  Build your profile once, apply to internships and events that
                  match where you're headed.
               </p>
               <div className="space-y-3 pt-2">
                  {panelItems.map((item) => (
                     <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 text-success/80" />
                        <span className="text-sm text-white/75">{item}</span>
                     </div>
                  ))}
               </div>
            </div>

            <p className="relative text-xs text-white/35">
               © 2026 Beaconn. All rights reserved.
            </p>
         </div>

         {/* Right form panel */}
         <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.45, ease: "easeOut" }}
               className="w-full max-w-md"
            >
               <Link
                  to="/"
                  className="mb-8 flex items-center gap-2.5 lg:hidden"
               >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                     B
                  </span>
                  <span className="text-lg font-bold text-primary">
                     Beaconn
                  </span>
               </Link>

               <div className="mb-7">
                  <h1 className="text-3xl font-bold text-text">
                     Create your account
                  </h1>
                  <p className="mt-2 text-sm text-label">
                     Join and start your internship journey
                  </p>
               </div>

               <form onSubmit={handleSignup} className="space-y-5">
                  {/* Role selector */}
                  <div className="flex flex-col gap-2">
                     <p className="text-xs font-semibold uppercase tracking-wide text-label">
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
                              className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${formData.role === role ? "border-primary bg-primary/5 shadow-sm" : "border-outline bg-white hover:border-primary/40"}`}
                           >
                              <span
                                 className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${formData.role === role ? "bg-primary text-white" : "bg-neutral text-icon"}`}
                              >
                                 <Icon className="h-5 w-5" />
                              </span>
                              <span className="text-sm font-bold text-text">
                                 {label}
                              </span>
                              <span className="text-xs text-muted">{sub}</span>
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
                                 className={`${inputCls(formState.errors.password)} pr-11`}
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setFormState((p) => ({
                                       ...p,
                                       showPassword: !p.showPassword,
                                    }))
                                 }
                                 className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-icon transition hover:text-primary"
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
                                 className={`${inputCls(formState.errors.confirmPassword)} pr-11`}
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
                                 className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-icon transition hover:text-primary"
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
                        <div className="flex flex-col gap-2">
                           <p className="text-xs font-semibold uppercase tracking-wide text-label">
                              Profile photo{" "}
                              <span className="normal-case font-normal text-muted">
                                 (optional)
                              </span>
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline bg-neutral">
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
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-neutral"
                                 >
                                    <Upload className="h-4 w-4" />
                                    Upload photo
                                 </label>
                                 <p className="mt-1 text-xs text-muted">
                                    JPG, PNG · Max 5MB
                                 </p>
                              </div>
                           </div>
                           {formState.errors.avatar && (
                              <p className="flex items-center gap-1.5 text-xs font-medium text-error">
                                 <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                 {formState.errors.avatar}
                              </p>
                           )}
                        </div>
                     </motion.div>
                  </AnimatePresence>

                  {formState.errors.submit && (
                     <div className="flex items-center gap-2.5 rounded-xl border border-error/25 bg-error/5 px-4 py-3">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-error" />
                        <p className="text-sm text-error">
                           {formState.errors.submit}
                        </p>
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={formState.loading}
                     className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                     {formState.loading ? (
                        <>
                           <Loader className="h-4 w-4 animate-spin" />
                           Creating account…
                        </>
                     ) : (
                        <>
                           Create account
                           <ArrowRight className="h-4 w-4" />
                        </>
                     )}
                  </button>
               </form>

               <p className="mt-6 text-center text-sm text-label">
                  Already have an account?{" "}
                  <Link
                     to="/Login"
                     className="font-semibold text-primary transition hover:text-secondary"
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

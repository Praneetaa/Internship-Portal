import { useState } from "react";
import { motion } from "framer-motion";
import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   Loader,
   AlertCircle,
   ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const panelStats = [
   ["200+", "Open roles"],
   ["3k+", "Candidates"],
   ["60+", "Partner orgs"],
   ["92%", "Match rate"],
];

const Login = () => {
   const { login } = useAuth();
   const navigate = useNavigate();
   const [formData, setFormData] = useState({ email: "", password: "" });
   const [formState, setFormState] = useState({
      loading: false,
      errors: {},
      showPassword: false,
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formState.errors[name]) {
         setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [name]: "" },
         }));
      }
   };

   const validateForm = () => {
      const errors = {};
      if (!formData.email.trim()) errors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
         errors.email = "Enter a valid email address";
      if (!formData.password) errors.password = "Password is required";
      setFormState((prev) => ({ ...prev, errors }));
      return Object.keys(errors).length === 0;
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setFormState((prev) => ({ ...prev, loading: true }));
      try {
         const response = await axiosInstance.post(
            API_PATHS.AUTH.LOGIN,
            formData,
         );
         const { token, role } = response.data;
         if (token) {
            login(response.data, token);
            toast.success("Welcome back!");
            navigate(
               role === "organization"
                  ? "/organization-dashboard"
                  : "/find-jobs",
               { replace: true },
            );
         }
      } catch (error) {
         const message =
            error.response?.data?.message || "Invalid email or password";
         setFormState((prev) => ({
            ...prev,
            loading: false,
            errors: { submit: message },
         }));
         toast.error(message);
      } finally {
         setFormState((prev) => ({ ...prev, loading: false }));
      }
   };

   const inputCls = (hasError) =>
      `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-paragraph outline-none transition-all placeholder:text-icon focus:border-accent focus:ring-2 focus:ring-accent/20 ${hasError ? "border-error/60 focus:border-error focus:ring-error/20" : "border-outline hover:border-muted"}`;

   return (
      <div className="flex min-h-screen bg-background">
         {/* Left branding panel */}
         <div className="relative hidden overflow-hidden lg:flex lg:w-[44%] lg:flex-col lg:justify-between bg-gradient-to-br from-primary via-primary to-[#1a246b] p-12">
            {/* Decorative rings */}
            <div className="pointer-events-none absolute inset-0">
               <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
               <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/8" />
               <div className="absolute bottom-20 left-10 h-56 w-56 rounded-full border border-white/8" />
               <div className="absolute -bottom-10 -left-10 h-80 w-80 rounded-full border border-white/6" />
               <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <Link
               to="/"
               className="relative flex items-center gap-3"
            >
               <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-sm font-bold text-white">
                  B
               </span>
               <span className="text-xl font-bold text-white">Beaconn</span>
            </Link>

            <div className="relative space-y-6">
               <h2 className="text-4xl font-bold leading-tight text-white">
                  Your next internship
                  <br />
                  starts here.
               </h2>
               <p className="max-w-xs text-base leading-relaxed text-white/65">
                  Join thousands of candidates discovering internships and
                  career events tailored for early talent.
               </p>
               <div className="grid grid-cols-2 gap-3 pt-2">
                  {panelStats.map(([val, label]) => (
                     <div
                        key={label}
                        className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
                     >
                        <p className="text-2xl font-bold text-white">{val}</p>
                        <p className="mt-0.5 text-xs text-white/55">{label}</p>
                     </div>
                  ))}
               </div>
            </div>

            <p className="relative text-xs text-white/35">
               © 2026 Beaconn. All rights reserved.
            </p>
         </div>

         {/* Right form panel */}
         <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.45, ease: "easeOut" }}
               className="w-full max-w-md"
            >
               {/* Mobile logo */}
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

               <div className="mb-8">
                  <h1 className="text-3xl font-bold text-text">
                     Welcome back
                  </h1>
                  <p className="mt-2 text-sm text-label">
                     Sign in to continue to your dashboard
                  </p>
               </div>

               <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                     <label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wide text-label"
                     >
                        Email address
                     </label>
                     <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                        <input
                           id="email"
                           type="text"
                           name="email"
                           placeholder="you@email.com"
                           value={formData.email}
                           onChange={handleInputChange}
                           className={`${inputCls(formState.errors.email)} pl-10`}
                        />
                     </div>
                     {formState.errors.email && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-error">
                           <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                           {formState.errors.email}
                        </p>
                     )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                     <label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wide text-label"
                     >
                        Password
                     </label>
                     <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                        <input
                           id="password"
                           name="password"
                           type={formState.showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className={`${inputCls(formState.errors.password)} pl-10 pr-11`}
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
                     {formState.errors.password && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-error">
                           <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                           {formState.errors.password}
                        </p>
                     )}
                  </div>

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
                           Signing in…
                        </>
                     ) : (
                        <>
                           Sign in
                           <ArrowRight className="h-4 w-4" />
                        </>
                     )}
                  </button>
               </form>

               <p className="mt-6 text-center text-sm text-label">
                  Don't have an account?{" "}
                  <Link
                     to="/Signup"
                     className="font-semibold text-primary transition hover:text-secondary"
                  >
                     Create one
                  </Link>
               </p>
            </motion.div>
         </div>
      </div>
   );
};

export default Login;

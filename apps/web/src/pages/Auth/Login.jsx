import { useState } from "react";
import { motion } from "framer-motion";
import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   Loader,
   AlertCircle,
   Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

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

   return (
      <div className="flex min-h-screen bg-neutral">
         {/* Left decorative panel */}
         <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-primary p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
               <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-white" />
               <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white" />
            </div>
            <Link to="/" className="relative flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <Briefcase className="h-5 w-5 text-white" />
               </div>
               <span className="text-xl font-bold text-white">Beaconn</span>
            </Link>
            <div className="relative space-y-6">
               <h2 className="text-4xl font-bold text-white leading-tight">
                  Your next internship starts here.
               </h2>
               <p className="text-white/70 text-base leading-relaxed">
                  Join thousands of candidates discovering internships and
                  career events tailored for early talent.
               </p>
               <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                     ["200+", "Open roles"],
                     ["3k+", "Candidates"],
                     ["60+", "Partner orgs"],
                     ["92%", "Match rate"],
                  ].map(([val, label]) => (
                     <div
                        key={label}
                        className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                     >
                        <p className="text-2xl font-bold text-white">{val}</p>
                        <p className="text-sm text-white/60 mt-0.5">{label}</p>
                     </div>
                  ))}
               </div>
            </div>
            <p className="relative text-sm text-white/40">
               © 2026 Beaconn. All rights reserved.
            </p>
         </div>

         {/* Right form panel */}
         <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <motion.div
               initial={{ opacity: 0, y: 24 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
               className="w-full max-w-md"
            >
               {/* Mobile logo */}
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
                     Welcome back
                  </h1>
                  <p className="mt-2 text-sm text-label">
                     Sign in to continue to your dashboard
                  </p>
               </div>

               <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                     <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-primary"
                     >
                        Email address
                     </label>
                     <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-icon" />
                        <input
                           id="email"
                           type="text"
                           name="email"
                           placeholder="you@email.com"
                           value={formData.email}
                           onChange={handleInputChange}
                           className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-paragraph outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${formState.errors.email ? "border-error bg-error/5" : "border-outline bg-white"}`}
                        />
                     </div>
                     {formState.errors.email && (
                        <p className="flex items-center gap-1.5 text-xs text-error">
                           <AlertCircle className="h-3.5 w-3.5" />
                           {formState.errors.email}
                        </p>
                     )}
                  </div>

                  <div className="space-y-1.5">
                     <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-primary"
                     >
                        Password
                     </label>
                     <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-icon" />
                        <input
                           id="password"
                           name="password"
                           type={formState.showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className={`w-full rounded-xl border py-3 pl-10 pr-11 text-sm text-paragraph outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${formState.errors.password ? "border-error bg-error/5" : "border-outline bg-white"}`}
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
                     {formState.errors.password && (
                        <p className="flex items-center gap-1.5 text-xs text-error">
                           <AlertCircle className="h-3.5 w-3.5" />
                           {formState.errors.password}
                        </p>
                     )}
                  </div>

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
                           <Loader className="h-4 w-4 animate-spin" /> Signing
                           in…
                        </>
                     ) : (
                        "Sign in"
                     )}
                  </button>
               </form>

               <p className="mt-6 text-center text-sm text-label">
                  Don't have an account?{" "}
                  <Link
                     to="/Signup"
                     className="font-semibold text-primary hover:text-secondary transition"
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

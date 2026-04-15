import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
   const { login } = useAuth();
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });

   const [formState, setFormState] = useState({
      loading: false,
      errors: {},
      showPassword: false,
      success: false,
   });

   //Validation functions
   const validateEmail = (email) => {
      if (!email.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Please enter a valid email address";
      return "";
   };

   const validatePassword = (password) => {
      if (!password) return "Password is required";
      return "";
   };

   //Handle input changes
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      console.log({ name, value });
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      //Clear error when user starts typing
      if (formState.errors[name]) {
         setFormState((prev) => ({
            ...prev,
            errors: {
               ...prev.errors,
               [name]: "",
            },
         }));
      }
   };
   const validateForm = () => {
      const errors = {
         email: validateEmail(formData.email),
         password: validatePassword(formData.password),
      };

      //Remove empty errors
      Object.keys(errors).forEach((key) => {
         if (!errors[key]) delete errors[key];
      });
      {
         setFormState((prev) => ({ ...prev, errors }));
      }
      return Object.keys(errors).length === 0;
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setFormState((prev) => ({
         ...prev,
         loading: true,
      }));
      try {
         //Login API Integration
         const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
         });
         setFormState((prev) => ({
            ...prev,
            loading: false,
            success: true,
            errors: {},
         }));
         const { token, role } = response.data;
         if (token) {
            login(response.data, token);

            //Redirect based on role
            setTimeout(() => {
               window.location.href =
                  role === "organization"
                     ? "/organization-dashboard"
                     : "/find-jobs";
            }, 2000);
         }
      } catch (error) {
         setFormState((prev) => ({
            ...prev,
            loading: false,
            errors: {
               submit:
                  error.response?.data.message ||
                  "Login failed. Please check your credentials",
            },
         }));
      }
   };

   return (
      <div className="flex justify-center items-start sm:items-center min-h-screen bg-neutral px-4 py-10">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center"
         >
            <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-xl shadow-lg">
               <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-4">
                  Welcome Back!
               </h2>
               <p className="text-center text-paragraph mb-6">
                  Sign in to your account to continue
               </p>

               <form onSubmit={handleLogin} className="space-y-4">
                  {/*Email*/}
                  <div>
                     <label
                        htmlFor="email"
                        className="block p-2 text-primary font-medium"
                     >
                        Email Address
                     </label>
                     <div className="relative">
                        <Mail
                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <input
                           id="email"
                           type="text"
                           name="email"
                           placeholder="your@email.com"
                           value={formData.email}
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-10 rounded-md border ${
                              formState.errors.email
                                 ? "border-error"
                                 : "border-outline"
                           } focus:outline-none focus:ring-2 focus:ring-accent`}
                        />
                     </div>
                     {formState.errors.email && (
                        <p className="text-error text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.email}
                        </p>
                     )}
                  </div>

                  {/*Password*/}
                  <div>
                     <label
                        htmlFor="password"
                        className="block p-2 text-primary font-medium"
                     >
                        Password
                     </label>
                     <div className="relative">
                        <Lock
                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <input
                           id="password"
                           type={formState.showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-10 rounded-md border ${
                              formState.errors.password
                                 ? "border-error"
                                 : "border-outline"
                           } focus:outline-none focus:ring-2 focus:ring-accent`}
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setFormState((prev) => ({
                                 ...prev,
                                 showPassword: !prev.showPassword,
                              }))
                           }
                           className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                        >
                           {formState.showPassword ? (
                              <Eye className="w-5 h-5" />
                           ) : (
                              <EyeOff className="w-5 h-5" />
                           )}
                        </button>
                     </div>
                     {formState.errors.password && (
                        <p className="text-error text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.password}
                        </p>
                     )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                     <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span>Remember me</span>
                     </label>
                     <label className="sm:ml-auto text-primary">
                        Forgot password?
                     </label>
                  </div>

                  {/*Submit Error*/}
                  {formState.errors.submit && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-error text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-2" />
                           {formState.errors.submit}
                        </p>
                     </div>
                  )}

                  {/*Submit Button*/}
                  <button
                     type="submit"
                     disabled={formState.loading}
                     className="w-full text-white font-semibold py-3 rounded-md cursor-pointer bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l hover:from-secondary hover:to-primary transition-all duration-300"
                  >
                     {formState.loading ? (
                        <div className="flex items-center justify-center space-x-2">
                           <Loader className="w-5 h-5 animate-spin" />
                           <span>Signing In...</span>
                        </div>
                     ) : (
                        <span>Sign In</span>
                     )}
                  </button>

                  {/*Sign up link*/}

                  <p className="text-sm text-center mt-4 text-gray-600">
                     Don't have an account?{" "}
                     <Link
                        to="/Signup"
                        className="text-accent hover:underline "
                     >
                        Sign Up
                     </Link>
                  </p>
               </form>
            </div>
         </motion.div>
      </div>
   );
};

export default Login;

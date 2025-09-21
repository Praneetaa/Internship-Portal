import { useState } from "react";
import { motion } from "framer-motion";
import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   Loader,
   AlertCircle,
   CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
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

   if (formState.success) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
            >
               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 " />
               <h2 className="text-2xl font-bold text-primary mb-2">
                  Welcome Back!
               </h2>
               <p className="text-grey-600 mb-4">
                  You have been successfully logged in.
               </p>
               <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto">
                  <p className="text-sm text-gray-500 mt-2">
                     Redirecting to your dashboard...
                  </p>
               </div>
            </motion.div>
         </div>
      );
   }

   return (
      <div
         className="flex justify-center items-center h-screen"
         style={{ backgroundColor: "#F7F7F8" }}
      >
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=""
         >
            <div className="w-md max-w-md bg-white p-10 rounded-xl shadow-lg">
               <h2 className="text-3xl font-bold text-center text-primary mb-4">
                  Welcome Back!
               </h2>
               <p className="text-center text-gray-500 mb-6">
                  Sign in to your account to continue
               </p>

               <form onSubmit={handleLogin} className="space-y-4">
                  {/*Email*/}
                  <div>
                     <label className="block p-2 text-primary font-bold">
                        Email Address
                     </label>
                     <div className="relative">
                        <Mail
                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <input
                           type="email"
                           name="email"
                           placeholder="Enter your email"
                           value={formData.email}
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-10 rounded-md border ${
                              formState.errors.email
                                 ? "border-red-500"
                                 : "border-gray-300"
                           } focus:outline-none focus:ring-2 focus:ring-accent`}
                        />
                     </div>
                     {formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.email}
                        </p>
                     )}
                  </div>

                  {/*Password*/}
                  <div>
                     <label className="block p-2 text-primary font-bold">
                        Password
                     </label>
                     <div className="relative">
                        <Lock
                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <input
                           type={formState.showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-10 rounded-md border ${
                              formState.errors.password
                                 ? "border-red-500"
                                 : "border-gray-300"
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
                              <EyeOff className="w-5 h-5" />
                           ) : (
                              <Eye className="w-5 h-5" />
                           )}
                        </button>
                     </div>
                     {formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.password}
                        </p>
                     )}
                  </div>

                  {/*Submit Error*/}
                  {formState.errors.submit && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                           <AlertCircle className="w=4 h-4 mr-2" />
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

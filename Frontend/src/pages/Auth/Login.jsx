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

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      console.log({ name, value });
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleLogin = async (e) => {
      console.log(e);
      e.preventDefault();
      console.log({ formData });
   };

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
                           className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                           required
                        />
                     </div>
                  </div>

                  {/*Password*/}
                  <div>
                     <label className="block p-2 text-primary font-bold">
                        Password{" "}
                     </label>
                     <div className="relative">
                        <Lock
                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <input
                           type="password"
                           name="password"
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                           required
                        />
                     </div>
                  </div>

                  <button
                     type="submit"
                     className="w-full b text-white py-2 rounded-md transition-colors"
                     style={{ backgroundColor: "#3A1078" }}
                     onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#4E31AA")
                     }
                     onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3A1078")
                     }
                  >
                     Log in
                  </button>
               </form>
               <p className="text-sm text-center mt-4 text-gray-600">
                  Don't have an account?{" "}
                  <Link
                     to="/Signup"
                     style={{ color: "#3795BD" }}
                     className="hover:underline"
                  >
                     Sign Up
                  </Link>
               </p>
            </div>
         </motion.div>
      </div>
   );
};

export default Login;

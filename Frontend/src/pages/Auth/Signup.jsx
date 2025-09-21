import { useState } from "react";
import { Link } from "react-router-dom";
import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   User,
   Loader,
   AlertCircle,
   CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      avatar: null,
   });
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      console.log({ name, value });
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleRoleChange = (role) => {};

   const handleAvatarChange = (e) => {};

   const handleSignup = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         alert("Passwords do not match!");
         return;
      }

      console.log({ formData });
   };

   return (
      <div>
         <h2>Create Account</h2>
         <p>something</p>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=""
         >
            <form onSubmit={handleSignup} className="">
               {/*Full Name*/}
               <div>
                  <label className="">Full Name</label>
                  <div className="">
                     <User className="" />
                     <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        placeholder="Enter your full name"
                        onChange={handleInputChange}
                        required
                     />
                  </div>
               </div>
               {/*Email*/}
               <div>
                  <label className="">Email Address</label>
                  <div className="">
                     <Mail className="" />
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                        required
                     />
                  </div>
               </div>
               {/*Password*/}
               <div>
                  <label className="">Password</label>
                  <div className="">
                     <Lock className="" />
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                        required
                     />
                  </div>
               </div>

               <div>
                  {/*Role*/}
                  <label>Are you "</label>
                  <select onChange={(e) => setRole(e.target.value)} required>
                     <option value="explorer">Explorer</option>
                     <option value="organization">Organization</option>
                  </select>
               </div>

               <button type="submit">Sign Up</button>
            </form>

            <p>
               Already have an account? <Link to="/">Log in</Link>
            </p>
         </motion.div>
      </div>
   );
};

export default Signup;

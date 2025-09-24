import { useState } from "react";
import { Link } from "react-router-dom";
import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   User,
   Building,
   Loader,
   AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const userRoles = { CANDIDATE: "candidate", ORGANIZATION: "organization" };

const Signup = () => {
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      companyName: "",
      companyEmail: "",
      personalEmail: "",
      password: "",
      confirmPassword: "",
      role: userRoles.CANDIDATE,
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

   const handleRoleChange = (role) => {
      setFormData((prev) => ({ ...prev, role }));
   };

   const handleAvatarChange = (e) => {
      setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
   };

   const handleSignup = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         alert("Passwords do not match!");
         return;
      }

      console.log({ formData });
   };

   return (
      <div className="flex justify-center items-center h-screen bg-neutral">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=""
         >
            <div className="w-md max-w-md bg-white p-10 rounded-xl shadow-lg">
               <h2 className="text-3xl font-bold text-center text-primary mb-4">
                  Create Account
               </h2>
               <p className="text-center text-paragraph mb-6">
                  Join us and kickstart your journey
               </p>

               <form onSubmit={handleSignup} className="">
                  {/*Role Selection*/}
                  <div className="mb-6">
                     <label className="block text-md font-medium text-label mb-3">
                        I am a:
                     </label>
                     <div className="grid grid-cols-2 gap-4">
                        {/* Candidate Button */}
                        <button
                           type="button"
                           className={`flex flex-col items-center p-4 rounded-lg border border-label transition ${
                              formData.role === userRoles.CANDIDATE
                                 ? "active"
                                 : ""
                           }focus:outline-none focus:ring-2 focus:ring-primary`}
                           onClick={() => handleRoleChange(userRoles.CANDIDATE)}
                        >
                           <User size={28} className="mb-2" />
                           Candidate
                        </button>
                        {/* Organization Button */}
                        <button
                           type="button"
                           className={`flex flex-col items-center p-4 rounded-lg border transition ${
                              formData.role === userRoles.ORGANIZATION
                                 ? "active"
                                 : ""
                           }focus:outline-none focus:ring-2 focus:ring-primary`}
                           onClick={() =>
                              handleRoleChange(userRoles.ORGANIZATION)
                           }
                        >
                           <Building size={28} className="mb-2" />
                           Organizations
                        </button>
                     </div>
                  </div>

                  {formData.role === userRoles.CANDIDATE && (
                     <>
                        {/*First Name*/}
                        <div>
                           <label className="" htmlFor="firstName">
                              First Name
                           </label>
                           <div className="">
                              <input
                                 id="firstName"
                                 type="text"
                                 name="firstName"
                                 value={formData.firstName}
                                 placeholder="Enter your first name"
                                 onChange={handleInputChange}
                              />
                           </div>
                        </div>

                        {/*Last Name*/}
                        <div>
                           <label className="" htmlFor="lastName">
                              Last Name
                           </label>
                           <div className="">
                              <input
                                 id="lastName"
                                 type="text"
                                 name="lastName"
                                 value={formData.lastName}
                                 placeholder="Enter your last name"
                                 onChange={handleInputChange}
                              />
                           </div>
                        </div>

                        {/*Email*/}
                        <div>
                           <label className="" htmlFor="personalEmail">
                              Email Address
                           </label>
                           <div className="">
                              <Mail className="" />
                              <input
                                 id="personalEmail"
                                 type="email"
                                 name="personalEmail"
                                 value={formData.email}
                                 placeholder="Enter your email"
                                 onChange={handleInputChange}
                              />
                           </div>
                        </div>
                     </>
                  )}
                  {formData.role === userRoles.ORGANIZATION && (
                     <>
                        {/*Company Name*/}
                        <div>
                           <label className="" htmlFor="companyName">
                              Company Name
                           </label>
                           <div>
                              <input
                                 id="companyName"
                                 type="text"
                                 name="companyName"
                                 value={formData.companyName}
                                 placeholder="Enter your Company Name"
                                 onChange={handleInputChange}
                              />
                           </div>
                        </div>

                        {/*Company Email*/}
                        <div>
                           <label className="" htmlFor="companyEmail">
                              Company Email
                           </label>
                           <div>
                              <input
                                 id="companyEmail"
                                 type="email"
                                 name="companyEmail"
                                 value={formData.email}
                                 placeholder="Enter your email"
                                 onChange={handleInputChange}
                                 className="w-full p-2 pl-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                           </div>
                        </div>
                     </>
                  )}

                  {/*Common Fields*/}

                  {/*Password*/}
                  <div>
                     <label className="" htmlFor="password">
                        Password
                     </label>
                     <div className="">
                        <Lock className="" />
                        <input
                           id="password"
                           type="password"
                           name="password"
                           value={formData.password}
                           placeholder="Enter your password"
                           onChange={handleInputChange}
                           className="w-full pl-10 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                     </div>
                  </div>
                  {/*Confirm Password*/}
                  <div>
                     <label className="" htmlFor="confirmPassword">
                        Confirm Password
                     </label>
                     <div className="">
                        <Lock className="" />
                        <input
                           id="confirmPassword"
                           type="password"
                           name="confirmPassword"
                           value={formData.confirmPassword}
                           placeholder="Enter your password"
                           onChange={handleInputChange}
                        />
                     </div>
                  </div>
                  {/*Upload Profile Picture*/}
                  <div>
                     <label className="">Upload your image (Optional)</label>
                     <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                     />
                  </div>

                  <button
                     type="submit"
                     className="w-full text-white font-semibold py-3 rounded-md cursor-pointer bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l hover:from-secondary hover:to-primary transition-all duration-300"
                  >
                     Sign Up
                  </button>
               </form>

               <p className="text-center text-label mt-4">
                  Already have an account?{" "}
                  <Link to="/" className="text-accent hover:underline">
                     Log in
                  </Link>
               </p>
            </div>
         </motion.div>
      </div>
   );
};

export default Signup;

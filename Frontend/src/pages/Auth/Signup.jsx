import { useState } from "react";
import { Link } from "react-router-dom";
import {
   Eye,
   EyeOff,
   User,
   Building,
   AlertCircle,
   Upload,
   Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useAuth } from "../../context/AuthContext";

const userRoles = { CANDIDATE: "candidate", ORGANIZATION: "organization" };

//Helper function to avoid repeating form resets
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

const Signup = () => {
   const { login } = useAuth();

   const [formData, setFormData] = useState(
      getInitialFormData(userRoles.CANDIDATE),
   );

   const [formState, setFormState] = useState({
      loading: false,
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
      avatarPreview: null,
      success: false,
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      console.log({ name, value });
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
      if (formState.errors[name]) {
         setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [name]: undefined },
         }));
      }

      // Live validation only for password and confirmPassword
      let errors = {};
      if (name === "password") {
         if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
            errors.password =
               "Must be 8+ chars, include uppercase, lowercase, and number.";
         }
         if (formData.confirmPassword && value !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
         } else if (
            formData.confirmPassword &&
            value === formData.confirmPassword
         ) {
            setFormState((prev) => ({
               ...prev,
               errors: { ...prev.errors, confirmPassword: undefined },
            }));
         }
         setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, ...errors },
         }));
      }

      if (name === "confirmPassword") {
         const errors = {};
         if (value && value !== formData.password) {
            errors.confirmPassword = "Passwords do not match.";
         }
         setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, ...errors },
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
         success: false,
      });
   };

   const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
         setFormState((prev) => ({
            ...prev,
            errors: {
               ...prev.errors,
               avatar: "File size must be less than 5MB",
            },
         }));
         return;
      }

      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
         setFormState((prev) => ({
            ...prev,
            errors: {
               ...prev.errors,
               avatar: "Only JPG and PNG files are allowed",
            },
         }));
         return;
      }

      setFormState((prev) => ({
         ...prev,
         errors: { ...prev.errors, avatar: undefined },
      }));

      setFormData((prev) => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onload = () => {
         setFormState((prev) => ({ ...prev, avatarPreview: reader.result }));
      };
      reader.readAsDataURL(file);
   };
   //Validation functions
   const validateForm = () => {
      let errors = {};

      // Candidate validation
      if (formData.role === userRoles.CANDIDATE) {
         if (!formData.fullName.trim()) {
            errors.fullName = "Full name is required.";
         }
         if (!formData.personalEmail.trim()) {
            errors.personalEmail = "Email is required.";
         } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)
         ) {
            errors.personalEmail = "Please enter a valid email address.";
         }
      }

      // Organization validation
      if (formData.role === userRoles.ORGANIZATION) {
         if (!formData.companyName.trim()) {
            errors.companyName = "Company name is required.";
         }
         if (!formData.companyEmail.trim()) {
            errors.companyEmail = "Company email is required.";
         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
            errors.companyEmail = "Please enter a valid email address.";
         }
      }

      if (!formData.password) {
         errors.password = "Password is required.";
      } else if (
         !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
      ) {
         errors.password =
            "Must be 8+ chars, include uppercase, lowercase, and number.";
      }

      if (!formData.confirmPassword) {
         errors.confirmPassword = "Please confirm your password.";
      } else if (formData.confirmPassword !== formData.password) {
         errors.confirmPassword = "Passwords do not match.";
      }

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

      try {
         let avatarUrl = "";

         //Upload image if present
         if (formData.avatar) {
            const imgUploadRes = await uploadImage(formData.avatar);
            avatarUrl = imgUploadRes.imageUrl || "";
         }
         const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            name: formData.fullName,
            email:
               formData.role === userRoles.CANDIDATE
                  ? formData.personalEmail
                  : formData.companyEmail,
            password: formData.password,
            role: formData.role,
            avatar: avatarUrl || "",
         });

         //Handle successful registration
         setFormState((prev) => ({
            ...prev,
            loading: false,
            success: true,
            errors: {},
         }));

         const { token } = response.data;
         if (token) {
            login(response.data, token);

            //Redirect based on role
            setTimeout(() => {
               window.location.href =
                  formData.role === "organization"
                     ? "/organization-dashboard"
                     : "/find-jobs";
            }, 2000);
         }
      } catch (error) {
         console.log("error", error);

         setFormState((prev) => ({
            ...prev,
            loading: false,
            errors: {
               submit:
                  error.response?.data?.message ||
                  "Registration failed. Please try again.",
            },
         }));
      }
   };
   return (
      <div className="min-h-screen flex justify-center items-start sm:items-center bg-neutral py-10 sm:py-12 px-4">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center"
         >
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
               <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-2">
                  Create Account
               </h2>
               <p className="text-center text-paragraph mb-5">
                  Join us and kickstart your journey
               </p>

               <form onSubmit={handleSignup} className="space-y-4">
                  {/*Role Selection*/}
                  <div className="mb-6">
                     <label className="block text-base font-medium text-label mb-3">
                        I am a:
                     </label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Candidate Button */}
                        <button
                           type="button"
                           className={`flex flex-col items-center p-4 sm:p-5 rounded-lg border border-label transition ${
                              formData.role === userRoles.CANDIDATE
                                 ? "border-primary bg-[#F7F7F8]"
                                 : "border-outline"
                           } focus:outline-none focus:ring-2 focus:ring-primary`}
                           onClick={() => handleRoleChange(userRoles.CANDIDATE)}
                        >
                           <User size={28} className="mb-2 text-primary" />
                           <span className="font-medium">Candidate</span>
                           <span className="text-[0.85rem] text-gray-500">
                              Looking for opportunities
                           </span>
                        </button>
                        {/* Organization Button */}
                        <button
                           type="button"
                           className={`flex flex-col items-center p-4 sm:p-5 rounded-lg border transition ${
                              formData.role === userRoles.ORGANIZATION
                                 ? "border-primary bg-[#F7F7F8]"
                                 : "border-outline"
                           } focus:outline-none focus:ring-2 focus:ring-primary`}
                           onClick={() =>
                              handleRoleChange(userRoles.ORGANIZATION)
                           }
                        >
                           <Building size={28} className="mb-2 text-primary" />
                           <span className="font-medium">Organizations</span>
                           <span className="text-[0.85rem] text-gray-500">
                              Looking for talents
                           </span>
                        </button>
                     </div>
                  </div>

                  {formData.role === userRoles.CANDIDATE && (
                     <>
                        {/*Full Name*/}
                        <div>
                           <label
                              className="block p-2 text-primary text-base font-medium"
                              htmlFor="fullName"
                           >
                              Full Name
                           </label>
                           <div>
                              <input
                                 id="fullName"
                                 type="text"
                                 name="fullName"
                                 value={formData.fullName}
                                 placeholder="Enter your first name"
                                 onChange={handleInputChange}
                                 className={`w-full p-2 pl-3 rounded-md border ${
                                    formState.errors.fullName
                                       ? "border-error"
                                       : "border-outline"
                                 } focus:outline-none focus:ring-2 focus:ring-accent`}
                              />
                              {formState.errors.fullName && (
                                 <p className="text-error text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formState.errors.fullName}
                                 </p>
                              )}
                           </div>
                        </div>

                        {/*Email*/}
                        <div>
                           <label
                              className="block p-2 text-primary text-base font-medium"
                              htmlFor="personalEmail"
                           >
                              Email Address
                           </label>
                           <div>
                              <input
                                 id="personalEmail"
                                 type="email"
                                 name="personalEmail"
                                 value={formData.personalEmail}
                                 placeholder="Enter your email"
                                 onChange={handleInputChange}
                                 className={`w-full p-2 pl-3 rounded-md border ${
                                    formState.errors.personalEmail
                                       ? "border-error"
                                       : "border-outline"
                                 } focus:outline-none focus:ring-2 focus:ring-accent`}
                              />
                              {formState.errors.personalEmail && (
                                 <p className="text-error text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formState.errors.personalEmail}
                                 </p>
                              )}
                           </div>
                        </div>
                     </>
                  )}
                  {formData.role === userRoles.ORGANIZATION && (
                     <>
                        {/*Company Name*/}
                        <div>
                           <label
                              className="block p-2 text-primary text-base font-medium"
                              htmlFor="companyName"
                           >
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
                                 className={`w-full p-2 pl-3 rounded-md border ${
                                    formState.errors.companyName
                                       ? "border-error"
                                       : "border-outline"
                                 } focus:outline-none focus:ring-2 focus:ring-accent`}
                              />
                              {formState.errors.companyName && (
                                 <p className="text-error text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formState.errors.companyName}
                                 </p>
                              )}
                           </div>
                        </div>

                        {/*Company Email*/}
                        <div>
                           <label
                              className="block p-2 text-primary text-base font-medium"
                              htmlFor="companyEmail"
                           >
                              Company Email
                           </label>
                           <div>
                              <input
                                 id="companyEmail"
                                 type="email"
                                 name="companyEmail"
                                 value={formData.companyEmail}
                                 placeholder="your@email.com"
                                 onChange={handleInputChange}
                                 className={`w-full p-2 pl-3 rounded-md border ${
                                    formState.errors.companyEmail
                                       ? "border-error"
                                       : "border-outline"
                                 } focus:outline-none focus:ring-2 focus:ring-accent`}
                              />
                              {formState.errors.companyEmail && (
                                 <p className="text-error text-sm mt-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formState.errors.companyEmail}
                                 </p>
                              )}
                           </div>
                        </div>
                     </>
                  )}

                  {/*Common Fields*/}

                  {/*Password*/}
                  <div>
                     <label
                        className="block p-2 text-primary text-base font-medium"
                        htmlFor="password"
                     >
                        Password
                     </label>
                     <div className="relative">
                        <input
                           id="password"
                           type={formState.showPassword ? "text" : "password"}
                           name="password"
                           value={formData.password}
                           placeholder="Enter your password"
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-3 rounded-md border ${
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
                  {/*Confirm Password*/}
                  <div>
                     <label
                        className="block p-2 text-primary text-base font-medium"
                        htmlFor="confirmPassword"
                     >
                        Confirm Password
                     </label>
                     <div className="relative">
                        <input
                           id="confirmPassword"
                           type={
                              formState.showConfirmPassword
                                 ? "text"
                                 : "password"
                           }
                           name="confirmPassword"
                           value={formData.confirmPassword}
                           placeholder="Re-enter your password"
                           onChange={handleInputChange}
                           className={`w-full p-2 pl-3 rounded-md border ${
                              formState.errors.confirmPassword
                                 ? "border-error"
                                 : "border-outline"
                           } focus:outline-none focus:ring-2 focus:ring-accent`}
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setFormState((prev) => ({
                                 ...prev,
                                 showConfirmPassword: !prev.showConfirmPassword,
                              }))
                           }
                           className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                        >
                           {formState.showConfirmPassword ? (
                              <Eye className="w-5 h-5" />
                           ) : (
                              <EyeOff className="w-5 h-5" />
                           )}
                        </button>
                     </div>

                     {formState.errors.confirmPassword && (
                        <p className="text-error text-sm mt-1 flex items-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.confirmPassword}
                        </p>
                     )}
                  </div>
                  {/*Upload Profile Picture*/}
                  <div>
                     <label className="block p-2 text-primary text-base font-medium">
                        Profile Picture (Optional)
                     </label>

                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Circle Preview */}
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                           {formState.avatarPreview ? (
                              <img
                                 src={formState.avatarPreview}
                                 alt="Avatar preview"
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <User className="w-8 h-8 text-icon" />
                           )}
                        </div>

                        {/* Upload Section */}
                        <div className="flex-1">
                           <input
                              id="avatar"
                              type="file"
                              name="avatar"
                              accept=".png, .jpg, .jpeg"
                              onChange={handleAvatarChange}
                              className="hidden"
                           />

                           <label
                              htmlFor="avatar"
                              className="cursor-pointer bg-gray-50 border border-outline rounded-lg px-4 py-2 text-sm font-medium text-paragraph hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                           >
                              <Upload className="w-4 h-4" />
                              <span>Upload Photo</span>
                           </label>
                           <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, up to 5MB
                           </p>
                        </div>
                     </div>
                     {formState.errors.avatar && (
                        <p className="text-error text-sm mt-1 flex item-center">
                           <AlertCircle className="w-4 h-4 mr-1" />
                           {formState.errors.avatar}
                        </p>
                     )}
                  </div>

                  <button
                     type="submit"
                     disabled={formState.loading}
                     className="w-full text-white font-semibold py-3 mt-6 rounded-md cursor-pointer bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l hover:from-secondary hover:to-primary transition-all duration-300"
                  >
                     {formState.loading ? (
                        <div className="flex items-center justify-center space-x-2">
                           <Loader className="w-5 h-5 animate-spin" />
                           <span>Signing Up...</span>
                        </div>
                     ) : (
                        <span>Sign up</span>
                     )}
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

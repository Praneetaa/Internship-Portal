import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Camera, CheckCircle2, ArrowLeft } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TextInput from "../../components/input/TextInput";
import TextArea from "../../components/input/TextArea";

const EditProfileDetails = () => {
   const { user, updateUser } = useAuth();
   const [formData, setFormData] = useState({
      companyName: user?.companyName || user?.name || "",
      email: user?.email || "",
      website: user?.website || "",
      size: user?.companySize || "",
      industry: user?.industry || "",
      location: user?.location || "",
      about: user?.companyDescription || user?.about || "",
      logo: user?.companyLogo || user?.avatar || "",
      logoFile: null,
   });
   const [statusMessage, setStatusMessage] = useState("");
   const [statusType, setStatusType] = useState(""); // "success" | "error"
   const [isSaving, setIsSaving] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleLogoChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setFormData((prev) => ({
         ...prev,
         logoFile: file,
         logo: URL.createObjectURL(file),
      }));
   };

   const handleSave = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      setStatusMessage("");
      try {
         let logoUrl = formData.logo;
         if (formData.logoFile) {
            const res = await uploadImage(formData.logoFile);
            logoUrl = res.imageUrl || logoUrl;
         }
         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            name: formData.companyName,
            companyName: formData.companyName,
            companyDescription: formData.about,
            companyLogo: logoUrl,
            avatar: logoUrl,
         });
         updateUser({
            companyName: formData.companyName,
            companyDescription: formData.about,
            companyLogo: logoUrl,
            avatar: logoUrl,
         });
         setStatusMessage("Profile updated successfully.");
         setStatusType("success");
      } catch {
         setStatusMessage("Unable to save changes. Please try again.");
         setStatusType("error");
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <DashboardLayout activeMenu="company-profile">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-text">
                     Edit company profile
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Keep your organization profile accurate and current.
                  </p>
               </div>
               <Link
                  to="/company-profile"
                  className="inline-flex items-center gap-2 rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral transition"
               >
                  <ArrowLeft className="h-4 w-4" /> Back to profile
               </Link>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
               {/* Logo upload */}
               <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-primary mb-4">
                     Company logo
                  </h2>
                  <div className="flex items-center gap-5">
                     <div className="relative">
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-outline bg-neutral flex items-center justify-center">
                           {formData.logo ? (
                              <img
                                 src={formData.logo}
                                 alt="Logo"
                                 className="h-full w-full object-cover"
                              />
                           ) : (
                              <span className="text-xl font-bold text-icon">
                                 {(formData.companyName ||
                                    "C")[0].toUpperCase()}
                              </span>
                           )}
                        </div>
                        <label
                           htmlFor="logo-upload"
                           className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary shadow hover:bg-secondary transition"
                        >
                           <Camera className="h-3.5 w-3.5 text-white" />
                        </label>
                        <input
                           id="logo-upload"
                           type="file"
                           accept=".png,.jpg,.jpeg"
                           onChange={handleLogoChange}
                           className="hidden"
                        />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-primary">
                           Upload company logo
                        </p>
                        <p className="text-xs text-label mt-0.5">
                           PNG or JPG · Max 5MB · Square recommended
                        </p>
                        <label
                           htmlFor="logo-upload"
                           className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-outline bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-neutral transition"
                        >
                           <Upload className="h-3.5 w-3.5" /> Choose file
                        </label>
                     </div>
                  </div>
               </div>

               {/* Company details */}
               <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-primary mb-4">
                     Company details
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                     <TextInput
                        label="Company name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Beaconn Studio"
                     />
                     <TextInput
                        label="Company email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hello@company.com"
                        type="email"
                     />
                     <TextInput
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="www.company.com"
                     />
                     <TextInput
                        label="Company size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="51–200 employees"
                     />
                     <TextInput
                        label="Industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="Career Development"
                     />
                     <TextInput
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Bangkok, Thailand"
                     />
                  </div>
               </div>

               {/* About */}
               <div className="rounded-2xl border border-outline bg-white/90 p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-primary mb-4">
                     About the company
                  </h2>
                  <TextArea
                     label=""
                     name="about"
                     value={formData.about}
                     onChange={handleChange}
                     placeholder="Describe your organization, culture, and mission."
                     rows={5}
                  />
               </div>

               {/* Submit */}
               <div className="flex flex-wrap items-center gap-3">
                  <button
                     type="submit"
                     disabled={isSaving}
                     className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary transition disabled:opacity-60"
                  >
                     {isSaving ? "Saving…" : "Save changes"}
                  </button>
                  <Link
                     to="/company-profile"
                     className="rounded-full border border-outline bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-neutral transition"
                  >
                     Cancel
                  </Link>
                  {statusMessage && (
                     <div
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${statusType === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
                     >
                        {statusType === "success" && (
                           <CheckCircle2 className="h-4 w-4" />
                        )}
                        {statusMessage}
                     </div>
                  )}
               </div>
            </form>
         </div>
      </DashboardLayout>
   );
};

export default EditProfileDetails;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import TextInput from "../../components/input/TextInput";
import TextArea from "../../components/input/TextArea";

const EditProfileDetails = () => {
   const { user, updateUser } = useAuth();
   const [formData, setFormData] = useState({
      companyName: user?.companyName || user?.name || "",
      email: user?.companyEmail || user?.email || "",
      website: user?.website || "",
      size: user?.companySize || "",
      industry: user?.industry || "",
      location: user?.location || "",
      about: user?.about || "",
      logo: user?.logo || user?.avatar || "",
      logoFile: null,
   });
   const [statusMessage, setStatusMessage] = useState("");
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
            const imgUploadRes = await uploadImage(formData.logoFile);
            logoUrl = imgUploadRes.imageUrl || logoUrl;
         }

         await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            ...formData,
            logo: logoUrl,
         });
         updateUser({ ...formData, logo: logoUrl });
         setStatusMessage("Profile updated successfully.");
      } catch (error) {
         updateUser(formData);
         setStatusMessage("Saved locally. Sync when backend is ready.");
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <DashboardLayout activeMenu="company-profile">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     Edit company profile
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Keep your organization profile accurate and current.
                  </p>
               </div>
               <Link
                  to="/company-profile"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  Back to profile
               </Link>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
               <SectionCard title="Company details">
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
                        placeholder="hello@beaconn.io"
                        type="email"
                     />
                     <TextInput
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="www.beaconn.io"
                     />
                     <TextInput
                        label="Company size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="51-200"
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
               </SectionCard>

               <SectionCard title="Company logo">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                     <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral">
                        {formData.logo ? (
                           <img
                              src={formData.logo}
                              alt="Company logo"
                              className="h-16 w-16 rounded-2xl object-cover"
                           />
                        ) : (
                           <span className="text-xs text-label">Logo</span>
                        )}
                     </div>
                     <div>
                        <input
                           id="logo"
                           type="file"
                           accept=".png,.jpg,.jpeg"
                           onChange={handleLogoChange}
                           className="hidden"
                        />
                        <label
                           htmlFor="logo"
                           className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                        >
                           <Upload className="h-4 w-4" />
                           Upload logo
                        </label>
                        <p className="mt-1 text-xs text-label">
                           PNG or JPG up to 5MB
                        </p>
                     </div>
                  </div>
               </SectionCard>

               <SectionCard title="About">
                  <TextArea
                     label="Company summary"
                     name="about"
                     value={formData.about}
                     onChange={handleChange}
                     placeholder="Describe your organization and culture."
                     rows={5}
                  />
               </SectionCard>

               <div className="flex flex-wrap items-center gap-3">
                  <button
                     type="submit"
                     disabled={isSaving}
                     className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-secondary"
                  >
                     {isSaving ? "Saving..." : "Save changes"}
                  </button>
                  {statusMessage && (
                     <span className="text-sm text-label">
                        {statusMessage}
                     </span>
                  )}
               </div>
            </form>
         </div>
      </DashboardLayout>
   );
};

export default EditProfileDetails;

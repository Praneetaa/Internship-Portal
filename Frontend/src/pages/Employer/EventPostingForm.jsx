import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { EVENT_TYPES, EVENT_MODES } from "../../utils/data";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionCard from "../../components/cards/SectionCard";
import TextInput from "../../components/input/TextInput";
import TextArea from "../../components/input/TextArea";
import SelectInput from "../../components/input/SelectInput";
import uploadImage from "../../utils/uploadImage";

const defaultForm = {
   title: "",
   description: "",
   eventType: "Workshop",
   mode: "Online",
   location: "",
   link: "",
   date: "",
   endDate: "",
   deadline: "",
   seats: "",
   tags: "",
   coverImage: "",
};

const EventPostingForm = () => {
   const [formData, setFormData] = useState(defaultForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [statusMessage, setStatusMessage] = useState("");
   const [editingEventId, setEditingEventId] = useState(null);
   const [imagePreview, setImagePreview] = useState("");
   const [imageUploading, setImageUploading] = useState(false);
   const fileInputRef = useRef(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get("eventId");
      if (!eventId) return;
      setEditingEventId(eventId);
      const loadEvent = async () => {
         try {
            const res = await axiosInstance.get(
               API_PATHS.EVENTS.GET_EVENT_BY_ID(eventId),
            );
            if (res.status === 200 && res.data) {
               const ev = res.data;
               setFormData({
                  title: ev.title || "",
                  description: ev.description || "",
                  eventType: ev.eventType || "Workshop",
                  mode: ev.mode || "Online",
                  location: ev.location || "",
                  link: ev.link || "",
                  date: ev.date ? ev.date.slice(0, 16) : "",
                  endDate: ev.endDate ? ev.endDate.slice(0, 16) : "",
                  deadline: ev.deadline ? ev.deadline.slice(0, 10) : "",
                  seats: ev.seats || "",
                  tags: ev.tags || "",
                  coverImage: ev.coverImage || "",
               });
               if (ev.coverImage) setImagePreview(ev.coverImage);
            }
         } catch {
            setEditingEventId(null);
         }
      };
      loadEvent();
   }, []);

   const handleImageSelect = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
         setStatusMessage("Cover image must be JPG, PNG, or WebP.");
         return;
      }
      setImageUploading(true);
      setStatusMessage("");
      // Local preview
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
      try {
         const res = await uploadImage(file);
         const url = res?.imageUrl;
         if (!url) throw new Error("No URL returned");
         setFormData((prev) => ({ ...prev, coverImage: url }));
         setImagePreview(url);
      } catch {
         setStatusMessage("Image upload failed. Please try again.");
         setImagePreview("");
      } finally {
         setImageUploading(false);
      }
   };

   const removeCoverImage = () => {
      setImagePreview("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setStatusMessage("");

      if (!formData.title.trim()) {
         setStatusMessage("Event title is required.");
         setIsSubmitting(false);
         return;
      }
      if (!formData.description.trim()) {
         setStatusMessage("Event description is required.");
         setIsSubmitting(false);
         return;
      }
      if (!formData.date) {
         setStatusMessage("Event date and time is required.");
         setIsSubmitting(false);
         return;
      }

      const payload = {
         title: formData.title,
         description: formData.description,
         eventType: formData.eventType,
         mode: formData.mode,
         location: formData.location || undefined,
         link: formData.link || undefined,
         date: formData.date,
         endDate: formData.endDate || undefined,
         deadline: formData.deadline || undefined,
         seats: formData.seats ? Number(formData.seats) : undefined,
         tags: formData.tags || undefined,
         coverImage: formData.coverImage || undefined,
      };

      try {
         if (editingEventId) {
            await axiosInstance.put(
               API_PATHS.EVENTS.UPDATE_EVENT(editingEventId),
               payload,
            );
            setStatusMessage("Event updated successfully.");
         } else {
            await axiosInstance.post(API_PATHS.EVENTS.POST_EVENT, payload);
            setStatusMessage("Event posted successfully.");
            setFormData(defaultForm);
            setImagePreview("");
         }
      } catch (err) {
         if (err?.response?.status === 403) {
            setStatusMessage("Only organization accounts can post events.");
         } else if (err?.response?.data?.message) {
            setStatusMessage(err.response.data.message);
         } else {
            setStatusMessage("Unable to save event right now.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <DashboardLayout activeMenu="post-event">
         <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold text-primary">
                     {editingEventId ? "Edit event" : "Post an event"}
                  </h1>
                  <p className="mt-1 text-sm text-label">
                     Share workshops, webinars, seminars and other career
                     opportunities with candidates.
                  </p>
               </div>
               <Link
                  to="/manage-events"
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-neutral"
               >
                  Manage events
               </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Cover image upload */}
               <SectionCard
                  title="Event cover image"
                  subtitle="Upload a banner image to attract attendees. Recommended: 1200 × 630px."
               >
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/jpeg,image/png,image/webp"
                     onChange={handleImageSelect}
                     className="hidden"
                  />

                  {imagePreview ? (
                     <div className="relative overflow-hidden rounded-xl border border-outline">
                        <img
                           src={imagePreview}
                           alt="Event cover preview"
                           className="h-56 w-full object-cover"
                        />
                        {imageUploading && (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-sm font-semibold text-white">
                                 Uploading…
                              </span>
                           </div>
                        )}
                        <button
                           type="button"
                           onClick={removeCoverImage}
                           className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                        >
                           <X className="h-4 w-4 text-primary" />
                        </button>
                     </div>
                  ) : (
                     <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-outline bg-neutral py-10 transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
                     >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                           <ImagePlus className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center">
                           <p className="text-sm font-semibold text-primary">
                              {imageUploading
                                 ? "Uploading…"
                                 : "Click to upload cover image"}
                           </p>
                           <p className="mt-1 text-xs text-label">
                              JPG, PNG or WebP · Max 5 MB
                           </p>
                        </div>
                     </button>
                  )}
               </SectionCard>

               {/* Core details */}
               <SectionCard
                  title="Event details"
                  subtitle="Basic information about the event."
               >
                  <div className="grid gap-4 sm:grid-cols-2">
                     <div className="sm:col-span-2">
                        <TextInput
                           label="Event title"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           placeholder="Web Development Workshop"
                        />
                     </div>
                     <SelectInput
                        label="Event type"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        options={EVENT_TYPES}
                     />
                     <SelectInput
                        label="Mode"
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        options={EVENT_MODES}
                     />
                     <TextInput
                        label="Date & time"
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleChange}
                     />
                     <TextInput
                        label="End date & time (optional)"
                        name="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={handleChange}
                     />
                     <TextInput
                        label="Registration deadline (optional)"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                     />
                     <TextInput
                        label="Available seats (optional)"
                        name="seats"
                        type="number"
                        value={formData.seats}
                        onChange={handleChange}
                        placeholder="100"
                     />
                  </div>
               </SectionCard>

               {/* Location / link */}
               <SectionCard
                  title="Location & access"
                  subtitle="Provide a venue or a link depending on event mode."
               >
                  <div className="grid gap-4 sm:grid-cols-2">
                     <TextInput
                        label="Venue / location (in-person)"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Bangkok, Thailand"
                     />
                     <TextInput
                        label="Event link (online)"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://zoom.us/j/…"
                     />
                  </div>
               </SectionCard>

               {/* Description */}
               <SectionCard
                  title="Description"
                  subtitle="Tell candidates what they will learn or experience."
               >
                  <TextArea
                     label=""
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Describe the event, speakers, agenda, and what attendees will gain."
                     rows={5}
                  />
               </SectionCard>

               {/* Tags */}
               <SectionCard
                  title="Tags"
                  subtitle="Comma-separated keywords to help candidates find this event."
               >
                  <TextInput
                     label="Tags"
                     name="tags"
                     value={formData.tags}
                     onChange={handleChange}
                     placeholder="React, Career, Design Thinking"
                  />
               </SectionCard>

               <div className="flex flex-wrap items-center gap-3">
                  <button
                     type="submit"
                     disabled={isSubmitting || imageUploading}
                     className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
                  >
                     {isSubmitting
                        ? "Saving…"
                        : editingEventId
                          ? "Update event"
                          : "Post event"}
                  </button>
                  <button
                     type="button"
                     onClick={() => {
                        setFormData(defaultForm);
                        setImagePreview("");
                     }}
                     className="rounded-full border border-outline bg-white px-6 py-2 text-sm font-semibold text-primary hover:bg-neutral"
                  >
                     Reset form
                  </button>
                  {statusMessage && (
                     <span className="text-sm text-label">{statusMessage}</span>
                  )}
               </div>
            </form>
         </div>
      </DashboardLayout>
   );
};

export default EventPostingForm;

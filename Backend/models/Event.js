import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String, required: true },
      eventType: {
         type: String,
         enum: [
            "Workshop",
            "Webinar",
            "Seminar",
            "Networking",
            "Career Fair",
            "Other",
         ],
         required: true,
      },
      mode: {
         type: String,
         enum: ["Online", "In-Person", "Hybrid"],
         required: true,
      },
      location: { type: String },
      link: { type: String },
      date: { type: Date, required: true },
      endDate: { type: Date },
      deadline: { type: Date },
      coverImage: { type: String },
      seats: { type: Number },
      tags: { type: String },
      organizer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      isClosed: { type: Boolean, default: false },
   },
   { timestamps: true },
);

export default mongoose.model("Event", eventSchema);

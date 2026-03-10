import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String, required: true },
      requirements: { type: String, required: true },
      location: { type: String },
      category: { type: String },
      workMode: {
         type: String,
         enum: ["Remote", "On-site", "Hybrid"],
         required: true,
      },
      duration: String,
      stipend: Number,
      deadline: Date,
      company: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      }, //Employer

      isClosed: { type: Boolean, default: false },
   },
   { timestamps: true }
);
export default mongoose.model("Job", jobSchema);

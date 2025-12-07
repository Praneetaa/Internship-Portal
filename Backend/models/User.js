import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      fullName: { type: String },
      companyName: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
         type: String,
         enum: ["candidate", "organization"],
         required: true,
      },
      avatar: { type: String },
   },
   { timestamps: true }
);

export default mongoose.model("User", userSchema);

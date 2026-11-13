import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
   {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
      name: { type: String },
   },
   { timestamps: true },
);

export default mongoose.model("File", fileSchema);

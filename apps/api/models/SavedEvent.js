import mongoose from "mongoose";

const savedEventSchema = new mongoose.Schema(
   {
      candidate: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      event: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Event",
         required: true,
      },
   },
   { timestamps: true },
);

// A student can save each event only once.
savedEventSchema.index({ candidate: 1, event: 1 }, { unique: true });

export default mongoose.model("SavedEvent", savedEventSchema);

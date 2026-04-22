import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
   {
      event: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Event",
         required: true,
      },
      candidate: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true },
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);

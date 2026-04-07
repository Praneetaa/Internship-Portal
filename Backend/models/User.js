import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
         type: String,
         enum: ["candidate", "organization"],
         required: true,
      },
      avatar: String,
      resume: String,

      //for organization
      companyName: String,
      companyDescription: String,
      companyLogo: String,
   },
   { timestamps: true },
);

//Encrypt password before save
userSchema.pre("save", async function () {
   if (!this.isModified("password")) return;
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

//Match entered password
userSchema.methods.matchPassword = function (enteredPassword) {
   return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import User from "../models/User.js";
import File from "../models/File.js";

//@desc Update user profile (name, avatar, company details)
export const updateProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const {
         name,
         avatar,
         companyName,
         companyDescription,
         companyLogo,
         resume,
      } = req.body;
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.resume = resume || user.resume;

      //If organization, allow updating company info
      if (user.role === "organization") {
         user.companyName = companyName || user.companyName;
         user.companyDescription =
            companyDescription || user.companyDescription;
         user.companyLogo = companyLogo || user.companyLogo;
      }
      await user.save();
      res.json({
         _id: user._id,
         name: user.name,
         avatar: user.avatar,
         role: user.role,
         companyName: user.companyName,
         companyDescription: user.companyDescription,
         companyLogo: user.companyLogo,
         resume: user.resume || "",
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//@desc Delete resume file (organization only)
export const deleteResume = async (req, res) => {
   try {
      const { resumeUrl } = req.body; //expect resumeUrl to be the URL of the resume

      //Last URL segment is the File document id
      const fileId = resumeUrl?.split("/")?.pop();

      const user = await User.findById(req.user._id);
      if (user.role !== "organization")
         return res
            .status(403)
            .json({ message: "Only organization can delete resume" });

      //Drop the stored bytes from MongoDB
      if (mongoose.isValidObjectId(fileId)) {
         await File.findByIdAndDelete(fileId);
      }

      //Set the user's resume to an empty string
      user.resume = "";
      await user.save();
      res.json({ message: "Resume delete successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//@desc Get user public profile
export const getPublicProfile = async (req, res) => {
   try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

import mongoose from "mongoose";
import File from "../models/File.js";

// Absolute URL so the frontend can drop it into <img>/<a> as before
const fileUrl = (req, id) =>
   `${req.protocol}://${req.get("host")}/api/files/${id}`;

//@desc Store uploaded bytes in MongoDB
export const uploadFile = async (req, res) => {
   if (!req.file) return res.status(400).json({ message: "No file uploaded" });
   try {
      const file = await File.create({
         data: req.file.buffer,
         contentType: req.file.mimetype,
         name: req.file.originalname,
      });
      res.status(200).json({ imageUrl: fileUrl(req, file._id) });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//@desc Stream a stored file back
export const getFile = async (req, res) => {
   if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid file id" });
   try {
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ message: "File not found" });
      res.set("Content-Type", file.contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.send(file.data);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

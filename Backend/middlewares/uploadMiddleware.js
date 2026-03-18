import multer from "multer";

//Configure storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
   },
});

//File filter
const fileFilter = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Only .jpeg, .png, and .pdf formats are allowed"), false);
   }
};
const upload = multer({ storage, fileFilter });

export default upload;

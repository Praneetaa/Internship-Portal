import multer from "multer";

//File filter
const fileFilter = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Only .jpeg, .png, and .pdf formats are allowed"), false);
   }
};

// ponytail: bytes go straight into MongoDB, so keep files in memory and cap at
// 5MB (Mongo doc limit is 16MB). Move to S3/Blob if files get bigger.
const upload = multer({
   storage: multer.memoryStorage(),
   fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;

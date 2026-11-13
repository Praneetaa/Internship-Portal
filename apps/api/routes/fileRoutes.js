import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadFile, getFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadFile);
router.get("/:id", getFile);

export default router;

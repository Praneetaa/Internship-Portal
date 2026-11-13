import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// POST /api/auth/upload-image — kept for the existing frontend path
router.post("/upload-image", upload.single("image"), uploadFile);

export default router;

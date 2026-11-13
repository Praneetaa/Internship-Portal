import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
   saveJob,
   unsaveJob,
   getMySavedJobs,
} from "../controllers/savedJobController.js";

const router = Router();

router.get("/my", protect, getMySavedJobs);
router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);

export default router;

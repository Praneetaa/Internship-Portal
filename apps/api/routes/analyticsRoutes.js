import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getOrganizationAnalytics } from "../controllers/analyticsController.js";

const router = Router();

router.get("/overview", protect, getOrganizationAnalytics);

export default router;

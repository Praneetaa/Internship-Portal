import express from "express";
import {
   createJob,
   getJobs,
   getJobById,
   updateJob,
   deleteJob,
   toggleCloseJob,
   getJobsOrganization,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createJob).get(getJobs);
router.route("/get-jobs-organization").get(protect, getJobsOrganization);
router
   .route("/:id")
   .get(getJobById)
   .put(protect, updateJob)
   .delete(protect, deleteJob);
router.put("/:id/toggle-close", protect, toggleCloseJob);

export default router;

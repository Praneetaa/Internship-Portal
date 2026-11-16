import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
   createEvent,
   getEvents,
   getMyEvents,
   getEventById,
   updateEvent,
   deleteEvent,
   toggleCloseEvent,
   registerForEvent,
   unregisterFromEvent,
   getMyRegisteredEvents,
   getEventRegistrants,
   saveEvent,
   unsaveEvent,
   getMySavedEvents,
} from "../controllers/eventController.js";

const router = Router();

// Public
router.get("/", getEvents);
router.get("/:id", getEventById);

// Organization
router.post("/", protect, createEvent);
router.get("/org/my-events", protect, getMyEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.put("/:id/toggle-close", protect, toggleCloseEvent);
router.get("/:id/registrants", protect, getEventRegistrants);

// Candidate
router.post("/:id/register", protect, registerForEvent);
router.delete("/:id/register", protect, unregisterFromEvent);
router.get("/candidate/my-registrations", protect, getMyRegisteredEvents);
router.get("/candidate/saved", protect, getMySavedEvents);
router.post("/:id/save", protect, saveEvent);
router.delete("/:id/save", protect, unsaveEvent);

export default router;

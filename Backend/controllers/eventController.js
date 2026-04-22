import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

// @desc  Create an event (organization only)
export const createEvent = async (req, res) => {
   try {
      if (req.user.role !== "organization") {
         return res
            .status(403)
            .json({ message: "Only organizations can post events" });
      }
      const event = await Event.create({
         ...req.body,
         organizer: req.user._id,
      });
      res.status(201).json(event);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Get all open events (public, with registration status if userId provided)
export const getEvents = async (req, res) => {
   const { keyword, eventType, mode, userId } = req.query;

   const query = {
      isClosed: false,
      ...(keyword && { title: { $regex: keyword, $options: "i" } }),
      ...(eventType && { eventType }),
      ...(mode && { mode }),
   };

   try {
      const events = await Event.find(query)
         .populate("organizer", "name companyName companyLogo")
         .sort({ date: 1 });

      let registeredEventIds = [];
      if (userId) {
         const regs = await EventRegistration.find({
            candidate: userId,
         }).select("event");
         registeredEventIds = regs.map((r) => String(r.event));
      }

      const eventsWithExtras = events.map((ev) => ({
         ...ev.toObject(),
         isRegistered: registeredEventIds.includes(String(ev._id)),
      }));

      res.json(eventsWithExtras);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Get events posted by the logged-in organization
export const getMyEvents = async (req, res) => {
   try {
      if (req.user.role !== "organization") {
         return res.status(403).json({ message: "Access denied" });
      }
      const events = await Event.find({ organizer: req.user._id })
         .populate("organizer", "name companyName companyLogo")
         .sort({ createdAt: -1 });

      // Attach registrant count
      const eventsWithCounts = await Promise.all(
         events.map(async (ev) => {
            const count = await EventRegistration.countDocuments({
               event: ev._id,
            });
            return { ...ev.toObject(), registrantCount: count };
         }),
      );

      res.json(eventsWithCounts);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Get single event by ID
export const getEventById = async (req, res) => {
   try {
      const { userId } = req.query;
      const event = await Event.findById(req.params.id).populate(
         "organizer",
         "name companyName companyLogo",
      );
      if (!event) return res.status(404).json({ message: "Event not found" });

      let isRegistered = false;
      if (userId) {
         const reg = await EventRegistration.findOne({
            event: event._id,
            candidate: userId,
         });
         isRegistered = !!reg;
      }

      const count = await EventRegistration.countDocuments({
         event: event._id,
      });

      res.json({ ...event.toObject(), isRegistered, registrantCount: count });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Update an event (organization only, own events)
export const updateEvent = async (req, res) => {
   try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizer.toString() !== req.user._id.toString()) {
         return res
            .status(403)
            .json({ message: "Not authorized to update this event" });
      }
      Object.assign(event, req.body);
      const updated = await event.save();
      res.json(updated);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Delete an event (organization only, own events)
export const deleteEvent = async (req, res) => {
   try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizer.toString() !== req.user._id.toString()) {
         return res
            .status(403)
            .json({ message: "Not authorized to delete this event" });
      }
      await EventRegistration.deleteMany({ event: event._id });
      await event.deleteOne();
      res.json({ message: "Event deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Toggle close/open status
export const toggleCloseEvent = async (req, res) => {
   try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizer.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: "Not authorized" });
      }
      event.isClosed = !event.isClosed;
      await event.save();
      res.json({ message: "Event status updated", isClosed: event.isClosed });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Register for an event (candidate only)
export const registerForEvent = async (req, res) => {
   try {
      if (req.user.role !== "candidate") {
         return res
            .status(403)
            .json({ message: "Only candidates can register" });
      }
      const event = await Event.findById(req.params.id);
      if (!event || event.isClosed) {
         return res.status(400).json({ message: "Event is not available" });
      }
      const existing = await EventRegistration.findOne({
         event: req.params.id,
         candidate: req.user._id,
      });
      if (existing)
         return res.status(400).json({ message: "Already registered" });

      // Check seat limit
      if (event.seats) {
         const count = await EventRegistration.countDocuments({
            event: req.params.id,
         });
         if (count >= event.seats) {
            return res.status(400).json({ message: "Event is fully booked" });
         }
      }

      const reg = await EventRegistration.create({
         event: req.params.id,
         candidate: req.user._id,
      });
      res.status(201).json(reg);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Unregister from an event (candidate only)
export const unregisterFromEvent = async (req, res) => {
   try {
      await EventRegistration.findOneAndDelete({
         event: req.params.id,
         candidate: req.user._id,
      });
      res.json({ message: "Unregistered successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Get candidate's registered events
export const getMyRegisteredEvents = async (req, res) => {
   try {
      const regs = await EventRegistration.find({ candidate: req.user._id })
         .populate({
            path: "event",
            populate: {
               path: "organizer",
               select: "name companyName companyLogo",
            },
         })
         .sort({ createdAt: -1 });
      res.json(regs);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// @desc  Get registrants for an event (organization only)
export const getEventRegistrants = async (req, res) => {
   try {
      const event = await Event.findById(req.params.id);
      if (!event || event.organizer.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: "Not authorized" });
      }
      const regs = await EventRegistration.find({
         event: req.params.id,
      }).populate("candidate", "name email avatar");
      res.json(regs);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

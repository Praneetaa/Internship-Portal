import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

// Behind Vercel's proxy: trust X-Forwarded-Proto so req.protocol is "https"
// (uploaded file URLs would otherwise start with http:// and be blocked).
app.set("trust proxy", true);

//Middleware to handle CORS
app.use(
   cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   }),
);

//Middleware
app.use(express.json());

//Health check (no database needed)
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

//Make sure MongoDB is connected before any API route runs. If it fails,
//answer with a 503 instead of crashing; the next request retries.
app.use("/api", async (req, res, next) => {
   try {
      await connectDB();
      next();
   } catch (error) {
      console.error("Error connecting to MongoDB", error);
      res.status(503).json({
         message: "Database is unavailable right now. Please try again.",
      });
   }
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/files", fileRoutes);

//Start server
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
   // Locally, connect at startup so a bad MONGO_URI is obvious right away.
   connectDB().catch((error) => {
      console.error("Error connecting to MongoDB", error);
      process.exit(1);
   });
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;

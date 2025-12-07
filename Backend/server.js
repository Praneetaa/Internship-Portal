import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

//Connect to MangoDB
connectDB();

//Middleware
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

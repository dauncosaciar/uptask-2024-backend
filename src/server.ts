import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";

// Allow reading of .env files
dotenv.config();

// Connect to database
connectDB();

// Create express application
const app = express();

// Allow CORS
app.use(cors(corsConfig));

// Enable read forms data
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);

export default app;

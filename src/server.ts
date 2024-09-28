import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Load .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

export default app;

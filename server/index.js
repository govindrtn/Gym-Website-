import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { seedInitialData } from "./data/seedData.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { authRoutes } from "./routes/authRoutes.js";
import { coachRoutes } from "./routes/coachRoutes.js";
import { enquiryRoutes } from "./routes/enquiryRoutes.js";
import { memberRoutes } from "./routes/memberRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN || "").split(","),
  "http://127.0.0.1:5173",
  "http://localhost:5173",
].map((origin) => origin.trim().replace(/\/$/, "")).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (request, response) => {
  response.json({
    ok: true,
    service: "Silver Gym API",
    databaseReadyState: mongoose.connection.readyState,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    await seedInitialData();

    app.listen(PORT, HOST, () => {
      console.log(`Silver Gym API listening on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start Silver Gym API:", error.message);
    process.exit(1);
  }
}

startServer();

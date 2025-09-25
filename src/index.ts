import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";
import actionPlanRoutes from "./routes/actionPlanRoutes";
import locationRoutes from "./routes/location";
import userRoutes from "./routes/user";
import bodyParser from "body-parser";
import ENVIRONMENT from "./utils/environment";
import connectDB from "./config/db";

const app = express();


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow non-browser requests like Postman
        return callback(null, true);
      }
      if (ENVIRONMENT.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`)); // Reject the request
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);
connectDB();
// Middleware
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FamilyNation is running" });
});

// Chat routes
app.use("/api/chat", chatRoutes);
app.use("/api/action-plan", actionPlanRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ FamilyNation running at http://localhost:${PORT}`);
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";
import actionPlanRoutes from "./routes/actionPlanRoutes";
import locationRoutes from "./routes/location";
import userRoutes from "./routes/user";
import connectDB from "./config/db";
import ENVIRONMENT from "./utils/environment";

const app = express();

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser requests (Postman)
      if (ENVIRONMENT.ALLOWED_ORIGINS.includes(origin)) callback(null, true);
      else callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

// Body parsers
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FamilyNation is running" });
});

// -----------------------
// API Routes
// -----------------------
app.use("/api/chat", chatRoutes);
app.use("/api/action-plan", actionPlanRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);

// -----------------------
// Start Server
// -----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ FamilyNation running at http://localhost:${PORT}`);
});

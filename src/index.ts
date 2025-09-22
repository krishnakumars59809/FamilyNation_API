import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";
import actionPlanRoutes from "./routes/actionPlanRoutes";
import bodyParser from "body-parser";

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080"; // Default to localhost:8080 if not set
// ✅ Enable CORS for FE (React on port 3000)
app.use(
  cors({
    origin: CLIENT_ORIGIN, // adjust for production later
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FamilyNation is running" });
});

// Chat routes
app.use("/api/chat", chatRoutes);
app.use("/api/action-plan", actionPlanRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ FamilyNation running at http://localhost:${PORT}`);
});

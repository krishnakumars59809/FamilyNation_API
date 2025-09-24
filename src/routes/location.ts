// server/routes/hazelRoutes.ts
import { Router } from "express";
import { getLocation } from "../controllers/locationController";

const router = Router();

// Start new Hazel session
router.get("/getLocation", getLocation);

export default router;

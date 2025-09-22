// server/routes/actionPlanRoutes.ts
import express from "express";
import { getRecommendedProfessionals } from "../controllers/actionPlanController";

const router = express.Router();

router.post("/recommendedProfessionals", getRecommendedProfessionals);

export default router;

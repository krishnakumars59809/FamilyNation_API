// server/routes/hazelRoutes.ts
import { Router } from "express";
import { replyChat, startChat } from "../controllers/chatController";

const router = Router();

// Start new Hazel session
router.post("/start", startChat);

// Reply to Hazel questions
router.post("/reply", replyChat);

export default router;

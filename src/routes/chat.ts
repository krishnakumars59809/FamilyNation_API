import { Router } from "express";
import {
  replyChat,
  startChat,
  textToAudio,
  transcribeAudio,
} from "../controllers/chatController";
import multer from "multer";

const router = Router();

// Memory storage for serverless environments
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Start new Hazel session
router.post("/start", startChat);

// Reply to Hazel questions
router.post("/reply", replyChat);

router.post("/transcribe", upload.single("audio"), transcribeAudio);
router.post("/textToAudio", textToAudio);

export default router;

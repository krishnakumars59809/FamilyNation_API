// server/routes/hazelRoutes.ts
import { Router } from "express";
import {
  replyChat,
  startChat,
  transcribeAudio,
} from "../controllers/chatController";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // make sure this folder exists
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Start new Hazel session
router.post("/start", startChat);

// Reply to Hazel questions
router.post("/reply", replyChat);

router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;

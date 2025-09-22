// server/controllers/hazelController.ts
import { Request, Response } from "express";
import { Session } from "../types/chat";
import { hazelTriageQuestions } from "../data/question";

// In-memory store for sessions
const sessions: Record<string, Session> = {};

/**
 * Start a new Hazel chat session
 */
export const startChat = (req: Request, res: Response) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = { index: 0, responses: [] };

  res.json({
    sessionId,
    message: "Hi, I'm Hazel. Let's start with a few questions.",
    question: hazelTriageQuestions[0],
  });
};

/**
 * Handle reply to a Hazel question
 */
export const replyChat = (req: Request, res: Response) => {
  const { sessionId, answer } = req.body;

  if (!sessions[sessionId]) {
    return res.status(400).json({ error: "Invalid session" });
  }

  const session = sessions[sessionId];
  session.responses.push(answer);

  // If more questions left
  if (session.index < hazelTriageQuestions.length - 1) {
    session.index += 1;
    res.json({
      message: hazelTriageQuestions[session.index].question,
      question: hazelTriageQuestions[session.index],
    });
  } else {
    // Completed all questions
    res.json({
      message: "Thank you for your answers. I'm analyzing your situation and preparing recommendations.",
      completed: true,
      responses: session.responses,
    });
    delete sessions[sessionId]; // end session
  }
};

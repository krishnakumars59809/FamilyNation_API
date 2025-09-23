// server/controllers/hazelController.ts
import { Request, Response } from "express";
import { Session } from "../types/chat";
import { hazelTriageQuestions } from "../data/question";
import { analyzeResponses, PredictionResult } from "../utils/predictionService";

// In-memory store for sessions
const sessions: Record<string, Session> = {};

export const startChat = (req: Request, res: Response) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = { index: 0, responses: [] };

  res.json({
    sessionId,
    message: "Hi, I'm Hazel. Let's start with a few questions.",
    question: hazelTriageQuestions[0],
  });
};

export const replyChat = (req: Request, res: Response) => {
  const { sessionId, answer } = req.body;

  if (!sessions[sessionId]) {
    return res.status(400).json({ error: "Invalid session" });
  }

  const session = sessions[sessionId];
  session.responses.push(answer);

  if (session.index < hazelTriageQuestions.length - 1) {
    session.index += 1;
    res.json({
      message: hazelTriageQuestions[session.index].question,
      question: hazelTriageQuestions[session.index],
    });
  } else {
    // Generate prediction analysis
    const prediction: PredictionResult = analyzeResponses(session.responses);
    
    res.json({
      message: "Thank you for your answers. I'm analyzing your situation...",
      completed: true,
      responses: session.responses,
      prediction: {
        stabilityScore: prediction.stabilityScore,
        riskLevel: prediction.riskLevel,
        recommendedActions: prediction.recommendedActions,
        confidence: prediction.confidence,
        message: generatePredictionMessage(prediction)
      }
    });
    delete sessions[sessionId];
  }
};

const generatePredictionMessage = (prediction: PredictionResult): string => {
  const { stabilityScore, riskLevel } = prediction;
  
  if (riskLevel === "high") {
    return `Based on your responses, I'm seeing a ${100 - stabilityScore}% risk of escalating challenges. But with the right support, we can improve stability by up to 60% in the next 3 months.`;
  } else if (riskLevel === "medium") {
    return `Your current stability score is ${stabilityScore}%. With consistent support, we can increase this to 80%+ within 2-3 months.`;
  } else {
    return `Great! Your stability score is ${stabilityScore}%. We can help you maintain and build on this strong foundation.`;
  }
};
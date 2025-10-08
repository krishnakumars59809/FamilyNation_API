import { Request, Response } from "express";
import { Session } from "../types/chat";
import { hazelTriageQuestions } from "../data/question";
import { analyzeResponses, PredictionResult } from "../utils/predictionService";
import fs from "fs";
import path from "path";
import multer from "multer";
import { convertAudioToText } from "../utils/convertAudioToText";
import { convertTextToAudio } from "../utils/convertTextToAudio";

const sessions: Record<string, Session> = {};
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
// ===============================
// Multer config for file uploads
// ===============================
const upload = multer({ storage: multer.memoryStorage() });
export const voiceUpload = upload.single("voice");
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
        message: generatePredictionMessage(prediction),
      },
    });
    delete sessions[sessionId];
  }
};

const generatePredictionMessage = (prediction: PredictionResult): string => {
  const { stabilityScore, riskLevel } = prediction;

  if (riskLevel === "high") {
    return `Based on your responses, I'm seeing a ${
      100 - stabilityScore
    }% risk of escalating challenges. But with the right support, we can improve stability by up to 60% in the next 3 months.`;
  } else if (riskLevel === "medium") {
    return `Your current stability score is ${stabilityScore}%. With consistent support, we can increase this to 80%+ within 2-3 months.`;
  } else {
    return `Great! Your stability score is ${stabilityScore}%. We can help you maintain and build on this strong foundation.`;
  }
};

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer)
    return res.status(400).json({ error: "No audio file uploaded" });

  try {
    const text = await convertAudioToText(req.file.buffer);
    res.json({ text });
  } catch (error: any) {
    console.error("Error in transcribing audio:", error.message || error);
    res
      .status(500)
      .json({ error: `Internal server error - ${error.message || error}` });
  }
};

export const textToAudio = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const audioBuffer = await convertTextToAudio(text, "en-US");

    // Send audio as response (downloadable MP3)
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=output.mp3",
    });

    res.json({
      audio: audioBuffer.toString("base64"),
    });
  } catch (err) {
    res.status(500).json({ error: "TTS failed" });
  }
};

export const chat = async (req: Request, res: Response) => {
  const {messages , useSearch} = req.body;
  const text = messages;
  try {
    const systemPrompt = `You are Hazel, a compassionate and professional AI assistant for FamilyNation. Your persona is that of a warm and insightful therapist or psychiatrist. Your primary role is to create a safe, non-judgmental space where users feel comfortable sharing their concerns. You are an expert at active listening and gently guiding conversations to understand the user's core needs.

Your primary goal is to understand the user's feelings and the situation they are facing. Engage in a thoughtful, multi-turn conversation to gently explore their concerns. Ask a few open-ended, interactive questions to help them reflect and articulate their needs (e.g., "How has this been affecting you?", "What are your hopes for resolving this?"). Your most critical safety protocol is to recognize the limits of your AI capabilities. You must not provide therapy, diagnosis, or advice. When a query requires professional judgment, your instruction is to gently and clearly guide them toward connecting with one of our human experts, reassuring them that speaking to a person is a positive next step.

You are operating within the FamilyNation website. Users are here seeking support for various family-related matters, which can be deeply personal and sensitive. Your conversation is the first step in their journey to getting help.

Your response must be a conversational response, strictly under 50 words. Your language should be clear, simple, and reassuring. Structure your responses to be helpful and to guide the conversation forward by asking insightful, clarifying questions.

Your audience consists of individuals and families who may be feeling stressed, confused, or vulnerable. Your interaction should make them feel deeply heard, validated, and empowered to seek the help they need.

The tone must be consistently empathetic, calm, patient, and professional, like a trusted therapist. You are here to listen and help the user explore their thoughts, not to solve their problems for them.`;
    const userQuery = `Here is the family context based on the assessment answers: ${text}. Provide a short supportive next-step message.not exceeding 20 words and strictly within 2-3 senetences only`;

    const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          parts: [{ text }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
     tools: useSearch ? [{ google_search: {} }] : []
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    res.json(data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: `Error calling Gemini API - ${error}` });
  }
};

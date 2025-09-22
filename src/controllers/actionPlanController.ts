// server/controllers/actionPlanController.ts
import { Request, Response } from "express";

interface Professional {
  name: string;
  title: string;
  specialty: string;
  rating: number;
  distance: string;
  availability: string;
  phone: string;
  reason: string;
}

export const getRecommendedProfessionals = (req: Request, res: Response) => {
  const { responses } = req.body; // optional: use triage responses to customize plan

  // Mock logic: In real, use `responses` to generate personalized plan
  const planSteps = [
    "Take 5 deep breaths and find a quiet space",
    "Call one of the recommended professionals below",
    "Consider joining our support group meeting tonight at 7 PM",
  ];

  const professionals: Professional[] = [
    {
      name: "Dr. Sarah Chen",
      title: "Licensed Clinical Social Worker",
      specialty: "Family Crisis Intervention",
      rating: 4.9,
      distance: "2.3 miles",
      availability: "Available today",
      phone: "(555) 123-4567",
      reason: "Specializes in urgent family conflicts with 15+ years experience",
    },
    {
      name: "Michael Rodriguez, LMFT",
      title: "Licensed Marriage & Family Therapist",
      specialty: "Crisis Counseling",
      rating: 4.8,
      distance: "3.1 miles",
      availability: "Next appointment: Tomorrow 10 AM",
      phone: "(555) 234-5678",
      reason: "Expert in crisis de-escalation and immediate intervention strategies",
    },
    {
      name: "Crisis Support Center",
      title: "Community Mental Health Center",
      specialty: "24/7 Crisis Support",
      rating: 4.7,
      distance: "4.5 miles",
      availability: "Walk-ins accepted",
      phone: "(555) 345-6789",
      reason: "Immediate access to crisis counselors and emergency support services",
    },
  ];

  res.json({ planSteps, professionals });
};

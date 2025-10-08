// server/controllers/actionPlanController.ts
import { Request, Response } from "express";

type Availability = "Morning" | "Afternoon" | "Evening";
type Mode = "Online" | "In-person";
type Gender = "Male" | "Female";
type Cost = "Low" | "Medium" | "Expensive";

interface Professional {
  id: number;
  name: string;
  specialization: string;
  availability: Availability;
  mode: Mode;
  gender: Gender;
  cost: Cost;
  weekendAvailable: boolean;
  rating: number;
  // Optional fields
  phone?: string;
  reason?: string;
  title?: string;
  specialty?: string;
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
      id: 1,
      name: "Dr. Asha Menon",
      specialization: "CBT",
      availability: "Evening",
      mode: "In-person",
      gender: "Female",
      cost: "Low",
      weekendAvailable: true,
      rating: 4.7,
    },
    {
      id: 2,
      name: "Dr. Rohani Iyer",
      specialization: "Psychiatry",
      availability: "Evening",
      mode: "Online",
      gender: "Female",
      cost: "Medium",
      weekendAvailable: false,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Dr. Priyan Kapoor",
      specialization: "Family Therapy",
      availability: "Evening",
      mode: "In-person",
      gender: "Male",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 4.0,
    },
    {
      id: 4,
      name: "Dr. kalyan kalwa",
      specialization: "Addiction Counseling",
      availability: "Morning",
      mode: "In-person",
      gender: "Male",
      cost: "Low",
      weekendAvailable: true,
      rating: 4.0,
    },
    {
      id: 5,
      name: "Dr. Meera Joshi",
      specialization: "Trauma Therapy",
      availability: "Afternoon",
      mode: "In-person",
      gender: "Female",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 5.0,
    },
    {
      id: 6,
      name: "Dr. Nikhi Deshmukh",
      specialization: "Child Psychology",
      availability: "Afternoon",
      mode: "In-person",
      gender: "Female",
      cost: "Medium",
      weekendAvailable: true,
      rating: 4.9,
    },
    {
      id: 7,
      name: "Dr. Kavit Suresh",
      specialization: "Marriage Counseling",
      availability: "Afternoon",
      mode: "Online",
      gender: "Male",
      cost: "Expensive",
      weekendAvailable: false,
      rating: 4.7,
    },
    {
      id: 8,
      name: "Dr. Sanjana Rao",
      specialization: "Clinical Psychology",
      availability: "Evening",
      mode: "Online",
      gender: "Female",
      cost: "Medium",
      weekendAvailable: true,
      rating: 4.8,
    },
    {
      id: 9,
      name: "Dr. Leena Fernandez",
      specialization: "Behavioral Therapy",
      availability: "Evening",
      mode: "Online",
      gender: "Female",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 4.4,
    },
    {
      id: 10,
      name: "Dr. Arjun Malhotra",
      specialization: "Depression & Anxiety",
      availability: "Afternoon",
      mode: "In-person",
      gender: "Female",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 4.4,
    },
    {
      id: 11,
      name: "Dr. Sneha Pillai",
      specialization: "Mindfulness Therapy",
      availability: "Morning",
      mode: "In-person",
      gender: "Female",
      cost: "Medium",
      weekendAvailable: true,
      rating: 4.3,
    },
    {
      id: 12,
      name: "Dr. Varun Gupta",
      specialization: "Bipolar Disorder",
      availability: "Morning",
      mode: "Online",
      gender: "Female",
      cost: "Expensive",
      weekendAvailable: false,
      rating: 4.2,
    },
    {
      id: 13,
      name: "Dr. Anit Singh",
      specialization: "PTSD Counseling",
      availability: "Evening",
      mode: "In-person",
      gender: "Male",
      cost: "Low",
      weekendAvailable: false,
      rating: 4.2,
    },
    {
      id: 14,
      name: "Dr. Mohan Reddy",
      specialization: "Substance Abuse",
      availability: "Evening",
      mode: "In-person",
      gender: "Male",
      cost: "Low",
      weekendAvailable: true,
      rating: 4.6,
    },
    {
      id: 15,
      name: "Dr. Pooja Verma",
      specialization: "Adolescent Therapy",
      availability: "Afternoon",
      mode: "Online",
      gender: "Female",
      cost: "Medium",
      weekendAvailable: false,
      rating: 5.0,
    },
    {
      id: 16,
      name: "Dr. Rakesh Nair",
      specialization: "Geriatric Counseling",
      availability: "Morning",
      mode: "Online",
      gender: "Male",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 4.0,
    },
    {
      id: 17,
      name: "Dr. Nisha Jain",
      specialization: "Behavioral Medicine",
      availability: "Afternoon",
      mode: "Online",
      gender: "Female",
      cost: "Low",
      weekendAvailable: true,
      rating: 4.1,
    },
    {
      id: 18,
      name: "Dr. Rajesh Patel",
      specialization: "Stress Management",
      availability: "Evening",
      mode: "Online",
      gender: "Male",
      cost: "Medium",
      weekendAvailable: true,
      rating: 4.1,
    },
    {
      id: 19,
      name: "Dr. Shalini Narang",
      specialization: "Trauma & Resilience Therapy",
      availability: "Afternoon",
      mode: "Online",
      gender: "Female",
      cost: "Expensive",
      weekendAvailable: true,
      rating: 4.2,
    },
    {
      id: 20,
      name: "Dr. Manish Tiwari",
      specialization: "Personality Disorders",
      availability: "Evening",
      mode: "In-person",
      gender: "Male",
      cost: "Low",
      weekendAvailable: false,
      rating: 4.2,
    },
  ];

  res.json({ planSteps, professionals });
};

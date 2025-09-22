import { Question } from "../types/chat";

export const hazelTriageQuestions: Question[] = [
  {
    id: "who",
    question: "Who needs help today?",
    type: "buttons",
    multiSelect: false,
    options: ["My child", "Me", "Our family"]
  },
  {
    id: "what",
    question: "What’s happening? Pick all that fit.",
    type: "chips",
    multiSelect: true,
    options: ["Sibling conflict", "Screen-time battles", "Trouble at school"]
  },
  {
    id: "intensity",
    question: "How intense does it feel right now?",
    type: "scale",
    multiSelect: false,
    options: ["Calm", "Concerned", "Stressed", "Overwhelming"]
  },
  {
    id: "when",
    question: "When can you talk to someone?",
    type: "chips",
    multiSelect: true,
    options: ["Mornings", "Afternoons", "Evenings", "Weekends"]
  },
  {
    id: "location",
    question: "What’s your PIN/ZIP so I can search nearby licensed options?",
    type: "text",
    multiSelect: false,
    placeholder: "Enter ZIP code"
  },
  {
    id: "preferences",
    question: "Any preferences?",
    type: "chips",
    multiSelect: true,
    options: ["Female counselor", "Low cost", "In-person"]
  }
];

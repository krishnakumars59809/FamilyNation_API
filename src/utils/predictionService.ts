// server/services/predictionService.ts

export interface PredictionResult {
  stabilityScore: number;
  riskLevel: "low" | "medium" | "high";
  recommendedActions: string[];
  confidence: number;
}

export const analyzeResponses = (responses: any[]): PredictionResult => {
  // Simple scoring logic - you can make this more sophisticated
  let score = 50; // Base score
  
  // Analyze intensity level
  const intensity = responses[2]; // "Calm", "Concerned", "Stressed", "Overwhelming"
  if (intensity === "Overwhelming") score -= 30;
  else if (intensity === "Stressed") score -= 15;
  else if (intensity === "Concerned") score -= 5;
  
  // Analyze number of issues selected
  const issues = responses[1] || []; // Array of selected issues
  score -= issues.length * 5;
  
  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (score < 40) riskLevel = "high";
  else if (score < 70) riskLevel = "medium";
  
  return {
    stabilityScore: score,
    riskLevel,
    recommendedActions: generateRecommendedActions(responses),
    confidence: 85 // Could be dynamic based on response completeness
  };
};

const generateRecommendedActions = (responses: any[]): string[] => {
  const actions = ["Family communication strategies"];
  const issues = responses[1] || [];
  
  if (issues.includes("Sibling conflict")) {
    actions.push("Sibling mediation techniques");
  }
  if (issues.includes("Screen-time battles")) {
    actions.push("Digital wellness plan");
  }
  if (issues.includes("Trouble at school")) {
    actions.push("School advocacy support");
  }
  
  return actions;
};
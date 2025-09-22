export interface Question {
  id: string;
  question: string;
  type: "buttons" | "chips" | "scale" | "text";
  multiSelect: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Session {
  index: number;
  responses: string[];
}

export interface FamilyMember {
  _id?: string; // MongoDB ID
  name: string;
  relation: "wife" | "husband" | "son" | "daughter" | "other" | any;
  age?: number; // ISO date string
  email?: string;
  phone?: string;
  needs?: string[]; // e.g. ["learning-impairment"]
  isPrimaryContact?: boolean;
}

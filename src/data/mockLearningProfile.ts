import type { LearningProfile } from "@/types";

export const mockLearningProfile: LearningProfile = {
  studentId: "stu-1",
  style: "visual",
  confidence: 82,
  peakHours: "6:00 PM – 8:00 PM",
  preferredFormats: ["Visual summaries", "Diagrams", "Flashcards"],
  strengths: ["Algebra", "Visual reasoning", "Chemistry concepts", "Problem solving"],
  weaknesses: ["Geometry", "Physics formulas", "Time management"],
};

export const productivityByHour = [
  { hour: "8 AM", focus: 42 },
  { hour: "10 AM", focus: 55 },
  { hour: "12 PM", focus: 48 },
  { hour: "2 PM", focus: 51 },
  { hour: "4 PM", focus: 66 },
  { hour: "6 PM", focus: 92 },
  { hour: "8 PM", focus: 88 },
  { hour: "10 PM", focus: 54 },
];

export const profileEvolution = [
  { month: "Apr", confidence: 54 },
  { month: "May", confidence: 61 },
  { month: "Jun", confidence: 66 },
  { month: "Jul", confidence: 72 },
  { month: "Aug", confidence: 77 },
  { month: "Sep", confidence: 82 },
];

export const weeklyActivity = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.2 },
  { day: "Wed", hours: 1.1 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 1.8 },
  { day: "Sat", hours: 3.2 },
  { day: "Sun", hours: 2.4 },
];

export const monthlyActivity = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  hours: Number((1 + Math.sin(i / 2.4) + (i % 5) * 0.2).toFixed(1)),
}));

export const quarterActivity = [
  { day: "Jul W1", hours: 9.4 },
  { day: "Jul W3", hours: 11.2 },
  { day: "Aug W1", hours: 12.6 },
  { day: "Aug W3", hours: 10.8 },
  { day: "Sep W1", hours: 14.1 },
  { day: "Sep W3", hours: 15.3 },
];

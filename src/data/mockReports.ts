import type { SubjectProgress } from "@/types";

export const subjectProgress: SubjectProgress[] = [
  { subject: "Mathematics", progress: 88, score: 90, completion: "9 / 10 assignments", trend: "up" },
  { subject: "Physics", progress: 79, score: 74, completion: "7 / 10 assignments", trend: "down" },
  { subject: "Chemistry", progress: 91, score: 93, completion: "10 / 10 assignments", trend: "up" },
  { subject: "English", progress: 76, score: 80, completion: "8 / 10 assignments", trend: "flat" },
];

export const monthlyReport = {
  month: "September",
  summary: "You're making strong progress this month.",
  metrics: [
    { label: "Study sessions", value: "24" },
    { label: "Study time", value: "18h 32m" },
    { label: "Assignment completion", value: "87%" },
    { label: "Average quiz score", value: "82%" },
  ],
  wentWell: [
    "Visual summaries increased quiz performance.",
    "You kept a 12-day learning streak.",
    "Chemistry results improved by 9%.",
  ],
  improve: [
    "Physics consistency dropped during the second week.",
    "Geometry accuracy is below your subject average.",
  ],
  nextSteps: [
    "Increase physics practice by two sessions next week.",
    "Review geometry using diagram-led summaries.",
  ],
  performance: [
    { week: "Week 1", score: 78 },
    { week: "Week 2", score: 69 },
    { week: "Week 3", score: 85 },
    { week: "Week 4", score: 88 },
  ],
};

export const careerPaths = [
  {
    title: "Software Engineering",
    match: 91,
    strengths: ["Problem solving", "Algebra", "Logical reasoning"],
    description: "Your pattern-recognition and consistent problem-solving suit building software systems.",
  },
  {
    title: "Data Science",
    match: 87,
    strengths: ["Statistics", "Visual reasoning", "Curiosity"],
    description: "You interpret visual information quickly, which maps well to analysing and presenting data.",
  },
  {
    title: "Architecture",
    match: 79,
    strengths: ["Spatial reasoning", "Diagrams", "Creativity"],
    description: "Strong diagram comprehension and spatial thinking point toward design-led disciplines.",
  },
];

export const studyPlan = [
  { time: "6:00 PM", title: "Mathematics — Visual lesson", duration: "30 min", kind: "study" },
  { time: "6:30 PM", title: "Break", duration: "15 min", kind: "break" },
  { time: "6:45 PM", title: "Physics — Flashcards", duration: "30 min", kind: "study" },
  { time: "7:15 PM", title: "AI Tutor session", duration: "20 min", kind: "tutor" },
] as const;

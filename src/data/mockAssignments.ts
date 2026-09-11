import type { Assignment } from "@/types";

export const mockAssignments: Assignment[] = [
  {
    id: "asg-1",
    title: "Mathematics Practice",
    subject: "Mathematics",
    description:
      "Work through the quadratic equations problem set. Use the visual summary first, then attempt questions 1–12.",
    dueDate: "Tomorrow",
    progress: 70,
    status: "in_progress",
    studentId: "stu-1",
  },
  {
    id: "asg-2",
    title: "Physics Quiz",
    subject: "Physics",
    description:
      "A short quiz covering Newton's three laws of motion and everyday examples of each.",
    dueDate: "Friday",
    progress: 0,
    status: "not_started",
    studentId: "stu-1",
  },
  {
    id: "asg-3",
    title: "Chemistry Review",
    subject: "Chemistry",
    description: "Review chemical bonding using the flashcard deck, then submit your summary notes.",
    dueDate: "Monday",
    progress: 100,
    status: "completed",
    studentId: "stu-1",
  },
  {
    id: "asg-4",
    title: "English Essay",
    subject: "English",
    description: "Write a 600-word analytical essay on theme and character in the set text.",
    dueDate: "Next Wednesday",
    progress: 25,
    status: "in_progress",
    studentId: "stu-1",
  },
  {
    id: "asg-5",
    title: "Physics Lab Report",
    subject: "Physics",
    description: "Submit the write-up for the pendulum experiment, including your results table.",
    dueDate: "Thursday",
    progress: 40,
    status: "in_progress",
    studentId: "stu-2",
  },
];

export type UserRole = "student" | "admin" | "parent";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
};

export type LearningStyle = "visual" | "audio";

export type Student = {
  id: string;
  name: string;
  /** The unique identity used for sign-in and teacher progress lookup. */
  email: string;
  /** The teacher who owns this learner's class workspace. */
  teacherId: string;
  academicLevel: string;
  learningStyle: LearningStyle;
  confidence: number;
  peakHours: string;
  overallProgress: number;
  averageScore: number;
  studyTime: string;
  streak: number;
  engagement: "High" | "Medium" | "Low";
  status: "On track" | "Needs attention";
};

export type AssignmentStatus = "not_started" | "in_progress" | "completed";

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  progress: number;
  status: AssignmentStatus;
  studentId: string;
};

export type MaterialType = "pdf" | "document" | "slides" | "video";

export type CourseMaterial = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: MaterialType;
  uploadedAt: string;
  teacherId: string;
  recipientStudentIds: string[];
  fileName?: string;
  /** A small local file stored as a data URL for this frontend prototype. */
  fileData?: string;
  /** One teacher-approved YouTube lesson matched to this material. */
  recommendedVideo?: {
    title: string;
    url: string;
  };
};

export type LearningProfile = {
  studentId: string;
  style: LearningStyle;
  confidence: number;
  peakHours: string;
  preferredFormats: string[];
  strengths: string[];
  weaknesses: string[];
};

export type ContentFormat =
  | "Visual summary"
  | "Diagram"
  | "Flashcards"
  | "Interactive explanation"
  | "Video lesson"
  | "Audio explanation"
  | "Verbal walkthrough";

export type LearningItem = {
  id: string;
  subject: string;
  title: string;
  format: ContentFormat;
  duration: string;
  progress: number;
  recommended: boolean;
  suitedTo: LearningStyle;
};

export type OnboardingData = {
  name: string;
  academicLevel: string;
  learningPreference: string[];
  productiveTime: string;
};

export type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type StudyPlanItem = {
  time: string;
  title: string;
  duration: string;
  kind: "study" | "break" | "tutor";
};

export type Theme = "light" | "dark";

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  time: string;
};

export type SubjectProgress = {
  subject: string;
  progress: number;
  score: number;
  completion: string;
  trend: "up" | "flat" | "down";
};

# LearnLoop Adaptive

LEARNLOOP — TECHNICAL FRONTEND BUILD PROMPT

0. BUILD OBJECTIVE

Build a polished, responsive, production-quality frontend prototype for:

LearnLoop — AI-Personalized Learning Platform

Tagline:

Learning that adapts to you.

LearnLoop is an adaptive education platform that uses student learning behavior, learning preferences, academic performance, and productivity patterns to personalize content delivery, study plans, progress tracking, and AI tutoring.

The application supports three roles:

Student

Admin / Teacher

Parent

Admin and Parent use the same portal architecture with role-based permissions.

The goal is to create a convincing hackathon-ready working product, not a collection of static screens.

The primary demo flow is:

Login → Student onboarding → Learning profile → Personalized dashboard → Learning activity → Assignment → Progress → AI Tutor → Monthly report

Admin flow:

Login → Dashboard → Add student → Upload course material → Create assignment → Monitor student performance

Parent flow:

Login → Read-only dashboard → View child's progress → View learning profile → View report

1. DESIGN REFERENCE

Use this Dribbble shot as visual inspiration:

https://dribbble.com/shots/27640425-AI-Study-Planner-App-UI-Smart-Learning-Education-Dashboard

Use it ONLY as a reference for:

visual hierarchy

whitespace

card composition

modern EdTech aesthetic

dashboard density

typography scale

chart treatment

navigation structure

overall polish

Do NOT reproduce the design pixel-for-pixel.

Do NOT copy its branding, exact layouts, illustrations, or proprietary visual assets.

Create a distinct LearnLoop visual identity.

2. REQUIRED TECH STACK

If the environment supports React, use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide React

Recharts

Use:

React Router for routing

localStorage for persistence in the prototype

mock data/service layer for backend simulation

Do not introduce unnecessary dependencies.

If the platform has its own preferred stack, preserve its default architecture while following all requirements below.

3. APPLICATION ARCHITECTURE

Use this conceptual structure:

src/
├── components/
│ ├── layout/
│ ├── navigation/
│ ├── dashboard/
│ ├── charts/
│ ├── learning/
│ ├── assignments/
│ ├── tutor/
│ ├── reports/
│ ├── profile/
│ ├── admin/
│ └── shared/
│
├── pages/
│ ├── auth/
│ ├── student/
│ ├── admin/
│ └── parent/
│
├── data/
│ ├── mockStudents.ts
│ ├── mockAssignments.ts
│ ├── mockCourses.ts
│ ├── mockReports.ts
│ └── mockLearningProfile.ts
│
├── services/
│ ├── authService.ts
│ ├── studentService.ts
│ ├── assignmentService.ts
│ ├── learningService.ts
│ └── tutorService.ts
│
├── hooks/
├── types/
├── utils/
└── App.tsx

Keep components reusable.

Do not duplicate entire page structures unnecessarily.

4. ROUTING

Implement the following routes.

Public

/

Landing / redirect screen

/login

Login

Student

/student

Student dashboard

/student/onboarding

Onboarding flow

/student/learning

My Learning

/student/assignments

Assignments

/student/study-plan

Study Plan

/student/tutor

AI Tutor

/student/progress

Progress

/student/profile

Learning Profile

/student/insights

Strengths & Weaknesses

/student/career

Career Paths

/student/reports

Reports

/student/settings

Settings

Admin

/admin

Admin dashboard

/admin/students

Students

/admin/assignments

Assignment management

/admin/materials

Course materials

/admin/reports

Reports

/admin/career

Career insights

/admin/settings

Settings

Parent

/parent

Parent dashboard

/parent/profile

Child learning profile

/parent/progress

Child progress

/parent/reports

Monthly reports

5. ROLE-BASED ACCESS

Create a lightweight mock authentication system.

Login form should contain:

Email

Password

Role

Role options:

Student

Admin

Parent

On successful login:

Student → /student

Admin → /admin

Parent → /parent

Store the current session in localStorage.

Example:

type UserRole = "student" | "admin" | "parent";


Create a protected-route mechanism.

If a user attempts to access a route outside their role:

redirect them to their appropriate dashboard.

6. DESIGN SYSTEM

Create centralized CSS variables/design tokens.

Example:

:root {
  --background: #f7f8fa;
  --surface: #ffffff;
  --foreground: #15171a;
  --muted: #6b7280;
  --subtle: #9ca3af;
  --border: #e8eaed;

  --primary: #635bff;
  --primary-soft: #efedff;

  --success: #22a06b;
  --warning: #d99000;
  --danger: #d64545;
  --info: #4387f5;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}


Use these consistently.

Do not scatter arbitrary colors throughout components.

7. TYPOGRAPHY

Use:

Inter

Fallback:

system-ui, sans-serif

Typography:

Page title: 28–32px / 600

Section title: 18–20px / 600

Card title: 15–17px / 600

Body: 14–15px / 400

Metadata: 12–13px / 400

KPI: 26–32px / 600

Use restrained font weights.

Avoid huge headings inside dashboard interfaces.

8. GLOBAL LAYOUT

Desktop layout:

┌─────────────────────────────────────────────┐
│ Sidebar │ Header                            │
│         ├───────────────────────────────────┤
│         │                                   │
│         │ Main Content                      │
│         │                                   │
│         │                                   │
└─────────────────────────────────────────────┘


Sidebar:

Width approximately:

240px

Main content:

Flexible.

Maximum content width:

approximately 1400px.

Desktop page padding:

24–32px.

Mobile:

Sidebar becomes a drawer or bottom navigation.

9. GLOBAL SIDEBAR

Create a reusable <AppSidebar />.

Logo:

LearnLoop

Use a minimal loop-inspired icon.

Navigation should change according to role.

Student

Overview

My Learning

Assignments

Study Plan

AI Tutor

Progress

Learning Profile

Insights

Career Paths

Reports

Settings

Admin

Overview

Students

Assignments

Course Materials

Reports

Career Insights

Settings

Parent

Overview

Progress

Learning Profile

Reports

Settings

Active route:

soft primary background

primary icon

primary text

Do not use heavy outlines.

Bottom of sidebar:

User profile.

10. TOP HEADER

Create reusable <AppHeader />.

Include:

page title where appropriate

notification button

avatar

profile dropdown

Student example:

Good morning, Alex

Admin example:

Good morning, Sarah

Parent example:

Alex's learning overview

Header should remain clean.

11. STUDENT DASHBOARD

Route:

/student

Create the primary product showcase page.

Header

Good morning, Alex
Here's your personalized learning overview for today.


Actions:

Notification

Profile

Daily Plan Hero

Component:

<DailyLearningCard />

Content:

Your learning plan is ready

"You have 3 focused sessions planned for today."

Display:

72%

Today's progress

1h 45m studied

Next:

Mathematics — Quadratic Equations

CTA:

Continue learning

12. STUDENT KPI CARDS

Create:

<StatsGrid />

Four cards.

Weekly Progress

78%

+12% vs last week

Study Time

6h 42m

+48m this week

Assignments

8 / 10

2 remaining

Learning Streak

12 days

Keep going

Use icons from Lucide.

13. ACTIVITY CHART

Component:

<LearningActivityChart />

Title:

Learning activity

Description:

Your study consistency over the last 7 days

Use Recharts.

Data:

[
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.2 },
  { day: "Wed", hours: 1.1 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 1.8 },
  { day: "Sat", hours: 3.2 },
  { day: "Sun", hours: 2.4 }
]


Controls:

7 days

30 days

3 months

Use subtle grid lines.

No unnecessary chart decoration.

14. LEARNING PROFILE CARD

Component:

<LearningProfileCard />

Title:

Your learning profile

Description:

"LearnLoop adapts your content based on how you learn best."

Show:

Visual learner

82% confidence

Peak study time:

6:00 PM – 8:00 PM

Preferred formats:

Visual summaries

Diagrams

Flashcards

CTA:

View learning profile

Use a circular progress indicator for confidence.

15. RECOMMENDED CONTENT

Component:

<RecommendationList />

Title:

Recommended for you

Description:

Content selected based on your learning profile

Cards:

Mathematics

Quadratic Equations

Visual summary

15 min

Progress:

60%

CTA:

Start

Physics

Newton's Laws

Interactive explanation

20 min

CTA:

Continue

Chemistry

Chemical Bonding

Flashcards

10 min

CTA:

Review

Cards should have clear visual hierarchy.

16. UPCOMING ASSIGNMENTS

Component:

<AssignmentTable />

Title:

Upcoming assignments

Columns:

Assignment

Subject

Due date

Progress

Status

Action

Mock data:

[
  {
    title: "Mathematics Practice",
    subject: "Mathematics",
    due: "Tomorrow",
    progress: 70,
    status: "In Progress"
  },
  {
    title: "Physics Quiz",
    subject: "Physics",
    due: "Friday",
    progress: 0,
    status: "Not Started"
  },
  {
    title: "Chemistry Review",
    subject: "Chemistry",
    due: "Monday",
    progress: 100,
    status: "Completed"
  }
]


On mobile:

Convert rows to cards.

17. STUDENT LEARNING PAGE

Route:

/student/learning

Create a personalized course/content library.

Top filters:

All

Mathematics

Physics

Chemistry

English

Secondary filter:

Recommended

In progress

Completed

Each learning item shows:

subject

title

format

duration

progress

recommended badge where applicable

18. STUDY PLAN

Route:

/student/study-plan

Create a weekly planner.

Days:

Mon Tue Wed Thu Fri Sat Sun

Timeline:

6:00 PM

Mathematics — Visual lesson

30 min

6:30 PM

Break

15 min

6:45 PM

Physics — Flashcards

30 min

7:15 PM

AI Tutor session

20 min

Highlight the student's peak productivity window.

Include:

Adjust plan

button.

19. ASSIGNMENTS PAGE

Route:

/student/assignments

Include:

filters

status tabs

search

assignment cards/table

Tabs:

All

To do

In progress

Completed

Clicking an assignment opens a detail panel/modal.

Detail should contain:

title

subject

instructions

due date

progress

CTA

Example:

Start assignment

When completed:

Update progress in local state and localStorage.

20. LEARNING PROFILE PAGE

Route:

/student/profile

This page is one of the key product differentiators.

Header:

Your learning profile

"LearnLoop continuously learns how you learn best."

Summary:

Visual learner

82% confidence

Peak productivity:

6:00 PM – 8:00 PM

Academic level:

Grade 11

Create:

Learning Style

Visual — 82%

Audio — 18%

Preferred Formats

Visual summaries

Diagrams

Flashcards

Productivity Pattern

Hourly chart.

Highlight:

6 PM – 8 PM

Behavioral Insight

Example:

"You perform 18% better on assessments after using visual summaries."

Profile Evolution

Show learning-style confidence over time.

21. PROGRESS PAGE

Route:

/student/progress

Hero metric:

84% overall progress

Subject cards:

Mathematics — 88%

Physics — 79%

Chemistry — 91%

English — 76%

Each card:

progress

score

assignment completion

trend

Use:

↑ Improving

→ Stable

↓ Needs attention

22. INSIGHTS PAGE

Route:

/student/insights

Two primary cards:

Strengths

Algebra

Visual reasoning

Chemistry concepts

Problem solving

Focus areas

Geometry

Physics formulas

Time management

Below:

Recommended focus

"Spend your next two study sessions reviewing geometry using visual examples."

CTA:

Build study plan

23. AI TUTOR

Route:

/student/tutor

Create a premium conversational interface.

Layout:

Desktop:

Conversation left.

Context sidebar right.

Mobile:

Context panel becomes collapsible.

Header:

AI Tutor

"Ask anything about what you're learning."

Conversation:

Student:

"Can you explain quadratic equations in a simpler way?"

AI:

"Absolutely. Think of a quadratic equation as a curved path rather than a straight line..."

Context panel:

Current context

Mathematics

Quadratic Equations

Learning preference

Visual explanations

Suggested actions

Explain visually

Give an example

Create flashcards

Quiz me

Input:

Ask your AI tutor anything...

Buttons:

Attachment

Microphone

Send

Implement a simulated AI response system.

Do NOT hard-code only one response.

Create a simple tutor service that analyzes keywords and returns contextual mock responses.

For example:

generateTutorResponse(message, context)


If an LLM API is available, structure the service so it can later be replaced with a real API.

24. AI TUTOR UX

Include:

user message bubbles

AI message bubbles

typing indicator

timestamps

suggested prompts

auto-scroll

loading state

empty state

Add a small indicator:

Personalized for Alex

Do not make the interface visually identical to ChatGPT.

LearnLoop should own the experience.

25. MONTHLY REPORT

Route:

/student/reports

Header:

September learning report

Summary:

You're making strong progress this month.

Metrics:

24 study sessions

18h 32m study time

87% assignment completion

82% average quiz score

Sections:

What went well

Visual summaries increased quiz performance.

Areas to improve

Physics consistency dropped during the second week.

Recommended next steps

Increase physics practice by two sessions next week.

Add a performance chart.

CTA:

Download report

For the prototype, this can generate a printable report view or simulated download.

26. CAREER PATHS

Route:

/student/career

Heading:

Explore your potential

Description:

"Career directions based on your strengths, interests, and learning patterns."

Cards:

Software Engineering

91% match

Data Science

87% match

Architecture

79% match

Each card:

match score

supporting strengths

short explanation

explore button

Add label:

AI-generated suggestion

Do not present recommendations as guaranteed career outcomes.

27. ADMIN DASHBOARD

Route:

/admin

Create an admin-specific dashboard using the same design system.

Header:

Good morning, Sarah

"Here's how your students are progressing."

KPIs:

Total students

Average progress

Assignment completion

Students needing attention

Create:

Student performance table

Columns:

Student

Progress

Average score

Engagement

Learning style

Status

Example:

Alex Morgan

84%

91%

High

Visual

On track

Emma Davis

72%

78%

Medium

Audio

Needs attention

28. ADMIN STUDENTS PAGE

Route:

/admin/students

Features:

student list

search

filter

add student

student detail

Primary CTA:

Add student

Modal:

Student name

Student ID

Academic level

Button:

Add student

When submitted:

add student to mock state

persist to localStorage

update dashboard student count

29. ADMIN ASSIGNMENTS

Route:

/admin/assignments

Features:

create

edit

delete

assign

deadline

Primary CTA:

Create assignment

Modal fields:

Title

Subject

Description

Student / Group

Due date

Create button

Persist changes locally.

30. ADMIN COURSE MATERIALS

Route:

/admin/materials

Heading:

Course materials

CTA:

Upload material

Allow simulated upload.

Supported:

PDF

Documents

Slides

Video links

Material record:

{
  title: string;
  subject: string;
  topic: string;
  type: "pdf" | "document" | "slides" | "video";
  uploadedAt: string;
}


Display:

Title

Subject

Topic

Type

Uploaded date

Actions

The UI should communicate:

These materials help LearnLoop personalize student learning.

31. ADMIN REPORTS

Route:

/admin/reports

Display student report cards.

Each:

Student

Progress

Strengths

Focus areas

Engagement

Recommended intervention

CTA:

View report

32. PARENT DASHBOARD

Route:

/parent

Parent sees the same visual system but has restricted permissions.

Heading:

Alex's learning overview

Display:

Overall progress

Assignments

Learning profile

Strengths

Focus areas

Monthly report

Parent cannot:

upload materials

create assignments

edit assignments

delete content

Do NOT build a separate portal architecture.

Use role-aware components.

Example:

{user.role === "admin" && (
  <Button>Upload material</Button>
)}


For selected actions, you may instead show a disabled button with tooltip:

Available to teachers only

This demonstrates role-based permissions clearly during the hackathon demo.

33. PARENT PROFILE

Route:

/parent/profile

Read-only version of the student learning profile.

Display:

Learning style

Confidence

Peak study time

Preferred formats

Behavioral insights

No edit controls.

34. PARENT REPORT

Route:

/parent/reports

Use simplified language.

Example:

Alex made strong progress this month.

Study time:

18h 32m

Assignment completion:

87%

Average quiz score:

82%

Strength:

Chemistry

Focus:

Physics consistency

Recommended support:

Encourage two additional physics practice sessions next week.

35. ONBOARDING

Route:

/student/onboarding

Create a three-step wizard.

State:

type OnboardingData = {
  name: string;
  academicLevel: string;
  learningPreference: string[];
  productiveTime: string;
}


Step 1

Tell us about yourself

Name

Academic level

Continue

Step 2

How do you like to learn?

Options:

Watching diagrams

Reading explanations

Listening to explanations

Practicing questions

Allow multiple selections.

Step 3

When do you learn best?

Morning

Afternoon

Evening

Night

Completion

Display:

Your learning profile is ready

Visual learner

82% confidence

Peak time:

6 PM – 8 PM

Button:

Start learning

Persist onboarding results.

36. LEARNING STYLE CLASSIFICATION

For the MVP, DO NOT build a machine-learning model.

Use a transparent rule-based heuristic.

Example:

function calculateLearningProfile(preferences) {
  const visualSignals = [
    "Watching diagrams",
    "Reading explanations",
    "Practicing questions"
  ];

  const audioSignals = [
    "Listening to explanations"
  ];

  // calculate simple confidence score
}


Return:

{
  style: "visual",
  confidence: 82,
  peakHours: "6:00 PM – 8:00 PM"
}


The PRD explicitly allows a rule-based/lightweight approach for the hackathon MVP.

37. ADAPTIVE CONTENT DEMO

Implement one obvious personalization loop.

If:

learningStyle === "visual"


show:

visual summary

diagram

flashcards

If:

learningStyle === "audio"


show:

recommended video

audio explanation

verbal walkthrough

Create a visible UI indicator:

Personalized for your learning style

This should be one of the strongest demo moments.

38. MOCK DATA MODEL

Create TypeScript types.

type Student = {
  id: string;
  name: string;
  academicLevel: string;
  learningStyle: "visual" | "audio";
  confidence: number;
  peakHours: string;
  overallProgress: number;
  averageScore: number;
  studyTime: string;
  streak: number;
};


type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  studentId: string;
};


type CourseMaterial = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: "pdf" | "document" | "slides" | "video";
};


type LearningProfile = {
  studentId: string;
  style: "visual" | "audio";
  confidence: number;
  peakHours: string;
  preferredFormats: string[];
  strengths: string[];
  weaknesses: string[];
};


39. STATE MANAGEMENT

For this prototype:

Use React state + localStorage.

Persist:

authenticated user

onboarding completion

learning profile

assignments

students

uploaded materials

tutor conversation

Create reusable hooks where useful.

Examples:

useAuth()
useStudent()
useAssignments()
useLearningProfile()
useTutor()


Do not add Redux unless genuinely necessary.

40. COMPONENT REQUIREMENTS

Build reusable components:

AppShell
AppSidebar
AppHeader
MobileNavigation

StatCard
ProgressBar
CircularProgress
StatusBadge
Avatar

LearningProfileCard
RecommendationCard
AssignmentCard
AssignmentTable
StudentTable
MaterialCard

LearningActivityChart
PerformanceChart
ProductivityChart

OnboardingWizard
LearningStyleSelector
TimePreferenceSelector

TutorChat
TutorMessage
TutorContextPanel
SuggestedPrompt

ReportSummary
ReportMetric
ReportSection

Modal
Dropdown
Tabs
Toast
EmptyState
LoadingState


41. INTERACTIONS

The following MUST work:

Navigation

Sidebar navigation changes routes.

Login

Role determines destination.

Onboarding

Steps advance.

Back button works.

Completion persists.

Assignments

Status changes.

Progress can update.

Admin

Add student works.

Create assignment works.

Delete assignment works.

Materials

Upload modal works.

Material appears in list.

AI Tutor

Message sends.

Typing indicator appears.

Mock response appears.

Notifications

Notification panel opens.

Profile

Dropdown opens.

Mobile

Navigation opens/closes.

42. LOADING STATES

Implement realistic loading states.

Examples:

Dashboard:

Skeleton cards.

AI Tutor:

Typing indicator.

Reports:

Skeleton chart.

Do not leave blank screens during transitions.

43. EMPTY STATES

Every list should have an empty state.

Example:

No assignments yet

"You're all caught up."

CTA where appropriate.

Admin:

No students yet

"Add your first student to start tracking progress."

Materials:

No course materials

"Upload a resource to start personalizing learning."

44. ERROR STATES

Create friendly error messages.

Examples:

Something went wrong

"Please try again."

Use toast notifications for temporary errors.

45. RESPONSIVE BREAKPOINTS

Use approximately:

Mobile:

< 640px

Tablet:

640–1024px

Desktop:

1024px

At mobile:

one-column layout

stacked KPI cards

horizontal scrolling tabs where appropriate

tables converted to cards

sidebar hidden

mobile navigation available

At tablet:

two-column grid

At desktop:

3–4 column dashboard layouts where appropriate

46. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

accessible labels

focus states

aria-labels where needed

sufficient contrast

proper button semantics

Do not rely solely on color.

47. PERFORMANCE

Avoid unnecessary re-renders.

Use:

reusable components

local mock data

lazy loading for large pages if appropriate

Images should be optimized.

Do not add large image assets unnecessarily.

48. ANIMATION

Use subtle transitions only.

Recommended:

150–250ms.

Animate:

sidebar

modal

dropdown

progress

page transitions

onboarding steps

AI typing indicator

Avoid:

excessive bouncing

dramatic parallax

large entrance animations

distracting effects

49. ICONOGRAPHY

Use Lucide.

Examples:

Home

BookOpen

ClipboardList

Brain

Sparkles

BarChart3

Clock

Calendar

FileText

Users

Upload

MessageCircle

Bell

Settings

TrendingUp

Do not mix icon libraries.

Do not use emojis as interface icons.

50. MICROCOPY

Use concise human language.

Good:

Continue learning

Start session

View profile

Build study plan

You're making progress

Avoid:

Execute learning workflow

Initiate educational module

The product should sound intelligent and human.

51. NOTIFICATION SYSTEM

Create mock notifications.

Examples:

New assignment

Physics quiz was assigned to you.

Learning insight

You perform better with visual summaries.

Study reminder

Your peak study time starts in 15 minutes.

Unread notifications should have a subtle indicator.

52. DEMO DATA

Use:

Student:

Alex Morgan

Academic level:

Grade 11

Learning style:

Visual

Confidence:

82%

Peak hours:

6:00 PM – 8:00 PM

Weekly progress:

78%

Overall progress:

84%

Study time:

6h 42m

Monthly study time:

18h 32m

Assignments:

8 / 10

Average quiz score:

82%

Streak:

12 days

Subjects:

Mathematics

Physics

Chemistry

English

Admin:

Sarah

Parent:

Alex's parent

53. IMPORTANT DEMO SCENARIO

Make the prototype tell a clear story.

Step 1

User logs in as Student.

Step 2

Student completes onboarding.

Step 3

System generates:

Visual learner

82% confidence

6 PM – 8 PM peak hours

Step 4

Student dashboard changes to emphasize:

Visual summaries

Diagrams

Flashcards

Step 5

Student opens recommended Mathematics content.

Step 6

Student completes an assignment.

Progress updates.

Step 7

Student opens AI Tutor.

Tutor knows:

Current subject:

Mathematics

Topic:

Quadratic Equations

Learning preference:

Visual

Step 8

Student opens monthly report.

Step 9

Logout.

Login as Admin.

Step 10

Admin sees the student's updated progress.

Step 11

Logout.

Login as Parent.

Step 12

Parent sees the same student's progress in read-only mode.

This flow should be smooth enough to demonstrate during a hackathon presentation.

54. SECURITY UX

This is a frontend prototype, so do not claim real security.

However, structure permissions correctly.

Never rely only on hiding buttons.

Use role checks at the component/action level.

Example:

const canEdit = user.role === "admin";


Parent must never be able to trigger admin mutation actions through the UI.

The production architecture should later enforce the same permissions server-side.

55. BACKEND-READY ARCHITECTURE

Although the current prototype can use mock data, structure services so a backend can later replace them.

Example:

studentService.getStudents()
studentService.createStudent()
assignmentService.getAssignments()
assignmentService.createAssignment()
assignmentService.updateAssignment()
materialService.uploadMaterial()
learningService.getProfile()
tutorService.sendMessage()


Do not directly scatter mock data throughout UI components.

56. SUPABASE READINESS

If Supabase is available in the selected builder, structure the application so authentication/database can later be connected.

Potential tables:

users
students
learning_profiles
assignments
course_materials
progress
reports
tutor_messages
notifications


Do not require Supabase to make the initial prototype work unless explicitly configured.

The application must still run with mock data.

57. FILE UPLOAD UX

Admin material upload should support a simulated file-selection experience.

UI:

Drag & drop area

Drop your course material here

or

Browse files

Below:

PDF

DOC

PPT

Video link

After selection:

show:

Filename

File type

Upload progress

Uploaded status

For the prototype, actual storage can be mocked.

58. VISUAL HIERARCHY RULES

Every page should have:

clear page heading

short supporting text

primary action where applicable

primary information

secondary information

whitespace

Do not create walls of cards.

Group related content.

Use larger cards for primary insights and smaller cards for secondary information.

59. CARD RULES

Default:

background: white
border: 1px solid #E8EAED
border-radius: 14–16px
padding: 20–24px


Shadow should be extremely subtle or omitted.

Cards should not all look identical.

Use different sizes to establish hierarchy.

60. FINAL UI QUALITY BAR

The finished application should feel like:

A premium AI-native education SaaS product.

Reference qualities:

Linear-level cleanliness

modern EdTech usability

sophisticated dashboard hierarchy

AI-native interaction

calm visual design

But create an original LearnLoop identity.

The UI must feel:

Minimal + Classy + Intelligent + Human

61. DO NOT DO THESE THINGS

Do NOT:

generate a generic Bootstrap dashboard

use excessive gradients

use excessive purple

use giant hero sections inside dashboards

use cartoon illustrations everywhere

use emoji as icons

use random stock images

use excessive glassmorphism

make every card heavily shadowed

create separate unrelated layouts for each role

hard-code interactions that appear functional but do nothing

create fake buttons without behavior

make Parent a completely separate application

overcomplicate the architecture

add unnecessary libraries

62. ACCEPTANCE CRITERIA

The build is complete only when:

Authentication

[ ] Login works

[ ] Role routing works

[ ] Logout works

Student

[ ] Onboarding works

[ ] Learning profile is generated

[ ] Dashboard displays personalized data

[ ] Recommendations display

[ ] Assignments work

[ ] Study plan works

[ ] Progress works

[ ] AI Tutor works

[ ] Reports work

[ ] Career suggestions display

Admin

[ ] Dashboard works

[ ] Student creation works

[ ] Assignment creation works

[ ] Assignment editing works

[ ] Assignment deletion works

[ ] Material upload UI works

[ ] Student performance updates

Parent

[ ] Dashboard works

[ ] Progress visible

[ ] Learning profile visible

[ ] Reports visible

[ ] Admin-only controls unavailable

UI

[ ] Desktop responsive

[ ] Tablet responsive

[ ] Mobile responsive

[ ] Consistent typography

[ ] Consistent spacing

[ ] Consistent iconography

[ ] Loading states

[ ] Empty states

[ ] Error states

[ ] Accessible controls

63. BUILD ORDER

Do NOT attempt to build every feature simultaneously.

Build in this order:

Phase 1 — Foundation

project setup

typography

color system

routing

global layout

sidebar

header

responsive shell

Phase 2 — Student

dashboard

onboarding

learning profile

assignments

study plan

progress

AI tutor

Phase 3 — Admin

dashboard

students

assignments

course materials

reports

Phase 4 — Parent

dashboard

profile

progress

reports

permissions

Phase 5 — Polish

animations

loading states

empty states

responsive refinement

accessibility

visual consistency

demo flow testing

64. FINAL INSTRUCTION TO THE CODING AGENT

Before writing code:

Understand the entire product architecture.

Establish the design system.

Establish routes.

Establish TypeScript types.

Establish mock data.

Establish reusable components.

Build the global shell.

Build the Student experience first.

Add Admin.

Add Parent.

Connect interactions.

Test the complete demo flow.

Fix responsive issues.

Polish spacing, typography, hierarchy, and states.

Do not stop at static UI.

The final result must feel like a working product prototype.

Prioritize:

Functionality → hierarchy → consistency → polish.

The most important experience is:

Student onboarding → AI-generated learning profile → personalized content → progress tracking → AI Tutor → report.

That adaptive loop is the core product story.

Build the interface around that story.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c5144c18-10c3-42ca-b694-ed685de20c7b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

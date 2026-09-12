import { getState, setState } from "@/lib/store";
import type { LearningStyle, TutorMessage } from "@/types";
import { generateGeminiTutorResponse } from "@/services/geminiTutor.server";

export type TutorContext = {
  subject: string;
  topic: string;
  style: LearningStyle;
  studentName: string;
};

type Rule = { match: RegExp; reply: (ctx: TutorContext) => string };

const rules: Rule[] = [
  {
    match: /quadratic|equation|algebra/i,
    reply: (c) =>
      `Absolutely. Think of a quadratic equation as a curved path rather than a straight line. Sketch y = x² and you get a U-shaped curve; the solutions are simply where that curve crosses the x-axis.\n\nA quick way to picture ax² + bx + c = 0:\n1. a controls how wide or narrow the U is.\n2. b slides the curve sideways.\n3. c lifts or drops it.\n\n${c.style === "visual" ? "Try sketching three curves with different values of a — seeing them side by side usually makes it click." : "Say each step out loud as you work through it — talking it through tends to lock it in for you."}`,
  },
  {
    match: /newton|force|motion|physics/i,
    reply: () =>
      "Newton's laws are three short ideas:\n1. Things keep doing what they're doing unless something pushes them.\n2. A bigger push on the same mass means more acceleration (F = ma).\n3. Every push comes with an equal push back.\n\nPick one object around you and describe all three for it — that's usually enough to make the laws stick.",
  },
  {
    match: /bond|chemistry|molecule/i,
    reply: () =>
      "Chemical bonding is about atoms reaching a stable arrangement of electrons. Ionic bonds transfer electrons, covalent bonds share them, and metallic bonds pool them. If you can say which of the three is happening and why, you can answer most exam questions on this topic.",
  },
  {
    match: /flashcard/i,
    reply: (c) =>
      `Here's a starter deck for ${c.topic}:\n• What shape does a quadratic graph make? → A parabola.\n• What do the roots represent? → Where the curve crosses the x-axis.\n• What does the discriminant tell you? → How many real roots there are.\n\nWant me to expand this to ten cards?`,
  },
  {
    match: /quiz me|test me|question/i,
    reply: (c) =>
      `Let's try one on ${c.topic}:\n\nSolve x² − 5x + 6 = 0.\n\nTake your time — reply with your answer and I'll walk through it with you.`,
  },
  {
    match: /example/i,
    reply: (c) =>
      `Here's a worked example for ${c.topic}:\n\nx² − 5x + 6 = 0\nFactorise: (x − 2)(x − 3) = 0\nSo x = 2 or x = 3.\n\nCheck by substituting each value back in — both give zero.`,
  },
  {
    match: /visual|diagram|draw|picture/i,
    reply: (c) =>
      `Picture it like this for ${c.topic}: draw the axes, mark the roots on the x-axis, then join them with a smooth U through the lowest point. Label the vertex and the two roots and you have the whole idea in one sketch.`,
  },
  {
    match: /study plan|schedule|revise|time/i,
    reply: (c) =>
      `Your strongest focus window is the evening, so I'd put the hardest topic there. A good shape: 30 minutes of ${c.subject}, a 15-minute break, then 30 minutes of recall practice. Short and consistent beats one long session.`,
  },
  {
    match: /stuck|don't understand|confused|help/i,
    reply: (c) =>
      `No problem — let's slow it down. Tell me the last step in ${c.topic} that made sense to you, and we'll pick it up from exactly there.`,
  },
];

function solveQuadratic(message: string) {
  const compact = message.toLowerCase().replace(/\s/g, "").replace(/²/g, "^2");
  const match = compact.match(/([+-]?\d*)x\^2([+-]\d*)x([+-]\d+)=?0?/);
  if (!match) return null;
  const coefficient = (value: string) =>
    value === "" || value === "+" ? 1 : value === "-" ? -1 : Number(value);
  const [a, b, c] = match.slice(1).map(coefficient);
  if (a === undefined || b === undefined || c === undefined) return null;
  if (!Number.isFinite(a) || a === 0 || !Number.isFinite(b) || !Number.isFinite(c)) return null;
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0)
    return `For ${message.trim()}, the discriminant is ${discriminant}, so there are no real solutions. In complex numbers, x = (${-b} ± ${Math.sqrt(-discriminant)}i) / ${2 * a}.`;
  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const display = (value: number) =>
    Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
  return `Let a = ${a}, b = ${b}, and c = ${c}.\n\nUsing x = (−b ± √(b² − 4ac)) / 2a:\nx = (${-b} ± √${discriminant}) / ${2 * a}\n\nSo the solutions are x = ${display(root1)} and x = ${display(root2)}.`;
}

function checkQuizAnswer(message: string) {
  const previous = getState().tutorMessages.at(-1);
  if (!previous || previous.role !== "assistant" || !previous.content.includes("x² − 5x + 6 = 0"))
    return null;
  const answer = message.replace(/\s/g, "").toLowerCase();
  if ((answer.includes("2") && answer.includes("3")) || answer.includes("x=2orx=3")) {
    return "Correct — x = 2 and x = 3. Factoring gives (x − 2)(x − 3) = 0, so either factor can equal zero. Nice work!";
  }
  return "Not quite. Try finding two numbers that multiply to 6 and add to −5. That gives (x − 2)(x − 3) = 0, so the roots are 2 and 3.";
}

export const tutorService = {
  generateTutorResponse(message: string, context: TutorContext): string {
    const quizFeedback = checkQuizAnswer(message);
    if (quizFeedback) return quizFeedback;
    const quadraticSolution = solveQuadratic(message);
    if (quadraticSolution) return quadraticSolution;
    const rule = rules.find((r) => r.match.test(message));
    if (rule) return rule.reply(context);
    return `Good question. Right now you're working on ${context.topic} in ${context.subject}, and you learn best from ${context.style === "visual" ? "visual explanations" : "spoken and audio explanations"}, so let's approach it that way.\n\nTell me which part you'd like to start with — the idea behind it, a worked example, or some practice questions.`;
  },

  async sendMessage(message: string, context: TutorContext): Promise<TutorMessage> {
    const userMsg: TutorMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    setState((s) => ({ tutorMessages: [...s.tutorMessages, userMsg] }));

    let content: string;
    try {
      content = await generateGeminiTutorResponse({
        data: {
          ...context,
          messages: getState()
            .tutorMessages.slice(-12)
            .map(({ role, content }) => ({ role, content })),
        },
      });
    } catch {
      // The local tutor keeps the learning flow available if the provider is temporarily unavailable.
      content = tutorService.generateTutorResponse(message, context);
    }

    const reply: TutorMessage = {
      id: `m-${Date.now() + 1}`,
      role: "assistant",
      content,
      timestamp: Date.now(),
    };
    setState((s) => ({ tutorMessages: [...s.tutorMessages, reply] }));
    return reply;
  },

  getMessages() {
    return getState().tutorMessages;
  },

  clear() {
    setState({ tutorMessages: [] });
  },
};

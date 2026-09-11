import { getState, setState } from "@/lib/store";
import type { LearningStyle, TutorMessage } from "@/types";

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

export const tutorService = {
  generateTutorResponse(message: string, context: TutorContext): string {
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

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));

    const reply: TutorMessage = {
      id: `m-${Date.now() + 1}`,
      role: "assistant",
      content: tutorService.generateTutorResponse(message, context),
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

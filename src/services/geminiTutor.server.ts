import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8_000),
});

const tutorRequestSchema = z.object({
  subject: z.string().min(1).max(120),
  topic: z.string().min(1).max(120),
  style: z.enum(["visual", "audio"]),
  studentName: z.string().min(1).max(120),
  messages: z.array(messageSchema).min(1).max(12),
});

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

export const generateGeminiTutorResponse = createServerFn({ method: "POST" })
  .validator(tutorRequestSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("The Gemini API key is not configured on the server.");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are LearnLoop, an accurate and encouraging tutor for ${data.studentName}. The current course context is ${data.subject}, topic: ${data.topic}. Adapt explanations for a ${data.style} learner. Answer the student's actual question directly, use correct steps for calculations, state uncertainty instead of guessing, and keep responses focused and age-appropriate. Do not invent sources, grades, or completed work.`,
              },
            ],
          },
          contents: data.messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
        }),
      },
    );

    const result = (await response.json()) as GeminiResponse;
    const text = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!response.ok || !text) {
      throw new Error(result.error?.message || "Gemini could not generate a response.");
    }

    return text;
  });

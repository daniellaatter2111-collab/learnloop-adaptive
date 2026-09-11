import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Send, Sparkles } from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTutor } from "@/hooks/useTutor";
import { useLearningProfile } from "@/hooks/useLearningProfile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor — LearnLoop" },
      {
        name: "description",
        content:
          "Ask the LearnLoop AI tutor anything — answers are explained in the format you learn best with.",
      },
      { property: "og:title", content: "AI Tutor — LearnLoop" },
      { property: "og:description", content: "Context-aware tutoring in your preferred format." },
    ],
  }),
  component: TutorPage,
});

const suggestions = [
  "Explain quadratic equations",
  "Quiz me on this topic",
  "Show me a worked example",
  "Make flashcards",
];

function TutorPage() {
  const { profile } = useLearningProfile();
  const { user } = useAuth();
  const { messages, isTyping, error, send, clear } = useTutor({
    subject: "Mathematics",
    topic: "Quadratic Equations",
    style: profile.style,
    studentName: user?.name ?? "there",
  });
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  async function submit(text: string) {
    setValue("");
    await send(text);
  }

  return (
    <div className="flex h-[calc(100vh-190px)] min-h-[520px] flex-col">
      <PageHeader
        title="AI Tutor"
        description="Currently helping with Mathematics · Quadratic Equations"
        action={
          <Button variant="ghost" size="sm" onClick={clear} disabled={messages.length === 0}>
            <RotateCcw className="size-4" aria-hidden /> New chat
          </Button>
        }
      />

      <Card className="flex min-h-0 flex-1 flex-col p-0 sm:p-0">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Sparkles className="size-5" aria-hidden />
              </span>
              <p className="mt-3 text-[15px] font-semibold">Ask me anything</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                I explain things using {profile.style === "visual" ? "diagrams and visual steps" : "spoken-style walkthroughs"} because
                that's how you learn best.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => submit(s)} className="cursor-pointer">
                    <Pill tone="primary">{s}</Pill>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-[14px] px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="rounded-[14px] bg-muted px-4 py-3 text-sm text-muted-foreground">
                Tutor is typing…
              </div>
            </div>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) submit(value);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <label htmlFor="tutor-input" className="sr-only">
            Message the AI tutor
          </label>
          <Input
            id="tutor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about a topic, request a quiz or an example…"
            autoComplete="off"
          />
          <Button type="submit" disabled={!value.trim() || isTyping} aria-label="Send message">
            <Send className="size-4" aria-hidden />
          </Button>
        </form>
      </Card>
    </div>
  );
}

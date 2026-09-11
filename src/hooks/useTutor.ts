import { useCallback, useState } from "react";
import { useAppState } from "@/lib/store";
import { tutorService, type TutorContext } from "@/services/tutorService";

export function useTutor(context: TutorContext) {
  const { tutorMessages } = useAppState();
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (message: string) => {
      const text = message.trim();
      if (!text || isTyping) return;
      setIsTyping(true);
      setError(null);
      try {
        await tutorService.sendMessage(text, context);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsTyping(false);
      }
    },
    [context, isTyping],
  );

  return { messages: tutorMessages, isTyping, error, send, clear: tutorService.clear };
}

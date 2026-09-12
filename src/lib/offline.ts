export type OfflineChange = {
  id: string;
  createdAt: string;
  description: string;
};

const QUEUE_KEY = "learnloop:offline-changes:v1";
const QUEUE_EVENT = "learnloop:offline-queue-change";

export function getOfflineChanges(): OfflineChange[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(QUEUE_KEY);
    return stored ? (JSON.parse(stored) as OfflineChange[]) : [];
  } catch {
    return [];
  }
}

export function queueOfflineChange(description = "Learning progress") {
  if (typeof window === "undefined" || navigator.onLine) return;
  const changes = getOfflineChanges();
  const next = [
    { id: `offline-${Date.now()}`, createdAt: new Date().toISOString(), description },
    ...changes,
  ].slice(0, 100);
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(QUEUE_EVENT));
  } catch {
    // The app state still remains available in memory if device storage is full.
  }
}

export function clearOfflineChanges() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(QUEUE_KEY);
  window.dispatchEvent(new Event(QUEUE_EVENT));
}

export const offlineQueueEvent = QUEUE_EVENT;

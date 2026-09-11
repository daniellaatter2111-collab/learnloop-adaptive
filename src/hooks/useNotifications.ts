import { setState, useAppState } from "@/lib/store";

export function useNotifications() {
  const { notifications } = useAppState();
  return {
    notifications,
    unread: notifications.filter((n) => !n.read).length,
    markAllRead: () =>
      setState((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  };
}

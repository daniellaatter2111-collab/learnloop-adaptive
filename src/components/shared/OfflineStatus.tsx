import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";
import { getOfflineChanges, offlineQueueEvent } from "@/lib/offline";

export function OfflineStatus() {
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setOnline(navigator.onLine);
      setQueued(getOfflineChanges().length);
    };
    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener(offlineQueueEvent, refresh);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener(offlineQueueEvent, refresh);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="border-b border-warning/30 bg-warning-soft px-4 py-2 text-foreground"
      role="status"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 text-sm">
        <CloudOff className="size-4 shrink-0" aria-hidden />
        <span className="font-medium">You’re offline.</span>
        <span className="text-muted-foreground">
          Lessons already opened on this device and your saved progress remain available.
          {queued ? ` ${queued} change${queued === 1 ? " is" : "s are"} saved on this device.` : ""}
        </span>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";

import { api } from "../api";
import type { Reminder, User } from "../types";

export function useReminderNotifications(user: User | null) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supported = "Notification" in window;
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : "denied",
  );

  const refresh = useCallback(async () => {
    if (!user) {
      setReminders([]);
      return;
    }
    setLoading(true);
    try {
      const due = await api.dueReminders(user.id);
      setReminders(due);
      setError("");

      if (supported && Notification.permission === "granted") {
        const pending = due.filter((reminder) => !reminder.notified_at);
        await Promise.allSettled(
          pending.map(async (reminder) => {
            new Notification(`Time to review “${reminder.word}”`, {
              body: reminder.example,
              tag: `wordloom-${reminder.id}`,
            });
            await api.markNotified(reminder.id, user.id);
          }),
        );
        if (pending.length) {
          setReminders((current) =>
            current.map((item) =>
              pending.some((pendingItem) => pendingItem.id === item.id)
                ? { ...item, notified_at: new Date().toISOString() }
                : item,
            ),
          );
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load reminders.");
    } finally {
      setLoading(false);
    }
  }, [supported, user]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const requestPermission = useCallback(async () => {
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") await refresh();
  }, [refresh, supported]);

  return { reminders, loading, error, refresh, supported, permission, requestPermission };
}

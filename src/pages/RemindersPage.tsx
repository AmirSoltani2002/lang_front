import { useState } from "react";

import { api } from "../api";
import type { Reminder, User } from "../types";
import { formatDueDate, stageLabel } from "../utils";

interface RemindersPageProps {
  user: User;
  reminders: Reminder[];
  loading: boolean;
  error: string;
  onRefresh: () => Promise<void>;
}

export function RemindersPage({ user, reminders, loading, error, onRefresh }: RemindersPageProps) {
  const [completing, setCompleting] = useState<number | null>(null);

  const complete = async (reminderId: number) => {
    setCompleting(reminderId);
    try {
      await api.completeReminder(reminderId, user.id);
      await onRefresh();
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="page-wrap">
      <header className="page-header review-header">
        <div>
          <p className="eyebrow">Due reviews</p>
          <h1>{reminders.length ? `${reminders.length} word${reminders.length === 1 ? "" : "s"} waiting.` : "Your memory is clear."}</h1>
          <p>Read the sentence, recall the meaning, then mark the moment complete.</p>
        </div>
        <button className="button secondary" type="button" onClick={() => void onRefresh()} disabled={loading}>
          {loading ? "Checking…" : "Refresh"}
        </button>
      </header>

      {error && <p className="form-error standalone" role="alert">{error}</p>}

      {!loading && reminders.length === 0 ? (
        <section className="surface empty-state">
          <span aria-hidden="true">✓</span>
          <h2>Nothing due right now</h2>
          <p>New reviews appear here at 1 day, 7 days, 1 month, 3 months, 6 months, and 1 year.</p>
        </section>
      ) : (
        <section className="review-list" aria-live="polite">
          {reminders.map((reminder) => (
            <article className="surface review-card" key={reminder.id}>
              <div className="review-meta">
                <span className="language-chip compact">{reminder.language}</span>
                <span>{stageLabel(reminder.stage)} · due {formatDueDate(reminder.due_at)}</span>
              </div>
              <div className="review-body">
                <div>
                  <h2>{reminder.word}</h2>
                  {reminder.meaning && <p className="meaning">{reminder.meaning}</p>}
                </div>
                <blockquote>{reminder.example}</blockquote>
              </div>
              <button
                className="button primary"
                type="button"
                onClick={() => void complete(reminder.id)}
                disabled={completing === reminder.id}
              >
                {completing === reminder.id ? "Saving…" : "I reviewed this"} <span aria-hidden="true">✓</span>
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

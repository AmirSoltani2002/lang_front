import { useEffect, useState } from "react";

import { api } from "../api";
import type { User } from "../types";

interface SignInPageProps {
  onSignIn: (user: User) => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.users()
      .then((items) => {
        setUsers(items);
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Could not load learners."))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedUsername = username.trim();
    if (!cleanedUsername) return;

    setSubmitting(true);
    setError("");
    try {
      const existingUser = users.find((user) => user.username === cleanedUsername);
      const user = existingUser ?? await api.createUser(cleanedUsername);
      onSignIn(user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not continue with that learner.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="signin-page">
      <section className="signin-copy">
        <div className="brand light-brand">
          <span className="brand-mark">W</span>
          <span><strong>Wordloom</strong><small>Words, woven into memory</small></span>
        </div>
        <div className="signin-message">
          <p className="eyebrow">A quieter way to remember</p>
          <h1>Meet every word again, just when memory needs it.</h1>
          <p>Capture vocabulary in context. Wordloom brings it back tomorrow, next week, and across the year.</p>
        </div>
        <div className="orbit" aria-hidden="true">
          <span>bonjour</span><span>ciao</span><span>hallo</span><span>hola</span>
        </div>
      </section>

      <section className="signin-panel">
        <form className="signin-card" onSubmit={submit}>
          <p className="eyebrow">Welcome</p>
          <h2>Who is learning?</h2>
          <p>Enter your name to continue. A new profile is created automatically the first time.</p>

          <label htmlFor="learner">Your name</label>
          <input
            id="learner"
            list="learners"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading || submitting}
            maxLength={64}
            required
            placeholder={loading ? "Loading learners…" : "e.g. Amirabbas"}
            autoComplete="username"
          />
          <datalist id="learners">
            {users.map((user) => <option key={user.id} value={user.username} />)}
          </datalist>

          {error && <p className="form-error" role="alert">{error}</p>}
          {!loading && users.length > 0 && (
            <p className="signin-hint">Existing learners appear as suggestions while you type.</p>
          )}

          <button className="button primary full" type="submit" disabled={!username.trim() || loading || submitting}>
            {submitting ? "Opening profile…" : "Continue learning"} <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}

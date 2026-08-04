import { useEffect, useState } from "react";

import { api } from "../api";
import type { User } from "../types";

interface SignInPageProps {
  onSignIn: (user: User) => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.users()
      .then((items) => {
        setUsers(items);
        setSelectedId(items[0]?.id.toString() ?? "");
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Could not load learners."))
      .finally(() => setLoading(false));
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const user = users.find((item) => item.id === Number(selectedId));
    if (user) onSignIn(user);
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
          <p className="eyebrow">Welcome back</p>
          <h2>Choose your profile</h2>
          <p>No passwords for this first version—just select who is learning.</p>

          <label htmlFor="learner">Learner</label>
          <select
            id="learner"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            disabled={loading}
          >
            {loading && <option>Loading learners…</option>}
            {users.map((user) => <option key={user.id} value={user.id}>{user.username}</option>)}
          </select>

          {error && <p className="form-error" role="alert">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="form-error">No users exist yet. Add one through the backend API.</p>
          )}

          <button className="button primary full" type="submit" disabled={!selectedId || loading}>
            Continue learning <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";

import { api } from "../api";
import type { Language, User } from "../types";

interface NewWordPageProps {
  user: User;
}

export function NewWordPage({ user }: NewWordPageProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageId, setLanguageId] = useState(() => localStorage.getItem("wordloom-language") ?? "");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.languages()
      .then((items) => {
        setLanguages(items);
        setLanguageId((current) => current || items[0]?.id.toString() || "");
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Could not load languages."));
  }, []);

  useEffect(() => {
    if (languageId) localStorage.setItem("wordloom-language", languageId);
  }, [languageId]);

  const selectedLanguage = useMemo(
    () => languages.find((language) => language.id === Number(languageId)),
    [languageId, languages],
  );

  const generate = async () => {
    if (!word.trim() || !languageId) return;
    setGenerating(true);
    setError("");
    try {
      const result = await api.generateExample({
        language_id: Number(languageId),
        word: word.trim(),
        meaning: meaning.trim() || undefined,
      });
      setExample(result.example);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate a sentence.");
    } finally {
      setGenerating(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const created = await api.createWord({
        user_id: user.id,
        language_id: Number(languageId),
        word: word.trim(),
        meaning: meaning.trim() || undefined,
        example: example.trim() || undefined,
      });
      setSuccess(`“${created.word}” is saved. Its first review is tomorrow.`);
      setWord("");
      setMeaning("");
      setExample("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save this word.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap">
      <header className="page-header">
        <p className="eyebrow">New vocabulary</p>
        <h1>Plant a word in memory.</h1>
        <p>Add a useful sentence now; we will bring it back at six carefully spaced moments.</p>
      </header>

      <div className="word-grid">
        <form className="surface word-form" onSubmit={submit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="language">Language</label>
              <select id="language" required value={languageId} onChange={(event) => setLanguageId(event.target.value)}>
                {languages.map((language) => <option key={language.id} value={language.id}>{language.name}</option>)}
              </select>
            </div>
            <div className="language-chip" aria-live="polite">{selectedLanguage?.name ?? "Choose a language"}</div>
          </div>

          <div className="field">
            <label htmlFor="word">Word or phrase</label>
            <input
              id="word"
              required
              maxLength={200}
              value={word}
              onChange={(event) => setWord(event.target.value)}
              placeholder="e.g. pourtant"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="meaning">English meaning <span>optional</span></label>
            <input
              id="meaning"
              maxLength={500}
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
              placeholder="e.g. however / nevertheless"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="example">Example sentence <span>optional</span></label>
              <button className="text-button" type="button" onClick={generate} disabled={!word.trim() || generating}>
                {generating ? "Writing…" : "✦ Write with AI"}
              </button>
            </div>
            <textarea
              id="example"
              rows={4}
              value={example}
              onChange={(event) => setExample(event.target.value)}
              placeholder="Write your own, or leave blank and AI will create one when you save."
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-success" role="status">{success}</p>}

          <button className="button primary" type="submit" disabled={saving || !word.trim() || !languageId}>
            {saving ? "Saving…" : "Save word"} <span aria-hidden="true">→</span>
          </button>
        </form>

        <aside className="surface schedule-card">
          <p className="eyebrow">Your review rhythm</p>
          <h2>Small meetings, long memory.</h2>
          <ol className="timeline">
            {[
              ["Tomorrow", "1 day"],
              ["Next week", "7 days"],
              ["Next month", "1 month"],
              ["A season later", "3 months"],
              ["Half a year", "6 months"],
              ["The anniversary", "1 year"],
            ].map(([title, time], index) => (
              <li key={time}>
                <span>{index + 1}</span>
                <div><strong>{title}</strong><small>{time} after adding</small></div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

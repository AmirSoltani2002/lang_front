import { useEffect, useState } from "react";

import { api } from "../api";
import type { Language, User, WordEntry } from "../types";
import { formatDueDate } from "../utils";

interface WordsPageProps {
  user: User;
}

export function WordsPage({ user }: WordsPageProps) {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [wordItems, languageItems] = await Promise.all([api.words(user.id), api.languages()]);
      setWords(wordItems);
      setLanguages(languageItems);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load your saved words.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [user.id]);

  const languageName = (languageId: number) =>
    languages.find((language) => language.id === languageId)?.name ?? "Language";

  return (
    <div className="page-wrap">
      <header className="page-header review-header">
        <div>
          <p className="eyebrow">Your word collection</p>
          <h1>{words.length ? `${words.length} word${words.length === 1 ? "" : "s"} growing.` : "Your collection is ready."}</h1>
          <p>Every saved word, its meaning, and the sentence that gives it context.</p>
        </div>
        <button className="button secondary" type="button" onClick={() => void load()} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && <p className="form-error standalone" role="alert">{error}</p>}

      {!loading && words.length === 0 ? (
        <section className="surface empty-state">
          <span aria-hidden="true">＋</span>
          <h2>No words yet</h2>
          <p>Add your first word and its example sentence will appear here.</p>
        </section>
      ) : (
        <section className="review-list" aria-live="polite">
          {words.map((word) => (
            <article className="surface review-card" key={word.id}>
              <div className="review-meta">
                <span className="language-chip compact">{languageName(word.language_id)}</span>
                <span>added {formatDueDate(word.created_at)}</span>
              </div>
              <div className="review-body">
                <div>
                  <h2>{word.word}</h2>
                  {word.meaning && <p className="meaning">{word.meaning}</p>}
                </div>
                <blockquote>{word.example}</blockquote>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

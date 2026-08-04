export interface User {
  id: number;
  username: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface WordEntry {
  id: number;
  user_id: number;
  language_id: number;
  word: string;
  meaning: string | null;
  example: string;
  created_at: string;
}

export interface Reminder {
  id: number;
  stage: string;
  due_at: string;
  notified_at: string | null;
  completed_at: string | null;
  word_id: number;
  word: string;
  meaning: string | null;
  example: string;
  language_id: number;
  language: string;
}

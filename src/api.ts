import type { Language, Reminder, User, WordEntry } from "./types";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string };
      message = body.detail ?? message;
    } catch {
      // Keep the status-based message when the server does not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  users: () => request<User[]>("/users"),
  createUser: (username: string) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),
  languages: () => request<Language[]>("/languages"),
  generateExample: (payload: { language_id: number; word: string; meaning?: string }) =>
    request<{ example: string }>("/examples/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createWord: (payload: {
    user_id: number;
    language_id: number;
    word: string;
    meaning?: string;
    example?: string;
  }) =>
    request<WordEntry>("/words", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  words: (userId: number) => request<WordEntry[]>(`/words?user_id=${userId}`),
  dueReminders: (userId: number) => request<Reminder[]>(`/reminders/due?user_id=${userId}`),
  markNotified: (reminderId: number, userId: number) =>
    request<void>(`/reminders/${reminderId}/notified?user_id=${userId}`, { method: "PATCH" }),
  completeReminder: (reminderId: number, userId: number) =>
    request<void>(`/reminders/${reminderId}/complete?user_id=${userId}`, { method: "PATCH" }),
};

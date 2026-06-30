/**
 * API client for the FastAPI backend.
 *
 * The base URL is resolved from an env var so the same code works on web,
 * iOS simulator, Android emulator, and physical devices. Set
 * EXPO_PUBLIC_API_URL in a `.env` file (see .env.example) for device testing.
 */
import { Platform } from "react-native";

import type { QuizQuestion, Sign } from "./types";

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // Android emulators reach the host machine via 10.0.2.2 instead of localhost.
  if (Platform.OS === "android") return "http://10.0.2.2:8000";
  return "http://localhost:8000";
}

export const API_BASE_URL = resolveBaseUrl();

/** Fetch the full sign dictionary. */
export async function fetchSigns(): Promise<Sign[]> {
  const res = await fetch(`${API_BASE_URL}/api/signs`);
  if (!res.ok) throw new Error(`Failed to load signs (${res.status})`);
  return res.json();
}

/** Generate a quiz question for a given sign. */
export async function fetchQuiz(sign: string): Promise<QuizQuestion> {
  const res = await fetch(`${API_BASE_URL}/api/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sign }),
  });
  if (!res.ok) throw new Error(`Failed to generate quiz (${res.status})`);
  return res.json();
}

/**
 * Stream a chat reply from the tutor. Calls `onChunk` for each incremental
 * piece of text. Falls back to a single read on platforms without a streaming
 * fetch body reader (e.g. some native runtimes).
 */
export async function streamChat(
  message: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok || !res.body) {
    // No readable stream available — read the whole body at once.
    const text = await res.text();
    onChunk(text);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

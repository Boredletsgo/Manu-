/** AsyncStorage-backed progress persistence. */
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Progress, QuizScore } from "./types";

const KEY = "asl.progress.v1";

const EMPTY: Progress = { learned: [], quizScores: [] };

export async function getProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Progress;
    return {
      learned: parsed.learned ?? [],
      quizScores: parsed.quizScores ?? [],
    };
  } catch {
    return EMPTY;
  }
}

async function save(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(progress));
}

/** Toggle a sign's learned state and return the updated progress. */
export async function toggleLearned(signName: string): Promise<Progress> {
  const progress = await getProgress();
  const learned = new Set(progress.learned);
  if (learned.has(signName)) {
    learned.delete(signName);
  } else {
    learned.add(signName);
  }
  const next: Progress = { ...progress, learned: [...learned] };
  await save(next);
  return next;
}

/** Record a quiz result and return the updated progress. */
export async function recordQuizScore(score: QuizScore): Promise<Progress> {
  const progress = await getProgress();
  const next: Progress = {
    ...progress,
    quizScores: [...progress.quizScores, score],
  };
  await save(next);
  return next;
}

/** Clear all stored progress. */
export async function resetProgress(): Promise<Progress> {
  await save(EMPTY);
  return EMPTY;
}

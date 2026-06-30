/** Shared types for the ASL learning app. */

export interface Sign {
  name: string;
  category: "alphabet" | "numbers" | "phrases" | string;
  description: string;
  tip: string;
  image: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Progress {
  /** Sign names the learner has marked as learned. */
  learned: string[];
  /** Recorded quiz results. */
  quizScores: QuizScore[];
}

export interface QuizScore {
  sign: string;
  correct: boolean;
  timestamp: number;
}

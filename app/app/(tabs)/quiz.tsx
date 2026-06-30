import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchQuiz, fetchSigns } from "../../lib/api";
import { recordQuizScore } from "../../lib/storage";
import { theme } from "../../lib/theme";
import { useTheme } from "../../lib/ThemeContext";
import type { QuizQuestion, Sign } from "../../lib/types";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function QuizScreen() {
  const { colors: c } = useTheme();
  const [signs, setSigns] = useState<Sign[]>([]);
  const [current, setCurrent] = useState<{ sign: string; quiz: QuizQuestion } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSigns()
      .then(setSigns)
      .catch((e) => setError(String(e.message ?? e)));
  }, []);

  async function loadQuestion() {
    if (signs.length === 0) return;
    setLoading(true);
    setSelected(null);
    setError(null);
    const sign = pickRandom(signs).name;
    try {
      const quiz = await fetchQuiz(sign);
      setCurrent({ sign, quiz });
    } catch (e: any) {
      setError(String(e.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  // Auto-load the first question once signs are available.
  useEffect(() => {
    if (signs.length > 0 && !current && !loading) {
      loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signs]);

  async function onSelect(option: string) {
    if (selected || !current) return;
    setSelected(option);
    await recordQuizScore({
      sign: current.sign,
      correct: option === current.quiz.answer,
      timestamp: Date.now(),
    });
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={[styles.errorTitle, { color: c.danger }]}>Quiz unavailable</Text>
        <Text style={[styles.muted, { color: c.muted }]}>{error}</Text>
        <Text style={[styles.muted, { color: c.muted }]}>
          Make sure the backend and Ollama are running.
        </Text>
        <Pressable style={[styles.primaryBtn, { backgroundColor: c.primary }]} onPress={loadQuestion}>
          <Text style={[styles.primaryBtnText, { color: c.onPrimary }]}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (loading || !current) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.muted, { color: c.muted }]}>Generating a question…</Text>
      </View>
    );
  }

  const { quiz } = current;
  const answered = selected !== null;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.bg }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: c.primaryDark }]}>
        <Text style={[styles.label, { color: c.onPrimary, opacity: 0.8 }]}>Sign: {current.sign}</Text>
        <Text style={[styles.question, { color: c.onPrimary }]}>{quiz.question}</Text>
      </View>

      {quiz.options.map((opt) => {
        const isAnswer = opt === quiz.answer;
        const isPicked = opt === selected;
        const optStyle = [
          styles.option,
          { backgroundColor: c.card, borderColor: c.cardBorder },
          answered && isAnswer && { backgroundColor: c.correctBg, borderColor: c.success },
          answered && isPicked && !isAnswer && { backgroundColor: c.wrongBg, borderColor: c.danger },
        ];
        return (
          <Pressable key={opt} style={optStyle} onPress={() => onSelect(opt)}>
            <Text style={[styles.optionText, { color: c.text }]}>{opt}</Text>
            {answered && isAnswer && <Text style={[styles.mark, { color: c.success }]}>✓</Text>}
            {answered && isPicked && !isAnswer && (
              <Text style={[styles.mark, { color: c.danger }]}>✗</Text>
            )}
          </Pressable>
        );
      })}

      {answered && (
        <View style={[styles.explainCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
          <Text style={[styles.explainTitle, { color: c.heading }]}>
            {selected === quiz.answer ? "Correct! 🎉" : "Not quite"}
          </Text>
          <Text style={[styles.explainText, { color: c.muted }]}>{quiz.explanation}</Text>
          <Pressable style={[styles.primaryBtn, { backgroundColor: c.primary }]} onPress={loadQuestion}>
            <Text style={[styles.primaryBtnText, { color: c.onPrimary }]}>Next question →</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing(2), gap: theme.spacing(1.5) },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  muted: { color: theme.colors.muted, textAlign: "center" },
  errorTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.danger },
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius,
    padding: theme.spacing(2.5),
  },
  label: { color: "#e0e7ff", fontWeight: "600", marginBottom: 6 },
  question: { color: "#fff", fontSize: 20, fontWeight: "700", lineHeight: 28 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  correct: { backgroundColor: "#dcfce7", borderColor: theme.colors.success },
  wrong: { backgroundColor: "#fee2e2", borderColor: theme.colors.danger },
  optionText: { fontSize: 16, color: theme.colors.text, flex: 1 },
  mark: { fontSize: 18, fontWeight: "800" },
  explainCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing(1.5),
  },
  explainTitle: { fontSize: 18, fontWeight: "800", color: theme.colors.text },
  explainText: { color: theme.colors.muted, lineHeight: 21 },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

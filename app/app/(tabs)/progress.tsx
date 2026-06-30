import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { getProgress, resetProgress } from "../../lib/storage";
import { theme } from "../../lib/theme";
import { useTheme, type AppColors } from "../../lib/ThemeContext";
import type { Progress } from "../../lib/types";

export default function ProgressScreen() {
  const { colors: c } = useTheme();
  const [progress, setProgress] = useState<Progress>({
    learned: [],
    quizScores: [],
  });

  useFocusEffect(
    useCallback(() => {
      getProgress().then(setProgress);
    }, [])
  );

  const totalQuizzes = progress.quizScores.length;
  const correct = progress.quizScores.filter((s) => s.correct).length;
  const accuracy = totalQuizzes
    ? Math.round((correct / totalQuizzes) * 100)
    : 0;

  async function onReset() {
    const next = await resetProgress();
    setProgress(next);
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.statsRow}>
        <Stat label="Signs learned" value={progress.learned.length} c={c} />
        <Stat label="Quizzes taken" value={totalQuizzes} c={c} />
        <Stat label="Accuracy" value={`${accuracy}%`} c={c} />
      </View>

      <Text style={[styles.sectionTitle, { color: c.heading }]}>Signs learned</Text>
      {progress.learned.length === 0 ? (
        <Text style={[styles.muted, { color: c.muted }]}>
          None yet — mark signs as learned in the Learn tab.
        </Text>
      ) : (
        <View style={styles.tagWrap}>
          {progress.learned.map((name) => (
            <View key={name} style={[styles.tag, { backgroundColor: c.tagBg }]}>
              <Text style={[styles.tagText, { color: c.primary }]}>{name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: c.heading }]}>Recent quiz results</Text>
      {totalQuizzes === 0 ? (
        <Text style={[styles.muted, { color: c.muted }]}>Take a quiz to see results here.</Text>
      ) : (
        [...progress.quizScores]
          .reverse()
          .slice(0, 15)
          .map((s, i) => (
            <View key={`${s.timestamp}-${i}`} style={[styles.resultRow, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
              <Text style={[styles.resultSign, { color: c.text }]}>{s.sign}</Text>
              <Text
                style={[
                  styles.resultMark,
                  { color: s.correct ? c.success : c.danger },
                ]}
              >
                {s.correct ? "✓ Correct" : "✗ Wrong"}
              </Text>
            </View>
          ))
      )}

      <Pressable style={[styles.resetBtn, { borderColor: c.danger }]} onPress={onReset}>
        <Text style={[styles.resetText, { color: c.danger }]}>Reset progress</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  c,
}: {
  label: string;
  value: number | string;
  c: AppColors;
}) {
  return (
    <View style={[styles.stat, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
      <Text style={[styles.statValue, { color: c.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing(2), gap: theme.spacing(1.5) },
  statsRow: { flexDirection: "row", gap: theme.spacing(1.5) },
  stat: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: { fontSize: 26, fontWeight: "800", color: theme.colors.primary },
  statLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: theme.spacing(1),
  },
  muted: { color: theme.colors.muted },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: theme.colors.primary, fontWeight: "700" },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing(1.5),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultSign: { fontWeight: "700", color: theme.colors.text },
  resultMark: { fontWeight: "700" },
  resetBtn: {
    marginTop: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.danger,
    borderRadius: theme.radius,
    paddingVertical: 12,
    alignItems: "center",
  },
  resetText: { color: theme.colors.danger, fontWeight: "700" },
});

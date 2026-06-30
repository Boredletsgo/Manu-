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
import type { Progress } from "../../lib/types";

export default function ProgressScreen() {
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.statsRow}>
        <Stat label="Signs learned" value={progress.learned.length} />
        <Stat label="Quizzes taken" value={totalQuizzes} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </View>

      <Text style={styles.sectionTitle}>Signs learned</Text>
      {progress.learned.length === 0 ? (
        <Text style={styles.muted}>
          None yet — mark signs as learned in the Learn tab.
        </Text>
      ) : (
        <View style={styles.tagWrap}>
          {progress.learned.map((name) => (
            <View key={name} style={styles.tag}>
              <Text style={styles.tagText}>{name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent quiz results</Text>
      {totalQuizzes === 0 ? (
        <Text style={styles.muted}>Take a quiz to see results here.</Text>
      ) : (
        [...progress.quizScores]
          .reverse()
          .slice(0, 15)
          .map((s, i) => (
            <View key={`${s.timestamp}-${i}`} style={styles.resultRow}>
              <Text style={styles.resultSign}>{s.sign}</Text>
              <Text
                style={[
                  styles.resultMark,
                  { color: s.correct ? theme.colors.success : theme.colors.danger },
                ]}
              >
                {s.correct ? "✓ Correct" : "✗ Wrong"}
              </Text>
            </View>
          ))
      )}

      <Pressable style={styles.resetBtn} onPress={onReset}>
        <Text style={styles.resetText}>Reset progress</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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

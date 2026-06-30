import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { fetchSigns } from "../../lib/api";
import { getProgress, toggleLearned } from "../../lib/storage";
import { theme } from "../../lib/theme";
import type { Sign } from "../../lib/types";

const CATEGORIES = ["all", "alphabet", "numbers", "phrases"] as const;
type Category = (typeof CATEGORIES)[number];

export default function LearnScreen() {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("all");

  useEffect(() => {
    let active = true;
    fetchSigns()
      .then((data) => active && setSigns(data))
      .catch((e) => active && setError(String(e.message ?? e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Refresh learned state whenever the screen regains focus.
  useFocusEffect(
    useCallback(() => {
      getProgress().then((p) => setLearned(p.learned));
    }, [])
  );

  const filtered = useMemo(() => {
    if (category === "all") return signs;
    return signs.filter((s) => s.category === category);
  }, [signs, category]);

  async function onToggle(name: string) {
    const next = await toggleLearned(name);
    setLearned(next.learned);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.muted}>Loading signs…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load signs</Text>
        <Text style={styles.muted}>{error}</Text>
        <Text style={styles.muted}>Is the backend running on :8000?</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isLearned = learned.includes(item.name);
          return (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.signName}>{item.name}</Text>
                  <Pressable
                    onPress={() => onToggle(item.name)}
                    style={[styles.badge, isLearned && styles.badgeLearned]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isLearned && styles.badgeTextLearned,
                      ]}
                    >
                      {isLearned ? "✓ Learned" : "Mark learned"}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.tip}>💡 {item.tip}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  muted: { color: theme.colors.muted, textAlign: "center" },
  errorTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.danger },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: theme.spacing(2),
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: { color: theme.colors.muted, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  list: { padding: theme.spacing(2), paddingTop: 0, gap: theme.spacing(1.5) },
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: { width: 96, height: "100%", backgroundColor: "#eef2ff" },
  cardBody: { flex: 1, padding: theme.spacing(1.5) },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signName: { fontSize: 20, fontWeight: "800", color: theme.colors.text },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
  },
  badgeLearned: { backgroundColor: "#dcfce7" },
  badgeText: { fontSize: 12, color: theme.colors.primary, fontWeight: "600" },
  badgeTextLearned: { color: theme.colors.success },
  desc: { marginTop: 6, color: theme.colors.text, lineHeight: 20 },
  tip: { marginTop: 6, color: theme.colors.muted, fontStyle: "italic" },
});

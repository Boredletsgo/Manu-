import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "../../lib/theme";

interface FeatureCard {
  href: "/learn" | "/chat" | "/quiz" | "/progress";
  emoji: string;
  title: string;
  subtitle: string;
}

const FEATURES: FeatureCard[] = [
  {
    href: "/learn",
    emoji: "📚",
    title: "Learn Signs",
    subtitle: "Browse the alphabet, numbers, and common phrases.",
  },
  {
    href: "/chat",
    emoji: "💬",
    title: "AI Tutor",
    subtitle: "Ask anything about ASL and get instant guidance.",
  },
  {
    href: "/quiz",
    emoji: "🧠",
    title: "Quiz Yourself",
    subtitle: "Test your memory with flashcard-style questions.",
  },
  {
    href: "/progress",
    emoji: "📈",
    title: "Track Progress",
    subtitle: "See the signs you've learned and your quiz scores.",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <Text style={styles.wave}>👋</Text>
        <Text style={styles.title}>Manuō</Text>
        <Text style={styles.subtitle}>
          Master American Sign Language with an AI tutor, interactive lessons,
          and quizzes.
        </Text>
      </View>

      {FEATURES.map((f) => (
        <Link key={f.href} href={f.href} asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardEmoji}>{f.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardSubtitle}>{f.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing(2), gap: theme.spacing(1.5) },
  hero: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  wave: { fontSize: 40 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: theme.spacing(1),
  },
  subtitle: {
    fontSize: 15,
    color: "#e0e7ff",
    marginTop: theme.spacing(1),
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardEmoji: { fontSize: 30, marginRight: theme.spacing(2) },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
  },
  chevron: { fontSize: 28, color: theme.colors.muted },
});

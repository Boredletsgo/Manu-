import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { theme } from "../../lib/theme";

type Route = "/" | "/learn" | "/chat" | "/quiz" | "/progress";

const NAV_LINKS: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/chat", label: "AI Tutor" },
  { href: "/quiz", label: "Quiz" },
  { href: "/progress", label: "Progress" },
];

interface FeatureCard {
  href: Route;
  emoji: string;
  title: string;
  subtitle: string;
  cta: string;
}

const FEATURES: FeatureCard[] = [
  {
    href: "/learn",
    emoji: "🤟",
    title: "Learn Signs",
    subtitle: "Browse the alphabet, numbers, and common phrases.",
    cta: "View Lessons",
  },
  {
    href: "/chat",
    emoji: "🤖",
    title: "Meet Your AI Tutor",
    subtitle: "Personalized AI tutoring and interactive guidance.",
    cta: "Open AI Chat",
  },
  {
    href: "/quiz",
    emoji: "🧠",
    title: "Test Your Skills",
    subtitle: "Flashcards and quizzes to assess what you've learned.",
    cta: "Take a Quiz",
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 860;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, wide && styles.contentWide]}
    >
      {/* Top nav bar */}
      <View style={styles.nav}>
        <View style={styles.brand}>
          <Text style={styles.brandMark}>🤟</Text>
          <Text style={styles.brandName}>Manuō</Text>
        </View>
        {wide ? (
          <View style={styles.navLinks}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} asChild>
                <Pressable>
                  <Text style={styles.navLink}>{l.label}</Text>
                </Pressable>
              </Link>
            ))}
            <Link href="/learn" asChild>
              <Pressable style={styles.navCta}>
                <Text style={styles.navCtaText}>Get Started</Text>
              </Pressable>
            </Link>
          </View>
        ) : null}
      </View>

      {/* Hero */}
      <LinearGradient
        colors={[theme.colors.heroFrom, theme.colors.heroTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.heroInner, wide && styles.heroInnerWide]}>
          <View style={[styles.heroText, wide && styles.heroTextWide]}>
            <Text style={[styles.heroTitle, wide && styles.heroTitleWide]}>
              Discover the visual language of connection
            </Text>
            <Text style={styles.heroSubtitle}>
              Master ASL with personalized AI tutoring and interactive lessons.
            </Text>
            <Link href="/learn" asChild>
              <Pressable style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Start Learning for Free</Text>
              </Pressable>
            </Link>
          </View>
          <View style={styles.heroArt}>
            <Text style={styles.heroArtEmoji}>🧏🏽‍♀️🤟🧏🏻‍♂️</Text>
            <Text style={styles.heroArtEmojiSm}>👋 🙌 🫶</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Feature cards */}
      <View style={[styles.features, wide && styles.featuresWide]}>
        {FEATURES.map((f) => (
          <View key={f.href} style={[styles.card, wide && styles.cardWide]}>
            <Text style={styles.cardEmoji}>{f.emoji}</Text>
            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardSubtitle}>{f.subtitle}</Text>
            <Link href={f.href} asChild>
              <Pressable style={styles.cardCta}>
                <Text style={styles.cardCtaText}>{f.cta}</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing(2), gap: theme.spacing(2) },
  contentWide: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    padding: theme.spacing(3),
  },

  // Nav
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandMark: { fontSize: 26 },
  brandName: {
    fontSize: 24,
    fontFamily: theme.fonts.logo,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: theme.colors.heading,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2.5),
  },
  navLink: {
    fontSize: 15,
    fontFamily: theme.fonts.bodyMedium,
    fontWeight: "500",
    color: theme.colors.text,
  },
  navCta: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  navCtaText: { color: "#fff", fontFamily: theme.fonts.bodySemiBold, fontWeight: "600" },

  // Hero
  hero: { borderRadius: 24, overflow: "hidden" },
  heroInner: { padding: theme.spacing(3), gap: theme.spacing(2) },
  heroInnerWide: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(5),
  },
  heroText: { gap: theme.spacing(1.5) },
  heroTextWide: { flex: 1, paddingRight: theme.spacing(3) },
  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontFamily: theme.fonts.headingExtra,
    fontWeight: "800",
    color: theme.colors.heading,
  },
  heroTitleWide: { fontSize: 44, lineHeight: 52 },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.fonts.body,
    color: "#33635c",
    maxWidth: 460,
  },
  heroCta: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: theme.spacing(1),
  },
  heroCtaText: {
    color: "#fff",
    fontFamily: theme.fonts.bodySemiBold,
    fontWeight: "600",
    fontSize: 16,
  },
  heroArt: { alignItems: "center", justifyContent: "center", gap: 8 },
  heroArtEmoji: { fontSize: 56 },
  heroArtEmojiSm: { fontSize: 30, letterSpacing: 4 },

  // Features
  features: { gap: theme.spacing(2) },
  featuresWide: { flexDirection: "row", alignItems: "stretch" },
  card: {
    backgroundColor: theme.colors.feature,
    borderRadius: 20,
    padding: theme.spacing(3),
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  cardWide: { flex: 1 },
  cardEmoji: { fontSize: 44 },
  cardTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    fontWeight: "700",
    color: theme.colors.heading,
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
  },
  cardCta: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    marginTop: theme.spacing(1.5),
  },
  cardCtaText: { color: "#fff", fontFamily: theme.fonts.bodySemiBold, fontWeight: "600" },
});

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

import { Logo } from "../../components/Logo";
import { theme } from "../../lib/theme";
import { useTheme } from "../../lib/ThemeContext";

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
  const { dark, toggle, colors } = useTheme();
  const p = {
    bg: colors.bg,
    navLink: colors.navLink,
    ctaBg: colors.primaryDark,
    ctaText: colors.onPrimary,
    heroFrom: colors.heroFrom,
    heroMid: colors.heroMid,
    heroTo: colors.heroTo,
    heroTitle: colors.heroTitle,
    heroSub: colors.heroSub,
    cardBg: colors.feature,
    cardBorder: colors.featureBorder,
    cardTitle: colors.heading,
    cardSub: colors.muted,
    logo: colors.logo,
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: p.bg }]}
      contentContainerStyle={[styles.content, wide && styles.contentWide]}
    >
      {/* Top nav bar */}
      <View style={styles.nav}>
        <Logo height={wide ? 46 : 38} theme={p.logo} />
        <View style={styles.navRight}>
          {wide ? (
            <View style={styles.navLinks}>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} asChild>
                  <Pressable>
                    <Text style={[styles.navLink, { color: p.navLink }]}>
                      {l.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
              <Link href="/learn" asChild>
                <Pressable style={StyleSheet.flatten([styles.navCta, { backgroundColor: p.ctaBg }])}>
                  <Text style={[styles.navCtaText, { color: p.ctaText }]}>
                    Get Started
                  </Text>
                </Pressable>
              </Link>
            </View>
          ) : null}
          <Pressable
            onPress={toggle}
            accessibilityLabel={dark ? "Switch to light theme" : "Switch to dark theme"}
            style={[styles.themeToggle, { borderColor: p.cardBorder }]}
          >
            <Text style={styles.themeToggleIcon}>{dark ? "☀️" : "🌙"}</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero */}
      <LinearGradient
        colors={p.heroMid ? [p.heroFrom, p.heroMid, p.heroTo] : [p.heroFrom, p.heroTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.heroInner, wide && styles.heroInnerWide]}>
          <View style={[styles.heroText, wide && styles.heroTextWide]}>
            <Text style={[styles.heroTitle, wide && styles.heroTitleWide, { color: p.heroTitle }]}>
              Discover the visual language of connection
            </Text>
            <Text style={[styles.heroSubtitle, { color: p.heroSub }]}>
              Master ASL with personalized AI tutoring and interactive lessons.
            </Text>
            <Link href="/learn" asChild>
              <Pressable style={StyleSheet.flatten([styles.heroCta, { backgroundColor: p.ctaBg }])}>
                <Text style={[styles.heroCtaText, { color: p.ctaText }]}>
                  Start Learning for Free
                </Text>
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
          <View
            key={f.href}
            style={[
              styles.card,
              wide && styles.cardWide,
              { backgroundColor: p.cardBg, borderColor: p.cardBorder },
            ]}
          >
            <Text style={styles.cardEmoji}>{f.emoji}</Text>
            <Text style={[styles.cardTitle, { color: p.cardTitle }]}>{f.title}</Text>
            <Text style={[styles.cardSubtitle, { color: p.cardSub }]}>{f.subtitle}</Text>
            <Link href={f.href} asChild>
              <Pressable style={StyleSheet.flatten([styles.cardCta, { backgroundColor: p.ctaBg }])}>
                <Text style={[styles.cardCtaText, { color: p.ctaText }]}>{f.cta}</Text>
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
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2.5),
  },
  navRight: { flexDirection: "row", alignItems: "center", gap: theme.spacing(1.5) },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeToggleIcon: { fontSize: 18 },
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

import { useId } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import { theme } from "../lib/theme";

export type LogoVariant = "gradient" | "blue" | "gold" | "light";

const VARIANT_SOLID: Record<Exclude<LogoVariant, "gradient">, string> = {
  blue: "#2563eb",
  gold: "#e8a82e",
  light: "#bfe3ff",
};

/** The handshake-forming-"M" brand mark. */
export function LogoMark({
  size = 40,
  variant = "gradient",
}: {
  size?: number;
  variant?: LogoVariant;
}) {
  const id = useId().replace(/:/g, "");
  const stroke = variant === "gradient" ? `url(#mark-${id})` : VARIANT_SOLID[variant];
  const grip = variant === "gradient" ? "#0d9488" : VARIANT_SOLID[variant];

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id={`mark-${id}`} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#2563eb" />
          <Stop offset="0.55" stopColor="#0ea5a4" />
          <Stop offset="1" stopColor="#0d9488" />
        </LinearGradient>
      </Defs>

      {/* Left + right pillars of the M */}
      <Path
        d="M16 51 V17"
        stroke={stroke}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M48 51 V17"
        stroke={stroke}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      {/* Two forearms meeting in a handshake at the center */}
      <Path
        d="M16 17 L32 35"
        stroke={stroke}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M48 17 L32 35"
        stroke={stroke}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      {/* The clasp / grip */}
      <Circle cx="32" cy="35" r="6.5" fill={grip} />
      <Circle cx="32" cy="35" r="2.6" fill="#ffffff" opacity={0.9} />
    </Svg>
  );
}

/** Full lockup: mark + "Manuō" wordmark + tagline. */
export function Logo({
  markSize = 40,
  variant = "gradient",
  tagline = true,
  wordColor = theme.colors.heading,
  tagColor = theme.colors.primary,
}: {
  markSize?: number;
  variant?: LogoVariant;
  tagline?: boolean;
  wordColor?: string;
  tagColor?: string;
}) {
  return (
    <View style={styles.row}>
      <LogoMark size={markSize} variant={variant} />
      <View>
        <Text style={[styles.word, { color: wordColor, fontSize: markSize * 0.62 }]}>
          Manuō
        </Text>
        {tagline ? (
          <Text style={[styles.tag, { color: tagColor }]}>CONNECT THROUGH SIGN</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  word: {
    fontFamily: theme.fonts.logo,
    fontWeight: "700",
    letterSpacing: 0.6,
    lineHeight: undefined,
  },
  tag: {
    fontFamily: theme.fonts.bodySemiBold,
    fontWeight: "600",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 1,
  },
});

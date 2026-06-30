import { Image } from "react-native";

export type LogoTheme = "light" | "dark";

const ASSETS: Record<LogoTheme, { uri: string; aspect: number }> = {
  // Exported Manuō brand lockups (mark + wordmark + tagline), transparent PNG.
  light: { uri: "/manuo-logo-light.png", aspect: 404 / 131 },
  dark: { uri: "/manuo-logo-dark.png", aspect: 434 / 151 },
};

// Mark-only (handshake-M symbol), cropped from the lockups. Used on every screen.
const MARKS: Record<LogoTheme, { uri: string; aspect: number }> = {
  light: { uri: "/manuo-mark-light.png", aspect: 132 / 106 },
  dark: { uri: "/manuo-mark-dark.png", aspect: 132 / 106 },
};

/** Full Manuō logo lockup (handshake-M mark + wordmark + tagline). */
export function Logo({
  height = 44,
  theme = "light",
}: {
  height?: number;
  theme?: LogoTheme;
}) {
  const asset = ASSETS[theme];
  return (
    <Image
      source={{ uri: asset.uri }}
      style={{ height, width: height * asset.aspect }}
      resizeMode="contain"
      accessibilityLabel="Manuō — Connect Through Sign"
    />
  );
}

/** Short Manuō logo — the handshake-M mark only, for headers and accents. */
export function LogoMark({
  height = 28,
  theme = "light",
}: {
  height?: number;
  theme?: LogoTheme;
}) {
  const asset = MARKS[theme];
  return (
    <Image
      source={{ uri: asset.uri }}
      style={{ height, width: height * asset.aspect }}
      resizeMode="contain"
      accessibilityLabel="Manuō"
    />
  );
}

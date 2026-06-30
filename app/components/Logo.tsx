import { Image } from "react-native";

export type LogoTheme = "light" | "dark";

const ASSETS: Record<LogoTheme, { uri: string; aspect: number }> = {
  // Exported Manuō brand lockups (mark + wordmark + tagline), transparent PNG.
  light: { uri: "/manuo-logo-light.png", aspect: 404 / 131 },
  dark: { uri: "/manuo-logo-dark.png", aspect: 434 / 151 },
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

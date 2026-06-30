import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { LogoTheme } from "../components/Logo";

export interface AppColors {
  // surfaces
  bg: string;
  card: string;
  cardBorder: string;
  feature: string;
  featureBorder: string;
  inputBg: string;
  chipBg: string;
  // text
  text: string;
  heading: string;
  muted: string;
  navLink: string;
  // brand
  primary: string;
  primaryDark: string;
  onPrimary: string;
  // hero (home)
  heroFrom: string;
  heroMid?: string;
  heroTo: string;
  heroTitle: string;
  heroSub: string;
  // states
  success: string;
  danger: string;
  correctBg: string;
  wrongBg: string;
  badgeBg: string;
  badgeLearnedBg: string;
  tagBg: string;
  // navigation chrome
  tabBg: string;
  tabActive: string;
  tabInactive: string;
  tabBorder: string;
  headerBg: string;
  headerTint: string;
  // misc
  logo: LogoTheme;
  statusBar: "light" | "dark";
}

const LIGHT: AppColors = {
  bg: "#f4f8f6",
  card: "#ffffff",
  cardBorder: "#d8ece7",
  feature: "#eef7f4",
  featureBorder: "#d3e9e3",
  inputBg: "#f4f8f6",
  chipBg: "#ffffff",
  text: "#1f2937",
  heading: "#123b39",
  muted: "#5b7772",
  navLink: "#1f2937",
  primary: "#0d9488",
  primaryDark: "#0f766e",
  onPrimary: "#ffffff",
  heroFrom: "#e8f7f3",
  heroTo: "#b3e4dc",
  heroTitle: "#123b39",
  heroSub: "#3a635d",
  success: "#16a34a",
  danger: "#dc2626",
  correctBg: "#dcfce7",
  wrongBg: "#fee2e2",
  badgeBg: "#e2f1ee",
  badgeLearnedBg: "#dcfce7",
  tagBg: "#e2f1ee",
  tabBg: "#ffffff",
  tabActive: "#0d9488",
  tabInactive: "#5b7772",
  tabBorder: "#d8ece7",
  headerBg: "#0d9488",
  headerTint: "#ffffff",
  logo: "light",
  statusBar: "dark",
};

const DARK: AppColors = {
  bg: "#0b1a2b",
  card: "#12272b",
  cardBorder: "#213a3c",
  feature: "#12272b",
  featureBorder: "#213a3c",
  inputBg: "#0e2230",
  chipBg: "#12272b",
  text: "#dfe9e7",
  heading: "#f3efe6",
  muted: "#9fb6b3",
  navLink: "#c3d4d1",
  primary: "#2dd4bf",
  primaryDark: "#16b8a6",
  onPrimary: "#06241f",
  heroFrom: "#10544c",
  heroMid: "#0c3340",
  heroTo: "#091826",
  heroTitle: "#f3efe6",
  heroSub: "#9fb6b3",
  success: "#34d399",
  danger: "#f87171",
  correctBg: "#0f3d2e",
  wrongBg: "#3d1f22",
  badgeBg: "#16313a",
  badgeLearnedBg: "#0f3d2e",
  tagBg: "#163b38",
  tabBg: "#0b1a2b",
  tabActive: "#2dd4bf",
  tabInactive: "#6b8784",
  tabBorder: "#1a2e3a",
  headerBg: "#0b1a2b",
  headerTint: "#f3efe6",
  logo: "dark",
  statusBar: "light",
};

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggle = useCallback(() => setDark((d) => !d), []);
  const value = useMemo<ThemeContextValue>(
    () => ({ dark, toggle, colors: dark ? DARK : LIGHT }),
    [dark, toggle]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

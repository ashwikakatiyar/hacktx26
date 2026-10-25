import type { ViewStyle } from "react-native";

// Palette: "Fairytale Friends". Night plum, parchment cards, lantern gold, and a lavender accent.
// Contrast notes (WCAG AA): ink/muted on card >= 5:1, accent on card >= 4.5:1, white on accent/green >= 4.5:1.
// The original keys are kept so every screen picks the new values up automatically.
export const colors = {
  bg: "#E1E5EE",
  card: "#FFFBF0", // parchment
  cardAlt: "#F7F0E0", // a notch darker, for inset areas
  ink: "#43362F",
  muted: "#6A5F57",
  line: "#E2D6C3", // soft card border
  lineSoft: "#ECE3D2", // dividers
  lineStrong: "#B5A594", // inputs and outline buttons
  accent: "#7568B5",
  accentDeep: "#5A4E99",
  accentSoft: "#EAE3F5",
  green: "#4F7A5E",
  greenSoft: "#DDEBD6",
  night: "#3E3230",
  night2: "#54443F",
  night3: "#2F2624",
  nightTop: "#2B2140", // top of the sky gradient
  nightMid: "#4A3A5E",
  onNight: "#FFF8E6",
  gold: "#F1C45B",
  goldDeep: "#D9A12E",
  goldSoft: "#FFF1C9",
  lavender: "#CBB8DE",
  mint: "#B9D9C6",
  rose: "#E9B5B8",
  butter: "#F1C45B",
  tagLavender: "#E8DFF3",
  grass: "#DFE8CB",
  grassDeep: "#C9D9B0",
};

// Fonts: Fraunces (soft storybook serif) for headings, Nunito (rounded) for everything else.
// These are logical names; the Text wrapper in components/Text.tsx maps them plus fontWeight to the real font files.
export const fonts = {
  display: "Fraunces",
  body: "Nunito",
};

export const radius = { sm: 12, md: 16, lg: 22, pill: 999 } as const;

// Soft, warm shadows instead of heavy outlines. boxShadow works on iOS, Android and web.
export const shadow = {
  card: { boxShadow: "0 2px 10px rgba(67, 54, 47, 0.08), 0 1px 2px rgba(67, 54, 47, 0.06)" } as ViewStyle,
  lift: { boxShadow: "0 8px 24px rgba(67, 54, 47, 0.16), 0 2px 6px rgba(67, 54, 47, 0.08)" } as ViewStyle,
  glow: { boxShadow: "0 4px 14px rgba(241, 196, 91, 0.55)" } as ViewStyle,
};

// Shared look for a parchment card.
export const cardSurface: ViewStyle = {
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: radius.lg,
  ...shadow.card,
};

export const ACTIVITY_TYPES = [
  "dinner",
  "brunch",
  "coffee",
  "drinks",
  "outdoors",
  "music",
  "games",
  "art",
  "other",
] as const;

export const ACTIVITY_EMOJI: Record<string, string> = {
  dinner: "🍜",
  brunch: "🥞",
  coffee: "☕",
  drinks: "🍹",
  outdoors: "🌳",
  music: "🎶",
  games: "🎲",
  art: "🎨",
  other: "✨",
};

export const PLACEHOLDER_TINT: Record<string, string> = {
  dinner: "#F4D6C6",
  brunch: "#F8E3B5",
  coffee: "#E6D5C3",
  drinks: "#F6D0DA",
  outdoors: "#D3E8D6",
  music: "#D9D3F0",
  games: "#CFE3F2",
  art: "#F3D3EA",
  other: "#EADFCB",
};

// Little storybook landscapes that stand in for a place photo until a real image_url exists.
export type ArtTheme = {
  sky: string;
  orb: string;
  hill1: string;
  hill2: string;
};
export const ART_THEMES: Record<string, ArtTheme> = {
  dinner: {
    sky: "#3B2F66",
    orb: "#F2D27A",
    hill1: "#2F6B4F",
    hill2: "#244F3B",
  },
  brunch: {
    sky: "#E8B7C8",
    orb: "#FFF3C4",
    hill1: "#8A6FC4",
    hill2: "#5B3FA8",
  },
  coffee: {
    sky: "#E8B7C8",
    orb: "#FFF3C4",
    hill1: "#8A6FC4",
    hill2: "#5B3FA8",
  },
  drinks: {
    sky: "#6B47C4",
    orb: "#F7E7B0",
    hill1: "#3B2F66",
    hill2: "#2B2347",
  },
  outdoors: {
    sky: "#B9E0C9",
    orb: "#FFF3C4",
    hill1: "#5B3FA8",
    hill2: "#3B2F66",
  },
  music: { sky: "#6B47C4", orb: "#F7E7B0", hill1: "#3B2F66", hill2: "#2B2347" },
  games: { sky: "#6B47C4", orb: "#F7E7B0", hill1: "#3B2F66", hill2: "#2B2347" },
  art: { sky: "#B9E0C9", orb: "#FFF3C4", hill1: "#5B3FA8", hill2: "#3B2F66" },
  other: { sky: "#3B2F66", orb: "#F2D27A", hill1: "#2F6B4F", hill2: "#244F3B" },
};

import { Platform } from "react-native";

// Palette from the "Fairytale Friends" mockup (night purple + lantern gold).
// The original keys (bg, card, ink, muted, line, accent, accentSoft, green, greenSoft) are kept
// so the Phase 1 screens (add.tsx, card/[id].tsx, CardView) pick up the new look automatically.
export const colors = {
  // Figma storybook palette (screens 01–11)
  bg: "#DDE2EA",
  card: "#FCF7E9",
  ink: "#4D4038",
  muted: "#72675E",
  line: "#65554A",
  lineSoft: "#D4C8B9",
  accent: "#918CC8",
  accentSoft: "#E6DDF1",
  green: "#698C77",
  greenSoft: "#DCE8D7",
  night: "#4D4038",
  night2: "#64564E",
  night3: "#39312C",
  onNight: "#FCF7E9",
  gold: "#F1C45B",
  goldSoft: "#FFF1C9",
  lavender: "#CBB8DE",
  mint: "#B9D9C6",
  rose: "#E9B5B8",
  butter: "#F1C45B",
  tagLavender: "#E4DAF0",
};

// Display font for headings. The mockup uses Cormorant Garamond; this falls back to a system serif
// so no extra packages are needed. To use the real font, load it with expo-font and change it here only.
export const fonts = {
  display: Platform.select({ ios: "Inter", android: "sans-serif", default: "Inter, Arial, sans-serif" }) as string,
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

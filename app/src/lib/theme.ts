export const colors = {
  bg: "#FBF6EC",
  card: "#FFFFFF",
  ink: "#3B2F2F",
  muted: "#8A7B72",
  line: "#EADFCB",
  accent: "#E07A5F", // terracotta
  accentSoft: "#F9E3DC",
  green: "#81B29A",
  greenSoft: "#E3F0E9",
};

export const ACTIVITY_TYPES = ["dinner", "brunch", "coffee", "drinks", "outdoors", "music", "games", "art", "other"] as const;

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

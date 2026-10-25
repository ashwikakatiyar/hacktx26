import { Image } from "expo-image";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { decorative } from "@/lib/a11y";
import { Text as AppText } from "@/components/Text";

// Place thumbnail. Uses the real photo when the card has one, otherwise a little storybook scene:
// a dusk sky and hills with an illustrated motif for the activity (ramen bowl, mug, pines...).
// Pass `seed` (the place name) so two dinners don't look identical.

type Scene = { top: string; bottom: string; orb: string; hill1: string; hill2: string; stars: boolean };
const SCENES: Scene[] = [
  { top: "#3B2F66", bottom: "#6A5AA0", orb: "#F6DE9A", hill1: "#3F7A5C", hill2: "#2D5A44", stars: true },
  { top: "#E9AFC3", bottom: "#F7DCD3", orb: "#FFF3C4", hill1: "#9C84CF", hill2: "#7059B0", stars: false },
  { top: "#25475C", bottom: "#4E8A8E", orb: "#F6E6B0", hill1: "#2E6B5E", hill2: "#1F4A47", stars: true },
  { top: "#F3BE98", bottom: "#FAE3BC", orb: "#FFF6D8", hill1: "#C98B6B", hill2: "#A9694F", stars: false },
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const INK = "#503F35";
const CREAM = "#FFF8E6";
const stroke = { stroke: INK, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Motif({ type }: { type: string }) {
  switch (type) {
    case "dinner":
      return (
        <G>
          <Path d="M58 26 L74 46 M65 24 L80 43" {...stroke} fill="none" />
          <Path d="M22 50 Q22 76 48 76 Q74 76 74 50Z" fill={CREAM} {...stroke} />
          <Ellipse cx={48} cy={50} rx={26} ry={6} fill="#F1C45B" {...stroke} />
          <Path d="M34 50 q4 -5 8 0 t8 0 t8 0" fill="none" {...stroke} strokeWidth={1.3} />
          <Path d="M38 40 q-4 -5 0 -9 t0 -8" fill="none" stroke={CREAM} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
          <Path d="M50 40 q-4 -5 0 -9 t0 -8" fill="none" stroke={CREAM} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
          <Path d="M36 76 h24" {...stroke} />
        </G>
      );
    case "coffee":
      return (
        <G>
          <Path d="M36 28 q-4 -5 0 -9 t0 -8 M48 28 q-4 -5 0 -9 t0 -8" fill="none" stroke={CREAM} strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
          <Path d="M64 46 q14 0 12 12 q-2 10 -14 8" fill="none" {...stroke} strokeWidth={2.4} />
          <Path d="M26 38 H66 V58 Q66 76 46 76 Q26 76 26 58Z" fill={CREAM} {...stroke} />
          <Path d="M26 46 H66" {...stroke} strokeWidth={1.2} opacity={0.6} />
          <Path d="M46 52 c-5 -4 -8 1 -4 5 l4 4 l4 -4 c4 -4 1 -9 -4 -5z" fill="#E9B5B8" stroke={INK} strokeWidth={1.2} />
          <Ellipse cx={46} cy={78} rx={28} ry={4} fill="#EADFCB" {...stroke} />
        </G>
      );
    case "brunch":
      return (
        <G>
          <Circle cx={50} cy={54} r={24} fill={CREAM} {...stroke} />
          <Circle cx={50} cy={54} r={16} fill="#FFFDF4" stroke={INK} strokeWidth={1.1} opacity={0.9} />
          <Path d="M42 52 q2 -8 10 -6 q9 2 5 10 q-4 7 -12 4 q-5 -2 -3 -8z" fill="#fff" {...stroke} strokeWidth={1.2} />
          <Circle cx={50} cy={53} r={5} fill="#F1C45B" stroke={INK} strokeWidth={1.2} />
          <Path d="M16 40 V70 M13 40 V50 q0 4 3 4 q3 0 3 -4 V40" fill="none" {...stroke} strokeWidth={1.4} />
          <Path d="M84 40 q-4 4 -4 14 H84 V72" fill="none" {...stroke} strokeWidth={1.4} />
        </G>
      );
    case "drinks":
      return (
        <G>
          <Path d="M60 22 L50 46" {...stroke} stroke="#E9B5B8" strokeWidth={2.4} />
          <Path d="M24 34 H72 L48 62Z" fill={CREAM} {...stroke} />
          <Path d="M32 40 H64 L48 58Z" fill="#F1C45B" opacity={0.9} />
          <Path d="M48 62 V78 M36 78 H60" fill="none" {...stroke} />
          <Circle cx={60} cy={30} r={5} fill="#9CC48C" {...stroke} strokeWidth={1.3} />
        </G>
      );
    case "outdoors":
      return (
        <G>
          <Path d="M14 74 L34 40 L46 58 L56 46 L82 74Z" fill="#E9E2F4" {...stroke} opacity={0.95} />
          <Path d="M28 74 L40 46 L52 74Z" fill="#4F7A5E" {...stroke} />
          <Path d="M52 74 L64 38 L76 74Z" fill="#3F6A50" {...stroke} />
          <Path d="M40 74 V80 M64 74 V80" {...stroke} />
        </G>
      );
    case "music":
      return (
        <G>
          <Path d="M36 64 V32 L70 26 V58" fill="none" {...stroke} strokeWidth={2.2} />
          <Path d="M36 38 L70 32" {...stroke} strokeWidth={4} />
          <Ellipse cx={30} cy={65} rx={8} ry={6} fill={CREAM} {...stroke} />
          <Ellipse cx={64} cy={59} rx={8} ry={6} fill={CREAM} {...stroke} />
        </G>
      );
    case "games":
      return (
        <G transform="rotate(-10 48 52)">
          <Rect x={26} y={30} width={44} height={44} rx={10} fill={CREAM} {...stroke} />
          <Circle cx={37} cy={41} r={3.4} fill={INK} />
          <Circle cx={59} cy={41} r={3.4} fill={INK} />
          <Circle cx={48} cy={52} r={3.4} fill={INK} />
          <Circle cx={37} cy={63} r={3.4} fill={INK} />
          <Circle cx={59} cy={63} r={3.4} fill={INK} />
        </G>
      );
    case "art":
      return (
        <G>
          <Path d="M20 54 C20 34 40 26 58 30 C78 34 82 52 70 60 C62 65 58 58 50 62 C44 66 48 76 36 74 C26 72 20 64 20 54Z" fill={CREAM} {...stroke} />
          <Circle cx={36} cy={48} r={4.2} fill="#E9B5B8" stroke={INK} strokeWidth={1.1} />
          <Circle cx={48} cy={40} r={4.2} fill="#F1C45B" stroke={INK} strokeWidth={1.1} />
          <Circle cx={62} cy={42} r={4.2} fill="#9CC48C" stroke={INK} strokeWidth={1.1} />
          <Circle cx={66} cy={54} r={4.2} fill="#8FB4E0" stroke={INK} strokeWidth={1.1} />
        </G>
      );
    default:
      return (
        <G>
          <Path d="M48 24 L55 43 L74 48 L55 54 L48 74 L41 54 L22 48 L41 43Z" fill="#F1C45B" {...stroke} />
          <Circle cx={72} cy={28} r={3} fill={CREAM} />
          <Circle cx={24} cy={70} r={2.4} fill={CREAM} />
        </G>
      );
  }
}

export function PlaceArt({
  type,
  imageUrl,
  size = 88,
  radius = 16,
  seed,
  width,
  height,
}: {
  type: string | null;
  imageUrl?: string | null;
  size?: number;
  radius?: number;
  seed?: string;
  width?: number | `${number}%`;
  height?: number;
}) {
  void seed;
  const w = width ?? size;
  const h = height ?? size;
  if (imageUrl) {
    return (
      <View style={[styles.box, { width: w, height: h, borderRadius: radius }]}>
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      </View>
    );
  }
  return <ActivityArt type={type} width={w} height={h} />;
}

// Compact, flat illustration used by the handoff screens.
export function ActivityArt({
  type,
  size = 54,
  width,
  height,
  large = false,
}: {
  type: string | null;
  size?: number;
  width?: number | `${number}%`;
  height?: number;
  large?: boolean;
}) {
  const t = type ?? "other";
  const glyph: Record<string, string> = {
    dinner: "🍜",
    brunch: "🥞",
    coffee: "☕",
    drinks: "♧",
    outdoors: "⚑",
    music: "♫",
    games: "⚄",
    art: "✿",
    other: "✦",
  };
  return (
    <View
      style={[
        styles.flatArt,
        {
          width: width ?? size,
          height: height ?? size,
          backgroundColor: large ? "#DDE5C8" : "#CDB9DF",
        },
      ]}
    >
      <AppText style={[styles.flatGlyph, large && styles.largeGlyph]}>{glyph[t] ?? glyph.other}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: "hidden", flexShrink: 0, backgroundColor: "#3B2F66" },
  flatArt: { borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  flatGlyph: { fontSize: 28, color: "#463A35" },
  largeGlyph: { fontSize: 58 },
});

import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { ART_THEMES } from "@/lib/theme";

// Place thumbnail. Uses the real photo when the card has one, otherwise a little storybook landscape
// tinted by activity type, so every card looks finished even before SerpApi finds an image.
export function PlaceArt({
  type,
  imageUrl,
  size = 88,
  radius = 12,
}: {
  type: string | null;
  imageUrl?: string | null;
  size?: number;
  radius?: number;
}) {
  const t = ART_THEMES[type ?? "other"] ?? ART_THEMES.other;
  return (
    <View
      style={[styles.box, { width: size, height: size, borderRadius: radius }]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 96 96"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <Rect width={96} height={96} fill={t.sky} />
          <Circle cx={68} cy={28} r={10} fill={t.orb} />
          <Path d="M0 70 Q30 46 62 66 T96 60 V96 H0Z" fill={t.hill1} />
          <Path d="M0 84 Q40 64 96 82 V96 H0Z" fill={t.hill2} />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: "hidden", flexShrink: 0 },
});

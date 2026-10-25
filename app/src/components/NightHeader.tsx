import { useId, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { colors } from "@/lib/theme";

// Stars: [x, y, radius, color]
const STARS_SKY: [number, number, number, string][] = [
  [34, 36, 1.6, "#F6DE9A"], [92, 20, 1.2, "#fff"], [150, 52, 1, "#fff"], [196, 26, 1.8, "#F6DE9A"],
  [262, 14, 1.2, "#fff"], [286, 60, 1, "#fff"], [352, 38, 1.6, "#F6DE9A"], [372, 92, 1, "#fff"],
  [64, 84, 1, "#fff"], [226, 78, 1.2, "#fff"], [120, 100, 1, "#F6DE9A"],
];
const STARS_PLAIN: [number, number, number, string][] = [
  [330, 26, 1.6, "#F6DE9A"], [362, 66, 1.2, "#fff"], [246, 18, 1.2, "#fff"], [60, 40, 1, "#fff"],
  [292, 58, 1, "#F6DE9A"], [150, 24, 1, "#fff"], [26, 96, 1.2, "#F6DE9A"],
];

// The night-sky banner at the top of every main screen.
// "sky" adds the moon, pines and fireflies (home). The bottom edge scoops into the page background.
export function NightHeader({
  children,
  variant = "plain",
  minHeight,
  style,
}: {
  children: ReactNode;
  variant?: "plain" | "sky";
  minHeight?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const sky = variant === "sky";
  const H = sky ? 250 : 176;
  const stars = sky ? STARS_SKY : STARS_PLAIN;
  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: insets.top + 14, minHeight, paddingBottom: sky ? 44 : 38 },
        style,
      ]}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={`0 0 390 ${H}`} preserveAspectRatio="xMidYMax slice">
          <Defs>
            <LinearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.nightTop} />
              <Stop offset="0.55" stopColor={colors.nightMid} />
              <Stop offset="1" stopColor="#6B4C5A" />
            </LinearGradient>
            <RadialGradient id={`moon${uid}`} cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#FFF1C9" stopOpacity="0.55" />
              <Stop offset="1" stopColor="#FFF1C9" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id={`hill${uid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#5A4551" />
              <Stop offset="1" stopColor="#3E3030" />
            </LinearGradient>
          </Defs>
          <Path d={`M0 0H390V${H}H0Z`} fill={`url(#sky${uid})`} />
          {stars.map(([x, y, r, c], i) => (
            <Circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.9} />
          ))}
          {sky && (
            <>
              <Circle cx={316} cy={58} r={56} fill={`url(#moon${uid})`} />
              <Circle cx={316} cy={58} r={22} fill="#FFF1C9" />
              <Circle cx={308} cy={53} r={20} fill="#2F2640" opacity={0.0} />
            </>
          )}
          <Path
            d={`M0 ${H - 62} Q70 ${H - 100} 140 ${H - 70} T270 ${H - 76} T390 ${H - 84} V${H}H0Z`}
            fill={`url(#hill${uid})`}
          />
          {sky && (
            <G fill="#2F2624">
              <Path d={`M22 ${H - 40} L38 ${H - 100} L54 ${H - 40}Z`} />
              <Path d={`M44 ${H - 40} L62 ${H - 118} L80 ${H - 40}Z`} />
              <Path d={`M66 ${H - 40} L80 ${H - 92} L94 ${H - 40}Z`} />
            </G>
          )}
          <Path
            d={`M0 ${H - 34} Q90 ${H - 62} 190 ${H - 40} T390 ${H - 46} V${H}H0Z`}
            fill="#2F2624"
          />
          {sky && (
            <G>
              <Circle cx={118} cy={H - 56} r={6} fill="#F1C45B" opacity={0.18} />
              <Circle cx={118} cy={H - 56} r={2} fill="#F8D677" />
              <Circle cx={248} cy={H - 70} r={6} fill="#F1C45B" opacity={0.18} />
              <Circle cx={248} cy={H - 70} r={2} fill="#F8D677" />
              <Circle cx={196} cy={H - 48} r={5} fill="#F1C45B" opacity={0.16} />
              <Circle cx={196} cy={H - 48} r={1.6} fill="#F8D677" />
            </G>
          )}
          {/* the scoop that melts the banner into the page */}
          <Path
            d={`M0 ${H - 16} Q100 ${H - 34} 200 ${H - 20} T390 ${H - 24} V${H}H0Z`}
            fill={colors.bg}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.nightTop,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
});

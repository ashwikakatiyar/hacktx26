import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";
import { colors } from "@/lib/theme";

// The night-sky banner at the top of every main screen. "sky" adds the moon and pines (home).
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
  const sky = variant === "sky";
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 14, minHeight }, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={sky ? "0 0 390 214" : "0 0 390 150"} preserveAspectRatio="xMidYMax slice">
          {sky ? (
            <>
              <Circle cx={40} cy={38} r={2} fill="#F2D27A" />
              <Circle cx={120} cy={22} r={1.5} fill="#fff" />
              <Circle cx={210} cy={46} r={2} fill="#F2D27A" />
              <Circle cx={300} cy={24} r={1.5} fill="#fff" />
              <Circle cx={352} cy={70} r={2} fill="#F2D27A" />
              <Circle cx={82} cy={84} r={1.5} fill="#fff" />
              <Circle cx={262} cy={96} r={1.5} fill="#fff" />
              <Circle cx={318} cy={48} r={20} fill="#F7E7B0" />
              <Circle cx={310} cy={44} r={18} fill={colors.night} />
              <Path d="M0 170 Q60 130 120 164 T250 156 T390 150 V214 H0Z" fill={colors.night2} />
              <Path d="M0 192 Q80 164 170 188 T390 182 V214 H0Z" fill={colors.night3} />
              <G fill={colors.night3}>
                <Path d="M24 192 L38 150 L52 192Z" />
                <Path d="M48 192 L64 138 L80 192Z" />
                <Path d="M330 188 L346 146 L362 188Z" />
              </G>
            </>
          ) : (
            <>
              <Circle cx={330} cy={30} r={1.8} fill="#F2D27A" />
              <Circle cx={360} cy={70} r={1.5} fill="#fff" />
              <Circle cx={250} cy={20} r={1.5} fill="#fff" />
              <Circle cx={60} cy={100} r={1.5} fill="#F2D27A" />
              <Circle cx={290} cy={64} r={1.5} fill="#fff" />
              <Path d="M0 140 Q80 112 170 136 T390 128 V150 H0Z" fill={colors.night2} />
            </>
          )}
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.night, paddingHorizontal: 20, paddingBottom: 22, overflow: "hidden" },
});

import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Icon, type IconName } from "@/components/Icon";
import { Text } from "@/components/Text";
import { decorative } from "@/lib/a11y";
import { cardSurface, colors, fonts, radius, shadow } from "@/lib/theme";

// ---------- Leaf sprig: the little green flourish from the mockups ----------
export function Sprig({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 30 36" {...decorative}>
      <Path d="M15 34 C15 24 14 16 15 4" stroke="#7E9A7A" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M15 14 C8 14 5 9 5 5 C10 5 14 8 15 14Z" fill="#9DB896" />
      <Path d="M15 22 C22 22 26 17 26 12 C20 12 16 16 15 22Z" fill="#8AAA86" />
      <Path d="M15 28 C9 28 6 24 6 20 C11 20 14 23 15 28Z" fill="#A9C2A1" />
    </Svg>
  );
}

// ---------- Round back button ----------
export function BackButton({
  onPress,
  onDark = false,
  icon = "chevron-left",
  label = "Back",
}: {
  onPress?: () => void;
  onDark?: boolean;
  icon?: IconName;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.navigate("/")))}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.back,
        onDark && styles.backOnDark,
        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
      ]}
    >
      <Icon name={icon} size={22} color={colors.ink} strokeWidth={2.4} />
    </Pressable>
  );
}

// ---------- Header for light screens (add idea, invite, planner...) ----------
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backIcon,
  sprig = true,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backIcon?: IconName;
  sprig?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <BackButton onPress={onBack} icon={backIcon} />
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {title}
        </Text>
        {sprig && (
          <View style={{ marginTop: 6 }}>
            <Sprig size={32} />
          </View>
        )}
      </View>
      {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
    </View>
  );
}

// ---------- Section heading ----------
export function SectionTitle({
  children,
  action,
  onAction,
}: {
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {children}
      </Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------- Parchment card ----------
export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---------- Buttons ----------
type ButtonVariant = "primary" | "gold" | "ghost" | "dark";
export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled,
  loading,
  style,
  flex,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
}) {
  const fg =
    variant === "primary" || variant === "dark"
      ? "#fff"
      : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.btn,
        variant === "primary" && styles.btnPrimary,
        variant === "gold" && styles.btnGold,
        variant === "ghost" && styles.btnGhost,
        variant === "dark" && styles.btnDark,
        flex && { flex: 1 },
        disabled && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : icon ? (
        <Icon name={icon} size={18} color={fg} strokeWidth={2.4} />
      ) : null}
      <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

// ---------- Selectable chip ----------
export function Chip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipOn,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {selected ? <Icon name="check" size={14} color="#fff" strokeWidth={3} /> : null}
      <Text style={[styles.chipText, selected && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

// ---------- Small status pill ----------
export function Pill({
  label,
  bg = colors.accentSoft,
  fg = colors.ink,
  icon,
}: {
  label: string;
  bg?: string;
  fg?: string;
  icon?: IconName;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      {icon ? <Icon name={icon} size={12} color={fg} strokeWidth={3} /> : null}
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  backOnDark: { borderColor: "transparent" },

  header: { paddingHorizontal: 20, paddingBottom: 14, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.4,
  },
  headerSub: { fontSize: 15, fontWeight: "600", lineHeight: 21, color: colors.muted },

  sectionRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.display, fontSize: 24, fontWeight: "600", color: colors.ink, letterSpacing: -0.2 },
  sectionAction: { fontSize: 14, fontWeight: "800", color: colors.accent },

  card: { ...cardSurface, padding: 16 },

  btn: {
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: { backgroundColor: colors.accent },
  btnGold: { backgroundColor: colors.gold },
  btnGhost: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.lineStrong },
  btnDark: { backgroundColor: colors.night },
  btnText: { fontSize: 16, fontWeight: "800" },

  chip: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 14, fontWeight: "700", color: colors.ink },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  pillText: { fontSize: 12, fontWeight: "800" },
});

import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/Icon";
import { useFairy } from "@/lib/fairy";
import { colors } from "@/lib/theme";

type Tab = { href: "/" | "/village" | "/pixie" | "/profile"; label: string; icon: IconName };

// Bottom bar: Home, Village, a raised gold "add an idea" button, your fairy, Profile.
// It reads the current route from expo-router instead of relying on navigator props, so it works across SDK changes.
export function AppTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const fairy = useFairy();

  const left: Tab[] = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/village", label: "Village", icon: "village" },
  ];
  const right: Tab[] = [
    { href: "/pixie", label: fairy.name, icon: "fairy" },
    { href: "/profile", label: "Profile", icon: "profile" },
  ];

  const renderTab = (t: Tab) => {
    const focused = pathname === t.href;
    const color = focused ? colors.accent : colors.muted;
    return (
      <Pressable key={t.href} onPress={() => router.navigate(t.href)} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={t.label} style={styles.tab}>
        <Icon name={t.icon} size={24} color={color} />
        <Text style={[styles.label, { color, fontWeight: focused ? "800" : "700" }]} numberOfLines={1}>
          {t.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {left.map(renderTab)}
      <Pressable onPress={() => router.push("/add")} accessibilityRole="button" accessibilityLabel="Add an idea" style={styles.add}>
        <Icon name="sparkle" size={26} color={colors.ink} />
      </Pressable>
      {right.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingTop: 8, paddingHorizontal: 8, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: colors.line },
  tab: { width: 64, minHeight: 44, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 12, maxWidth: 64 },
  add: {
    width: 56,
    height: 56,
    marginTop: -26,
    borderRadius: 28,
    backgroundColor: colors.gold,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B2347",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});

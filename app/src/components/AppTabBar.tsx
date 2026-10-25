import { router, type Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/Icon";
import { colors } from "@/lib/theme";

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: "Home", icon: "home" },
  village: { label: "Village", icon: "village" },
  profile: { label: "Profile", icon: "profile" },
};

// Bottom bar: Home, Village, a raised gold "add an idea" button, Profile.
// When Pixie gets her own tab (Phase 5), add it between the gold button and Profile.
export function AppTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((r) => TABS[r.name]);
  const left = routes.filter((r) => r.name !== "profile");
  const right = routes.filter((r) => r.name === "profile");

  const renderTab = (route: (typeof routes)[number]) => {
    const meta = TABS[route.name];
    const focused = state.routes[state.index]?.key === route.key;
    const color = focused ? colors.accent : colors.muted;
    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    return (
      <Pressable key={route.key} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={meta.label} style={styles.tab}>
        <Icon name={meta.icon} size={24} color={color} />
        <Text style={[styles.label, { color, fontWeight: focused ? "800" : "700" }]}>{meta.label}</Text>
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
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingTop: 8, paddingHorizontal: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: colors.line },
  tab: { minWidth: 64, minHeight: 44, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 12 },
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

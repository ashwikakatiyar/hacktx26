import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/Icon";
import { colors } from "@/lib/theme";

type Tab = {
  href: "/" | "/village" | "/pixie" | "/profile";
  label: string;
  icon: IconName;
};

// Bottom bar: Home, Village, a raised gold "add an idea" button, your fairy, Profile.
// It reads the current route from expo-router instead of relying on navigator props, so it works across SDK changes.
export function AppTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const left: Tab[] = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/village", label: "Circles", icon: "village" },
  ];
  const right: Tab[] = [
    { href: "/pixie", label: "Pixie", icon: "fairy" },
    { href: "/profile", label: "Profile", icon: "profile" },
  ];

  const renderTab = (t: Tab) => {
    const focused = pathname === t.href;
    const color = focused ? colors.accentDeep : colors.muted;
    return (
      <Pressable
        key={t.href}
        onPress={() => router.navigate(t.href)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={t.label}
        style={styles.tab}
      >
        <View style={[styles.iconWrap, focused && styles.iconWrapOn]}>
          <Icon name={t.icon} size={23} color={color} strokeWidth={focused ? 2.3 : 2} />
        </View>
        <Text
          style={[styles.label, { color, fontWeight: focused ? "800" : "700" }]}
          numberOfLines={1}
        >
          {t.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {left.map(renderTab)}
      <Pressable
        onPress={() => router.push("/add")}
        accessibilityRole="button"
        accessibilityLabel="Add an idea"
        style={({ pressed }) => [styles.add, pressed && { transform: [{ scale: 0.95 }] }]}
      >
        <Icon name="plus" size={24} color={colors.ink} />
      </Pressable>
      {right.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    width: 68,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  iconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapOn: { backgroundColor: colors.accentSoft },
  label: { fontSize: 11.5, maxWidth: 68 },
  add: {
    width: 58,
    height: 58,
    marginTop: -28,
    borderRadius: 29,
    backgroundColor: colors.gold,
    borderWidth: 4,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
});

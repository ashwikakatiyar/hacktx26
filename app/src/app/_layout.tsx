import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.ink },
        headerTintColor: colors.accent,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: "The Village Table" }} />
      <Stack.Screen name="add" options={{ title: "Add an idea", presentation: "modal" }} />
      <Stack.Screen name="card/[id]" options={{ title: "Edit card" }} />
    </Stack>
  );
}

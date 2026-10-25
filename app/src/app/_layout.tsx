import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.ink },
          headerTintColor: colors.accent,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {/* Main app: Home, Village, Profile tabs. Each tab draws its own night-sky header. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="group/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="invite"
          options={{ title: "Invite a friend", presentation: "modal" }}
        />
        {/* Phase 1 screens, unchanged apart from the new palette. */}
        <Stack.Screen
          name="add"
          options={{ title: "Add an idea", presentation: "modal" }}
        />
        <Stack.Screen name="card/[id]" options={{ title: "Edit card" }} />
      </Stack>
    </>
  );
}

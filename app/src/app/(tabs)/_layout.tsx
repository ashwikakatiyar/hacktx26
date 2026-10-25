import { Redirect, Tabs } from "expo-router";
import { AppTabBar } from "@/components/AppTabBar";
import { FLAGS } from "@/lib/config";
import { session } from "@/mock/session";

export default function TabsLayout() {
  if (FLAGS.showOnboardingOnLaunch && !session.onboarded) return <Redirect href="/onboarding" />;
  return (
    <Tabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="village" options={{ title: "Village" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

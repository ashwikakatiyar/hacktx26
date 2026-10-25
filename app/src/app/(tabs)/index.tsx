import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { EventCard, GroupCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { Pixie } from "@/components/Pixie";
import { Text } from "@/components/Text";
import { SectionTitle } from "@/components/ui";
import { useLocalPlans } from "@/lib/plans";
import { greeting, plural } from "@/lib/dates";
import { useFairy } from "@/lib/fairy";
import { cardSurface, colors } from "@/lib/theme";
import { EVENTS, GROUPS, IDEAS, ME, PIXIE_NEW_IDEAS, ideasForGroup } from "@/mock/data";

export default function Home() {
  const { name: fairy } = useFairy();
  const localPlans = useLocalPlans();
  const openGroup = (id: number) =>
    router.push({ pathname: "/group/[id]", params: { id: String(id) } });
  const openEvent = (id: string) =>
    router.push({ pathname: "/event/[id]", params: { id } });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greeting}>
        <View style={styles.pixie} pointerEvents="none"><Pixie size={58} /></View>
        <View style={styles.hello}>
          <Text style={styles.kicker}>{greeting()}</Text>
          <Text style={styles.h1}>Hello, {ME.name}</Text>
          <Text style={styles.sub}>A little adventure is waiting.</Text>
        </View>
      </View>

      <View style={styles.main}>
        <Pressable
          onPress={() => router.navigate("/pixie")}
          accessibilityRole="button"
          style={({ pressed }) => [styles.banner, pressed && { opacity: 0.9 }]}
        >
          <Icon name="sparkle" size={17} color={colors.ink} />
          <Text style={styles.bannerText}>
            {fairy} found {plural(PIXIE_NEW_IDEAS, "new idea")} for your circles.
          </Text>
          <Icon name="chevron-right" size={16} color={colors.ink} strokeWidth={2.4} />
        </Pressable>

        <View>
          <SectionTitle action="See all" onAction={() => router.navigate("/profile")}>
            Plans in the stars
          </SectionTitle>
          <View style={styles.list}>
            {localPlans.map((plan, index) => (
              <EventCard
                key={plan.id}
                compact
                event={{
                  id: Number(plan.id) || index,
                  title: plan.place,
                  groupId: plan.groupId,
                  priceLevel: plan.price,
                  activityType: IDEAS.find((idea) => idea.name === plan.place)?.activityType ?? "other",
                  address: plan.address,
                  imageUrl: null,
                  startsAt: new Date(plan.date),
                  status: "confirmed",
                }}
                onPress={() => openEvent(`plan-${encodeURIComponent(plan.id)}`)}
              />
            ))}
            {EVENTS.map((event) => (
              <EventCard
                key={`event-${event.id}`}
                event={event}
                compact
                onPress={() => openEvent(`event-${event.id}`)}
              />
            ))}
            {localPlans.length === 0 && EVENTS.length === 0 ? (
              <Text style={styles.empty}>No plans yet. Choose an idea from one of your circles.</Text>
            ) : null}
          </View>
        </View>

        <View>
          <SectionTitle
            action="+ New circle"
            onAction={() => router.push({ pathname: "/invite", params: { mode: "circle" } })}
          >
            Your circles
          </SectionTitle>
          <View style={styles.list}>
            {GROUPS.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                ideaCount={ideasForGroup(group.id).length}
                onPress={() => openGroup(group.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 28 },
  greeting: { minHeight: 144, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  pixie: { width: 58, height: 80, alignItems: "center", justifyContent: "center" },
  hello: { flex: 1 },
  kicker: { fontSize: 10, color: colors.muted },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "600", color: colors.ink },
  sub: { fontSize: 13, color: colors.ink, marginTop: 4 },
  main: { paddingHorizontal: 20, gap: 20 },
  banner: { ...cardSurface, flexDirection: "row", alignItems: "center", gap: 8, minHeight: 54, paddingHorizontal: 12 },
  bannerText: { flex: 1, color: colors.ink, fontSize: 12 },
  list: { gap: 10 },
  empty: { color: colors.muted, fontSize: 13, paddingVertical: 10 },
});

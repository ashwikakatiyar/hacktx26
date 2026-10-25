import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ActivityArt } from "@/components/PlaceArt";
import { AvatarStack } from "@/components/Avatar";
import { AppTabBar } from "@/components/AppTabBar";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { BackButton, Button } from "@/components/ui";
import { useLocalPlans } from "@/lib/plans";
import { cardSurface, colors } from "@/lib/theme";
import { EVENTS, IDEAS, PEOPLE, groupById } from "@/mock/data";

export default function EventDetail() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const localPlans = useLocalPlans();
  const [attending, setAttending] = useState(false);
  let title = "";
  let type = "other";
  let address = "";
  let price = 1;
  let groupId = 0;
  let dateLabel = "";
  let source = "";

  if (id.startsWith("plan-")) {
    const planId = decodeURIComponent(id.slice(5));
    const plan = localPlans.find((item) => item.id === planId);
    if (plan) {
      title = plan.place;
      type = IDEAS.find((idea) => idea.name === plan.place)?.activityType ?? "other";
      address = plan.address;
      price = plan.price;
      groupId = plan.groupId;
      dateLabel = new Date(plan.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + " · " + plan.time;
      source = "Planned with " + plan.groupName;
    }
  } else if (id.startsWith("idea-")) {
    const idea = IDEAS.find((item) => item.id === Number(id.slice(5)));
    if (idea) {
      title = idea.name;
      type = idea.activityType;
      address = idea.address;
      price = idea.priceLevel ?? 1;
      groupId = idea.groupId;
      const group = groupById(idea.groupId);
      const person = idea.sourceBy ? PEOPLE[idea.sourceBy] : null;
      source = idea.source === "pixie" ? "Pixie’s pick" : "Found from " + (person?.name ?? "a friend") + "’s message" + (group ? " in " + group.name : "");
    }
  } else {
    const event = EVENTS.find((item) => item.id === Number(id.replace("event-", "")));
    if (event) {
      title = event.title;
      type = event.activityType;
      address = event.address;
      price = event.priceLevel ?? 1;
      groupId = event.groupId;
      dateLabel = event.startsAt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + " · " + event.startsAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      source = "Planned with " + (groupById(event.groupId)?.name ?? "your circle");
    }
  }

  const group = groupById(groupId);
  const members = group?.memberIds.map((memberId) => PEOPLE[memberId]).filter(Boolean) ?? [];
  if (!title) return <View style={styles.missing}><BackButton /><Text>We couldn’t find that activity.</Text></View>;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}><BackButton /><View style={{ flex: 1 }} /></View>
        <ActivityArt type={type} width="100%" height={130} large />
        <View style={styles.tags}>
          <Text style={styles.tag}>{"$".repeat(price) + " · " + (price === 1 ? "$10–$25" : price === 2 ? "$25–$50" : "$50+")}</Text>
          <Text style={styles.tag}>{type}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.address}>{address}</Text>
        {dateLabel ? <Text style={styles.date}>{dateLabel}</Text> : null}
        <Text style={styles.source}>{source}</Text>
        <Button label="Plan a date" onPress={() => router.push({ pathname: "/planner/[id]", params: { id: String(groupId) } })} />
        <View style={styles.attendCard}>
          <Pressable onPress={() => setAttending((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: attending }} style={styles.checkRow}>
            <View style={[styles.checkbox, attending && styles.checked]}>{attending && <Icon name="check" size={16} color="#fff" />}</View>
            <View><Text style={styles.attendTitle}>I’m in</Text><Text style={styles.small}>Tap to confirm you want to go</Text></View>
          </Pressable>
          <View style={styles.waiting}><Text style={styles.small}>Waiting on times from your circle</Text></View>
        </View>
        <View style={styles.coming}>
          <Text style={styles.section}>Who’s coming</Text>
          {members.length > 0 ? <AvatarStack people={members} size={34} max={5} borderColor={colors.bg} /> : null}
          <Text style={styles.small}>{attending ? "You and your circle" : "Your circle"}</Text>
        </View>
      </ScrollView>
      <AppTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 18, gap: 12 },
  top: { flexDirection: "row", alignItems: "center", minHeight: 44 },
  tags: { flexDirection: "row", gap: 8 },
  tag: { backgroundColor: "#DCE4C8", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, color: colors.ink, fontSize: 11 },
  title: { color: colors.ink, fontSize: 24, fontWeight: "600", marginTop: 2 },
  address: { color: colors.ink, fontSize: 12 },
  date: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  source: { color: colors.muted, fontSize: 11, marginTop: 2 },
  attendCard: { ...cardSurface, padding: 12, gap: 12 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: colors.accent, borderColor: colors.accent },
  attendTitle: { fontSize: 13, fontWeight: "800", color: colors.ink },
  small: { fontSize: 10, color: colors.muted, marginTop: 2 },
  waiting: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: colors.lineStrong, borderRadius: 10, paddingHorizontal: 10 },
  coming: { gap: 8, paddingTop: 2 },
  section: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  missing: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 20 },
});

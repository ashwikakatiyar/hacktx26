import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { EventCard, GroupCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { NightHeader } from "@/components/NightHeader";
import { PlaceArt } from "@/components/PlaceArt";
import { Pixie } from "@/components/Pixie";
import { Text } from "@/components/Text";
import { Pill, SectionTitle } from "@/components/ui";
import { useLocalPlans } from "@/lib/plans";
import { greeting, plural } from "@/lib/dates";
import { useFairy } from "@/lib/fairy";
import { cardSurface, colors, fonts, radius } from "@/lib/theme";
import {
  EVENTS,
  GROUPS,
  IDEAS,
  ME,
  PIXIE_NEW_IDEAS,
  ideasForGroup,
} from "@/mock/data";

// Home: confirmed plans, then your circles. Runs on mock data (src/mock/data.ts).
export default function Home() {
  const { name: fairy } = useFairy();
  const localPlans = useLocalPlans();
  const openGroup = (id: number) =>
    router.push({ pathname: "/group/[id]", params: { id: String(id) } });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <NightHeader variant="sky" minHeight={250}>
        <View style={styles.hello}>
          <Text style={styles.kicker}>{greeting()}</Text>
          <Text style={styles.h1}>Hello, {ME.name}</Text>
          <Text style={styles.sub}>A little adventure is waiting.</Text>
        </View>
        <View style={styles.pixie} pointerEvents="none">
          <Pixie size={104} />
        </View>
      </NightHeader>

      <View style={styles.main}>
        <Pressable
          onPress={() => openGroup(GROUPS[0].id)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.banner, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.bannerIcon}>
            <Icon name="sparkle" size={18} color={colors.ink} />
          </View>
          <Text style={styles.bannerText}>
            {fairy} found {plural(PIXIE_NEW_IDEAS, "new idea")} for you
          </Text>
          <Icon name="chevron-right" size={18} color={colors.ink} strokeWidth={2.6} />
        </Pressable>

        <View>
          <SectionTitle>Plans in the stars</SectionTitle>
          <View style={styles.list}>
            {localPlans.map((p) => {
              const type = IDEAS.find((i) => i.name === p.place)?.activityType ?? "other";
              return (
                <Pressable
                  key={p.id}
                  onPress={() => openGroup(p.groupId)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.planRow, pressed && { opacity: 0.95 }]}
                >
                  <PlaceArt type={type} size={92} seed={p.place} />
                  <View style={styles.planBody}>
                    <View style={styles.inline}>
                      <Pill label="Confirmed" icon="check" bg={colors.green} fg="#fff" />
                      <Text style={styles.price}>{"$".repeat(p.price)}</Text>
                    </View>
                    <Text style={styles.planTitle} numberOfLines={2}>
                      {p.place}
                    </Text>
                    <Text style={styles.planMeta} numberOfLines={1}>
                      {p.groupName} · {p.address}
                    </Text>
                    <View style={styles.inline}>
                      <Icon name="clock" size={13} color={colors.accent} strokeWidth={2.4} />
                      <Text style={styles.planWhen}>
                        {new Date(p.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {p.time}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            {EVENTS.length === 0 && localPlans.length === 0 ? (
              <Text style={styles.empty}>
                Nothing planned yet. Pick an idea from one of your circles and {fairy} will help set
                it up.
              </Text>
            ) : (
              EVENTS.map((e) => (
                <EventCard key={e.id} event={e} onPress={() => openGroup(e.groupId)} />
              ))
            )}
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
            {GROUPS.map((g) => (
              <GroupCard
                key={g.id}
                group={g}
                ideaCount={ideasForGroup(g.id).length}
                onPress={() => openGroup(g.id)}
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
  content: { paddingBottom: 40 },
  hello: { paddingRight: 124, paddingTop: 14 },
  kicker: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.goldSoft,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    opacity: 0.9,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "600",
    color: "#fff",
    marginTop: 2,
    letterSpacing: -0.6,
  },
  sub: { fontSize: 15, fontWeight: "600", lineHeight: 21, color: "#E8DEF7", marginTop: 4 },
  pixie: { position: "absolute", right: 22, top: 74 },
  main: { paddingHorizontal: 20, marginTop: -10, gap: 26 },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...cardSurface,
    borderColor: "#EBCB7C",
    backgroundColor: "#FFF6D9",
    borderRadius: radius.lg,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  bannerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: { flex: 1, fontSize: 15, fontWeight: "800", color: colors.ink, lineHeight: 20 },

  list: { gap: 12 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  planRow: { ...cardSurface, flexDirection: "row", gap: 14, padding: 12, borderRadius: 22 },
  planBody: { flex: 1, minWidth: 0, gap: 4, justifyContent: "center" },
  planTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
  },
  planMeta: { fontSize: 13, fontWeight: "600", color: colors.muted },
  planWhen: { fontSize: 13, fontWeight: "800", color: colors.accent },
  price: { fontSize: 15, fontWeight: "800", color: colors.green },
  empty: { fontSize: 14, fontWeight: "600", lineHeight: 20, color: colors.muted },
});

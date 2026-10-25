import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { PlaceArt } from "@/components/PlaceArt";
import { Pixie } from "@/components/Pixie";
import { Text } from "@/components/Text";
import { Button, Chip, ScreenHeader } from "@/components/ui";
import { PriceTag } from "@/components/CardView";
import { groupById, ideasForGroup, PEOPLE } from "@/mock/data";
import { confirmLocalPlan } from "@/lib/plans";
import { useFairy } from "@/lib/fairy";
import { cardSurface, colors, fonts } from "@/lib/theme";

const TIMES = ["12:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];

// Planner: pick an idea, a day and a time, see why it works, confirm. Demo availability for now.
export default function Planner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { name: fairy } = useFairy();
  const group = groupById(Number(id));
  const ideas = ideasForGroup(Number(id));
  const [selected, setSelected] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
      }),
    [],
  );
  const idea = ideas[selected];

  if (!group || !idea) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Find a time" subtitle="Add an idea to this circle first." />
        <View style={{ paddingHorizontal: 20 }}>
          <Button label="Go back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const names = group.memberIds.map((i) => PEOPLE[i]?.name).filter(Boolean);
  const others = names.filter((n) => n !== "Alex");
  const price = idea.priceLevel || 1;
  const chosen = dates[day].toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const confirm = () => {
    confirmLocalPlan({
      id: String(Date.now()),
      groupId: group.id,
      groupName: group.name,
      place: idea.name,
      address: idea.address,
      date: dates[day].toISOString(),
      time: TIMES[time],
      price,
    });
    if (Platform.OS === "web") {
      router.replace("/(tabs)");
      return;
    }
    Alert.alert("Plan confirmed!", "Your event is now on Home. This demo confirmation is stored in memory.", [
      { text: "See my plans", onPress: () => router.replace("/(tabs)") },
    ]);
  };

  const reasons = [
    { t: `Saved by your circle`, s: "One of the ideas in your pot" },
    { t: `${"$".repeat(price)} fits the budget`, s: "Priced for a friendly night out" },
    { t: `Planning with ${others.join(", ")}`, s: `${names.length} people in ${group.name}` },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="When can we go?" subtitle={`A little adventure with ${group.name}`} />

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.h2}>1 · Choose an idea</Text>
            <View style={{ gap: 8 }}>
              {ideas.map((item, i) => {
                const on = selected === i;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelected(i)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    style={[styles.option, on && styles.optionOn]}
                  >
                    <PlaceArt type={item.activityType} imageUrl={item.imageUrl} size={52} radius={12} seed={item.name} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.optionName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.inline}>
                        <PriceTag level={item.priceLevel} />
                        <Text style={styles.small}>· {item.activityType}</Text>
                      </View>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on && <Icon name="check" size={14} color="#fff" strokeWidth={3.2} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.h2}>2 · What day works?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {dates.map((d, i) => {
                const on = day === i;
                return (
                  <Pressable
                    key={i}
                    onPress={() => setDay(i)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={d.toDateString()}
                    style={[styles.dayTile, on && styles.dayTileOn]}
                  >
                    <Text style={[styles.dayWk, on && { color: "#fff" }]}>
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text style={[styles.dayNum, on && { color: "#fff" }]}>{d.getDate()}</Text>
                    <Text style={[styles.dayMo, on && { color: "#E8DEF7" }]}>
                      {d.toLocaleDateString("en-US", { month: "short" })}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={styles.small}>Demo availability: choose a day that works for your circle.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.h2}>3 · Pick a time</Text>
            <View style={styles.wrap}>
              {TIMES.map((t, i) => (
                <Chip key={t} label={t} selected={time === i} onPress={() => setTime(i)} />
              ))}
            </View>
          </View>

          <View style={[styles.card, styles.why]}>
            <View style={styles.whyHead}>
              <View style={styles.whyFairy}>
                <Pixie size={40} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.h2}>Why {fairy} likes this</Text>
                <Text style={styles.small}>
                  {idea.name} · {chosen} · {TIMES[time]}
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              {reasons.map((r) => (
                <View key={r.t} style={styles.reason}>
                  <View style={styles.tick}>
                    <Icon name="check" size={14} color="#fff" strokeWidth={3.2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reasonT}>{r.t}</Text>
                    <Text style={styles.small}>{r.s}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={styles.fine}>
              Live availability, dietary and accessibility checks aren’t connected yet.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button label="Confirm our plan" variant="gold" icon="check" onPress={confirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  body: { paddingHorizontal: 20, gap: 14 },
  card: { ...cardSurface, padding: 16, gap: 12 },
  h2: { fontFamily: fonts.display, fontSize: 20, fontWeight: "600", color: colors.ink, letterSpacing: -0.2 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  small: { fontSize: 13, fontWeight: "600", lineHeight: 18, color: colors.muted },
  fine: { fontSize: 12, fontWeight: "600", lineHeight: 17, color: colors.muted, fontStyle: "italic" },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  optionOn: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionName: { fontFamily: fonts.display, fontSize: 17, fontWeight: "600", color: colors.ink },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  radioOn: { backgroundColor: colors.accent, borderColor: colors.accent },

  dayTile: {
    width: 62,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  dayTileOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayWk: { fontSize: 12, fontWeight: "800", color: colors.muted, textTransform: "uppercase" },
  dayNum: { fontFamily: fonts.display, fontSize: 24, fontWeight: "600", color: colors.ink, lineHeight: 30 },
  dayMo: { fontSize: 12, fontWeight: "700", color: colors.muted },

  why: { backgroundColor: "#FFF6D9", borderColor: "#EBCB7C" },
  whyHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  whyFairy: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.nightMid,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: 6,
  },
  reason: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  tick: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.green, alignItems: "center", justifyContent: "center", marginTop: 1 },
  reasonT: { fontSize: 15, fontWeight: "800", color: colors.ink },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    boxShadow: "0 -6px 20px rgba(67,54,47,0.08)",
  },
});

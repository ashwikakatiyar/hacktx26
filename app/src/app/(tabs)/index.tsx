import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EventCard, GroupCard } from "@/components/Cards";
import { NightHeader } from "@/components/NightHeader";
import { Pixie } from "@/components/Pixie";
import { greeting, plural } from "@/lib/dates";
import { colors, fonts } from "@/lib/theme";
import { EVENTS, GROUPS, ME, PIXIE_NEW_IDEAS, ideasForGroup } from "@/mock/data";

// Home: confirmed plans, then your circles. Runs on mock data (src/mock/data.ts).
export default function Home() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <NightHeader variant="sky" minHeight={214}>
        <View style={styles.hello}>
          <Text style={styles.kicker}>{greeting()}</Text>
          <Text style={styles.h1}>Hello, {ME.name}</Text>
          <Text style={styles.sub}>Pixie found {plural(PIXIE_NEW_IDEAS, "new idea")} for your circles.</Text>
        </View>
        <View style={styles.pixie}>
          <Pixie size={104} />
        </View>
      </NightHeader>

      <View style={styles.main}>
        <View>
          <Text style={styles.h2}>Plans in the stars</Text>
          <View style={styles.list}>
            {EVENTS.length === 0 ? (
              <Text style={styles.empty}>Nothing planned yet. Pick an idea from one of your circles and Pixie will help set it up.</Text>
            ) : (
              EVENTS.map((e) => <EventCard key={e.id} event={e} onPress={() => router.push({ pathname: "/group/[id]", params: { id: String(e.groupId) } })} />)
            )}
          </View>
        </View>

        <View>
          <View style={styles.sectionHead}>
            <Text style={styles.h2}>Your circles</Text>
            <Pressable onPress={() => router.push({ pathname: "/invite", params: { mode: "circle" } })} accessibilityRole="button" style={styles.link}>
              <Text style={styles.linkText}>+ New circle</Text>
            </Pressable>
          </View>
          <View style={styles.list}>
            {GROUPS.map((g) => (
              <GroupCard key={g.id} group={g} ideaCount={ideasForGroup(g.id).length} onPress={() => router.push({ pathname: "/group/[id]", params: { id: String(g.id) } })} />
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
  hello: { paddingRight: 120, paddingTop: 16 },
  kicker: { fontSize: 13, fontWeight: "600", color: colors.onNight, letterSpacing: 1, textTransform: "uppercase" },
  h1: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36, fontWeight: "700", color: "#fff", marginTop: 4 },
  sub: { fontSize: 14, fontWeight: "600", lineHeight: 19, color: "#EDE7FA", marginTop: 8 },
  pixie: { position: "absolute", right: 20, top: 56 },
  main: { paddingHorizontal: 20, paddingTop: 22, gap: 22 },
  sectionHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  h2: { fontFamily: fonts.display, fontSize: 24, fontWeight: "700", color: colors.ink, marginBottom: 12 },
  link: { minHeight: 44, justifyContent: "center", marginTop: -12 },
  linkText: { fontSize: 14, fontWeight: "700", color: colors.accent },
  list: { gap: 12 },
  empty: { fontSize: 14, fontWeight: "600", lineHeight: 20, color: colors.muted },
});

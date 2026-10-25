import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { AvatarStack } from "@/components/Avatar";
import { IdeaCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { NightHeader } from "@/components/NightHeader";
import { useFairy } from "@/lib/fairy";
import { cardSurface, colors, fonts } from "@/lib/theme";
import { BackButton, Chip, SectionTitle } from "@/components/ui";
import { FREQUENCIES } from "@/mock/options";
import { PEOPLE, groupById, ideasForGroup } from "@/mock/data";

// Group page: friendship goals, an "ask Pixie" call to action, and every idea shared into the group.
export default function GroupPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = groupById(Number(id));
  const [freq, setFreq] = useState<number>(group?.freqDays ?? 14);
  const { name: fairy } = useFairy();

  if (!group) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>We couldn’t find that circle</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={styles.missingBtn}
        >
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const members = group.memberIds.map((m) => PEOPLE[m]).filter(Boolean);
  const ideas = ideasForGroup(group.id);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <NightHeader>
        <View style={styles.titleRow}>
          <BackButton onDark />
          <Text style={styles.h1} numberOfLines={2}>
            {group.name}
          </Text>
        </View>
        <View style={styles.peopleRow}>
          <AvatarStack
            people={members}
            size={44}
            border={2}
            borderColor={colors.nightMid}
            max={5}
          />
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/invite",
                params: { mode: "group", groupId: String(group.id) },
              })
            }
            accessibilityRole="button"
            style={styles.invite}
          >
            <Text style={styles.inviteText}>+ Invite a friend</Text>
          </Pressable>
        </View>
      </NightHeader>

      <View style={styles.main}>
        <View style={styles.goals}>
          <Text style={styles.h2}>Friendship goals</Text>
          <Text style={styles.label}>How often do we want to meet?</Text>
          <View style={styles.freqRow}>
            {FREQUENCIES.map((f) => (
              <Chip key={f.days} label={f.label} selected={freq === f.days} onPress={() => setFreq(f.days)} />
            ))}
          </View>
          <Text style={[styles.label, { marginTop: 2 }]}>What we’re into</Text>
          <View style={styles.tags}>
            {group.interests.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* The planner arrives in Phase 3. */}
        <Pressable
          onPress={() => router.push({ pathname: "/planner/[id]", params: { id: String(group.id) } })}
          accessibilityRole="button"
          style={styles.ask}
        >
          <Icon name="sparkle" size={28} color={colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.askTitle}>We should do something…</Text>
            <Text style={styles.askSub}>Ask {fairy} what to do</Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.ink} strokeWidth={2.6} />
        </Pressable>

        <View>
          <SectionTitle>Ideas in the pot</SectionTitle>
          <View style={styles.list}>
            {ideas.length === 0 ? (
              <Text style={styles.empty}>
                No ideas yet. Use the gold button on the Home tab to paste a
                message or screenshot, and pick this circle.
              </Text>
            ) : (
              ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -0.5,
  },
  peopleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  invite: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteText: { fontSize: 14, fontWeight: "800", color: colors.goldSoft },

  main: { paddingHorizontal: 20, paddingTop: 4, gap: 20 },
  goals: { ...cardSurface, padding: 16, gap: 10 },
  h2: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "600",
    color: colors.ink,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.muted },
  freqRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  freq: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  freqOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  freqText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center",
  },
  freqTextOn: { color: "#fff" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 13, fontWeight: "700", color: colors.ink },

  ask: {
    minHeight: 72,
    borderRadius: 22,
    backgroundColor: colors.gold,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    boxShadow: "0 4px 0 #D9A12E, 0 10px 20px rgba(217,161,46,0.25)",
  },
  askTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "600",
    color: colors.ink,
  },
  askSub: { fontSize: 13, fontWeight: "700", color: colors.ink },

  h2Plain: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
  },
  list: { gap: 12 },
  empty: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.muted,
  },

  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    backgroundColor: colors.bg,
  },
  missingTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
  },
  missingBtn: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  missingBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});

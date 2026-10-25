import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { EventCard } from "@/components/Cards";
import { Icon } from "@/components/Icon";
import { NightHeader } from "@/components/NightHeader";
import { SpendingChart } from "@/components/SpendingChart";
import { plural } from "@/lib/dates";
import { cardSurface, colors, fonts } from "@/lib/theme";
import { SectionTitle } from "@/components/ui";
import {
  EVENTS,
  GROUPS,
  ME,
  OWES,
  PEOPLE,
  SPENDING,
  VILLAGE_FRIENDS,
} from "@/mock/data";

const money = (n: number) => `$${n.toFixed(2)}`;

// Profile: your photo, confirmed plans, spending, and what you owe. Mock data for now; spending and
// owed amounts come from Nessie in Phase 4.
export default function Profile() {
  const [paid, setPaid] = useState<Set<number>>(new Set());
  const thisMonth = SPENDING.months[SPENDING.months.length - 1];
  const owes = OWES.filter((o) => !paid.has(o.id));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <NightHeader>
        <View style={styles.headRow}>
          <Avatar
            person={ME}
            size={80}
            border={3}
            borderColor={colors.gold}
          />
          <View style={styles.headBody}>
            <Text style={styles.h1}>{ME.name}</Text>
            <Text style={styles.headSub}>
              {plural(GROUPS.length, "circle")} ·{" "}
              {plural(VILLAGE_FRIENDS.length, "friend")}
            </Text>
            <Pressable
              onPress={() => router.navigate("/village")}
              accessibilityRole="link"
              style={styles.visit}
            >
              <Text style={styles.visitText}>Visit your village</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push("/onboarding")}
            accessibilityRole="button"
            accessibilityLabel="Edit your preferences"
            style={styles.gear}
          >
            <Icon name="gear" size={22} color={colors.goldSoft} />
          </Pressable>
        </View>
      </NightHeader>

      <View style={styles.main}>
        <View>
          <SectionTitle>Your confirmed plans</SectionTitle>
          <View style={styles.list}>
            {EVENTS.map((e) => (
              <EventCard key={e.id} event={e} compact />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Your spending</Text>
            <Text style={styles.muted}>{SPENDING.periodLabel}</Text>
          </View>
          <Text style={styles.thisMonth}>
            This month so far:{" "}
            <Text style={styles.thisMonthAmt}>${thisMonth.amount}</Text>
          </Text>
          <SpendingChart months={SPENDING.months} />
        </View>

        <View>
          <SectionTitle>What you owe</SectionTitle>
          <View style={styles.oweCard}>
            {owes.length === 0 ? (
              <Text style={styles.allSquare}>
                You’re all square. Nothing owed right now.
              </Text>
            ) : (
              owes.map((o, i) => {
                const person = PEOPLE[o.personId];
                return (
                  <View
                    key={o.id}
                    style={[styles.oweRow, i > 0 && styles.rule]}
                  >
                    <Avatar person={person} size={44} />
                    <View style={styles.oweBody}>
                      <Text style={styles.oweName}>{person.name}</Text>
                      <Text style={styles.oweWhy} numberOfLines={1}>
                        {o.why}
                      </Text>
                    </View>
                    <Text style={styles.oweAmt}>{money(o.amount)}</Text>
                    <Pressable
                      onPress={() => setPaid((s) => new Set(s).add(o.id))}
                      accessibilityRole="button"
                      accessibilityLabel={`Pay ${person.name} ${money(o.amount)}`}
                      style={styles.pay}
                    >
                      <Text style={styles.payText}>Pay</Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 28 },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 8,
  },
  headBody: { flex: 1 },
  h1: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headSub: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onNight,
    marginTop: 4,
  },
  visit: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  visitText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.goldSoft,
    textDecorationLine: "underline",
  },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  main: { paddingHorizontal: 20, paddingTop: 4, gap: 24 },
  h2: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
  },
  list: { gap: 12 },
  muted: { fontSize: 13, fontWeight: "700", color: colors.muted },

  card: {
    ...cardSurface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "600",
    color: colors.ink,
  },
  thisMonth: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 2,
    marginBottom: 6,
  },
  thisMonthAmt: { fontSize: 15, fontWeight: "800", color: colors.ink },

  oweCard: { ...cardSurface, paddingHorizontal: 16, paddingVertical: 4 },
  oweRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rule: { borderTopWidth: 1, borderTopColor: colors.lineSoft },
  oweBody: { flex: 1, minWidth: 0 },
  oweName: { fontSize: 15, fontWeight: "800", color: colors.ink },
  oweWhy: { fontSize: 13, fontWeight: "600", color: colors.muted },
  oweAmt: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "600",
    color: colors.ink,
  },
  pay: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  payText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  allSquare: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    paddingVertical: 14,
  },
});

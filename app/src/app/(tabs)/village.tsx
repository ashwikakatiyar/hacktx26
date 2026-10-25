import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { GhostCottage } from "@/components/Cottage";
import { CottagePlot, OpenPlotCell } from "@/components/CottagePlot";
import { Icon } from "@/components/Icon";
import { NightHeader } from "@/components/NightHeader";
import {
  COTTAGE_LABEL,
  VILLAGE,
  cottageState,
  type CottageState,
} from "@/lib/config";
import { agoLabel, daysAgoDate, plural, shortDate } from "@/lib/dates";
import { colors, fonts } from "@/lib/theme";
import { buildVillage, type VillageFriend } from "@/lib/village";
import { VILLAGE_FRIENDS } from "@/mock/data";

const BADGE_BG: Record<CottageState, string> = {
  thriving: colors.mint,
  weathered: colors.butter,
  "run-down": colors.rose,
};

// The village: one cottage per friend. The less you hang out, the more it weathers.
// Tap a cottage to see the outings you did together (never who else came along).
export default function Village() {
  const village = useMemo(() => buildVillage(VILLAGE_FRIENDS), []);
  const [selectedId, setSelectedId] = useState<number | null>(3); // Priya, so the detail card shows something on first open
  const selected = VILLAGE_FRIENDS.find((f) => f.id === selectedId) ?? null;
  const invite = () =>
    router.push({ pathname: "/invite", params: { mode: "plot" } });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
        <Text style={styles.h1}>Your village <Text style={{ fontSize: 23 }}>🌿</Text></Text>
        <Text style={styles.summary}>{village.summary}</Text>
      </View>

      <View style={styles.main}>
        <DetailCard friend={selected} />

        {village.rows.map((row) =>
          row.locked ? (
            <View key={row.index} style={styles.rowBox}>
              <RowTitle title={row.title} sub={row.sub} />
              <View style={styles.cells}>
                {[0, 1, 2, 3].map((k) => (
                  <View key={k} style={styles.ghost}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 20, color: colors.ink }}>+</Text></View><Text style={{ fontSize: 10, color: colors.muted }}>Locked</Text>
                  </View>
                ))}
              </View>
              <View style={styles.lock}>
                
                <Text style={styles.lockText}>{row.lockText}</Text>
              </View>
            </View>
          ) : (
            <View key={row.index} style={styles.rowBox}>
              <RowTitle title={row.title} sub={row.sub} />
              <View style={styles.cells}>
                {row.cells.map((cell, k) =>
                  cell.kind === "friend" ? (
                    <CottagePlot
                      key={cell.friend.id}
                      friend={cell.friend}
                      state={cell.state}
                      selected={cell.friend.id === selectedId}
                      onPress={() =>
                        setSelectedId(
                          cell.friend.id === selectedId ? null : cell.friend.id,
                        )
                      }
                    />
                  ) : (
                    <OpenPlotCell
                      key={`open-${row.index}-${k}`}
                      onPress={invite}
                    />
                  ),
                )}
              </View>
            </View>
          ),
        )}

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>How cottages age</Text>
          <Text style={styles.legendLine}>
            <Text style={styles.bold}>Thriving</Text> · you hung out in the last{" "}
            {plural(VILLAGE.thrivingMaxDays / 7, "week")}
          </Text>
          <Text style={styles.legendLine}>
            <Text style={styles.bold}>Weathered</Text> · vines are creeping in,{" "}
            {VILLAGE.thrivingMaxDays / 7} to {VILLAGE.weatheredMaxDays / 7}{" "}
            weeks apart
          </Text>
          <Text style={styles.legendLine}>
            <Text style={styles.bold}>Run-down</Text> · over{" "}
            {VILLAGE.weatheredMaxDays / 7} weeks. Plan something to rebuild it!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function RowTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.rowHead}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSub}>{sub}</Text>
    </View>
  );
}

function DetailCard({ friend }: { friend: VillageFriend | null }) {
  if (!friend) {
    return (
      <View style={styles.detail}>
        <Text style={styles.detailEmptyTitle}>Tap a friend’s photo</Text>
        <Text style={styles.detailEmptySub}>
          See the hangouts the two of you have shared.
        </Text>
      </View>
    );
  }
  const state = cottageState(friend.daysSince);
  return (
    <View style={styles.detail}>
      <View style={styles.detailHead}>
        <Avatar person={friend} size={52} />
        <View style={styles.detailWho}>
          <Text style={styles.detailName}>{friend.name}</Text>
          <Text style={styles.detailMeta}>
            {plural(friend.hangoutCount, "hangout")} · last together {agoLabel(friend.daysSince)}
          </Text>
        </View>
      </View>

      <View style={styles.outings}>
        {friend.outings.length === 0 ? (
          <Text style={styles.detailMeta}>
            No hangouts yet. Plan the first one!
          </Text>
        ) : (
          friend.outings.map((o) => (
            <View key={o.id} style={styles.outing}>
              
              <View style={styles.outingBody}>
                <Text style={styles.outingName} numberOfLines={1}>
                  {o.name}
                </Text>
                
              </View>
              <Text style={styles.outingDate}>
                {shortDate(daysAgoDate(o.daysAgo))}
              </Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.footnote}>
        Shows only the outings you did together.
      </Text>

      {/* Stand-in until the planner flow exists (Phase 3): opens the circle you share, where your saved ideas live. */}
      <Pressable
        onPress={() =>
          friend.sharedGroupId
            ? router.push({
                pathname: "/group/[id]",
                params: { id: String(friend.sharedGroupId) },
              })
            : router.push("/add")
        }
        accessibilityRole="button"
        style={styles.plan}
      >
        <Text style={styles.planText}>Plan a catch-up ›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 28 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  back: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  backText: { fontSize: 26, color: colors.ink, marginTop: -4 },
  h1: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "400",
    color: "#51443B",
    marginTop: 8,
  },
  summary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#51443B",
    marginTop: 3,
  },
  main: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },

  detail: {
    backgroundColor: "#FCF7EB",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 14,
    minHeight: 130,
  },
  detailEmptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
  },
  detailEmptySub: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.muted,
    marginTop: 4,
  },
  detailHead: { flexDirection: "row", alignItems: "flex-start", gap: 18 },
  detailWho: { flex: 1, minWidth: 0 },
  detailName: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "400",
    color: colors.ink,
  },
  detailMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 2,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: colors.ink },
  outings: { marginTop: 10 },
  outing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  outingBody: { flex: 1, minWidth: 0 },
  outingName: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  outingType: { fontSize: 12, fontWeight: "600", color: colors.muted },
  outingDate: { fontSize: 13, fontWeight: "800", color: colors.accent },
  footnote: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    color: colors.muted,
    marginTop: 6,
  },
  plan: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#FCF7EB",
    borderWidth: 1,
    borderColor: "#55483F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  planText: { fontSize: 15, fontWeight: "800", color: colors.ink },

  rowBox: {
    backgroundColor: "#DDE5CD",
    borderWidth: 1,
    borderColor: "#55483F",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    overflow: "hidden",
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  rowTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "400",
    color: colors.ink,
  },
  rowSub: { fontSize: 12, fontWeight: "700", color: colors.muted },
  cells: { flexDirection: "row", alignItems: "flex-start", minHeight: 118 },
  ghost: { flex: 1, alignItems: "center", paddingTop: 42, gap: 27 },
  lockedCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  plusMark: { fontSize: 18, color: colors.ink },
  lockedLabel: { fontSize: 10, color: colors.muted },
  lock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 14,
  },
  lockText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    color: colors.ink,
  },

  legend: {
    backgroundColor: "#FCF7EB",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 14,
    gap: 6,
  },
  legendTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 2,
  },
  legendLine: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    color: colors.ink,
  },
  bold: { fontWeight: "800" },
});

import { router } from "expo-router";
import { useId, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { Avatar } from "@/components/Avatar";
import { CottagePlot, OpenPlotCell, STATE_COLOR } from "@/components/CottagePlot";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { BackButton, Button, Sprig } from "@/components/ui";
import { COTTAGE_LABEL, VILLAGE, cottageState, type CottageState } from "@/lib/config";
import { agoLabel, daysAgoDate, plural, shortDate } from "@/lib/dates";
import { cardSurface, colors, fonts } from "@/lib/theme";
import { buildVillage, type VillageFriend } from "@/lib/village";
import { VILLAGE_FRIENDS } from "@/mock/data";
import { decorative } from "@/lib/a11y";

// The village: one cottage per friend. The less you hang out, the more it weathers.
// Tap a cottage to see the outings you did together (never who else came along).
export default function Village() {
  const insets = useSafeAreaInsets();
  const village = useMemo(() => buildVillage(VILLAGE_FRIENDS), []);
  const [selectedId, setSelectedId] = useState<number | null>(3); // Priya, so the detail card shows something on first open
  const selected = VILLAGE_FRIENDS.find((f) => f.id === selectedId) ?? null;
  const invite = () => router.push({ pathname: "/invite", params: { mode: "plot" } });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <BackButton />
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h1} accessibilityRole="header">
              Your village
            </Text>
            <Text style={styles.summary}>{village.summary}</Text>
          </View>
          <Sprig size={34} />
        </View>
      </View>

      <View style={styles.main}>
        <DetailCard friend={selected} />

        {village.rows.map((row) =>
          row.locked ? (
            <Scene key={row.index} locked>
              <RowTitle title={row.title} sub="Locked" locked />
              <View style={styles.cells}>
                {[0, 1, 2, 3].map((k) => (
                  <View key={k} style={styles.ghost}>
                    <View style={styles.lockedCircle}>
                      <Icon name="lock" size={14} color={colors.muted} strokeWidth={2.2} />
                    </View>
                    <View style={styles.lockedPad} />
                  </View>
                ))}
              </View>
              <View style={styles.lock}>
                <Icon name="lock" size={16} color={colors.ink} strokeWidth={2.2} />
                <Text style={styles.lockText}>{row.lockText}</Text>
              </View>
            </Scene>
          ) : (
            <Scene key={row.index}>
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
                        setSelectedId(cell.friend.id === selectedId ? null : cell.friend.id)
                      }
                    />
                  ) : (
                    <OpenPlotCell key={`open-${row.index}-${k}`} onPress={invite} />
                  ),
                )}
              </View>
            </Scene>
          ),
        )}

        <Legend />
      </View>
    </ScrollView>
  );
}

// A street of the village: grassy ground, a few flowers, and a winding path along the bottom.
function Scene({ children, locked = false }: { children: React.ReactNode; locked?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <View style={[styles.rowBox, locked && { opacity: 0.88 }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 350 220" preserveAspectRatio="xMidYMax slice" {...decorative}>
          <Defs>
            <LinearGradient id={`gr${uid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={locked ? "#E6E8E0" : "#E6EFD6"} />
              <Stop offset="1" stopColor={locked ? "#D5D9CD" : "#CFDFB8"} />
            </LinearGradient>
          </Defs>
          <Rect width={350} height={220} fill={`url(#gr${uid})`} />
          <Path d="M0 196 Q90 176 180 192 T350 184 V220 H0Z" fill={locked ? "#CCD1C3" : "#BFD3A4"} opacity={0.55} />
          {!locked && (
            <>
              <Circle cx={22} cy={60} r={2.2} fill="#F6DE9A" />
              <Circle cx={330} cy={72} r={2.2} fill="#F4C6D6" />
              <Circle cx={170} cy={40} r={1.8} fill="#fff" opacity={0.9} />
              <Circle cx={316} cy={174} r={2.4} fill="#F4C6D6" />
              <Circle cx={34} cy={178} r={2.4} fill="#F6DE9A" />
              <Circle cx={112} cy={188} r={2} fill="#fff" opacity={0.9} />
            </>
          )}
        </Svg>
      </View>
      {children}
    </View>
  );
}

function RowTitle({ title, sub, locked }: { title: string; sub: string; locked?: boolean }) {
  return (
    <View style={styles.rowHead}>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={[styles.subPill, locked && { backgroundColor: "rgba(255,251,240,0.6)" }]}>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
    </View>
  );
}

function StateBadge({ state }: { state: CottageState }) {
  const c = STATE_COLOR[state];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: c.dot }]} />
      <Text style={styles.badgeText}>{COTTAGE_LABEL[state]}</Text>
    </View>
  );
}

function DetailCard({ friend }: { friend: VillageFriend | null }) {
  if (!friend) {
    return (
      <View style={styles.detail}>
        <Text style={styles.detailEmptyTitle}>Tap a friend’s cottage</Text>
        <Text style={styles.detailEmptySub}>See the hangouts the two of you have shared.</Text>
      </View>
    );
  }
  const state = cottageState(friend.daysSince);
  return (
    <View style={styles.detail}>
      <View style={styles.detailHead}>
        <Avatar person={friend} size={56} border={3} borderColor={STATE_COLOR[state].ring} />
        <View style={styles.detailWho}>
          <View style={styles.nameRow}>
            <Text style={styles.detailName}>{friend.name}</Text>
            <StateBadge state={state} />
          </View>
          <Text style={styles.detailMeta}>
            {plural(friend.hangoutCount, "hangout")} · last together {agoLabel(friend.daysSince)}
          </Text>
        </View>
      </View>

      <View style={styles.outings}>
        {friend.outings.length === 0 ? (
          <Text style={styles.detailMeta}>No hangouts yet. Plan the first one!</Text>
        ) : (
          friend.outings.map((o) => (
            <View key={o.id} style={styles.outing}>
              <View style={styles.outingDot} />
              <Text style={styles.outingName} numberOfLines={1}>
                {o.name}
              </Text>
              <Text style={styles.outingDate}>{shortDate(daysAgoDate(o.daysAgo))}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.footnote}>Shows only the outings you did together.</Text>

      {/* Opens the circle you share, where your saved ideas live. */}
      <Button
        label="Plan a catch-up"
        onPress={() =>
          friend.sharedGroupId
            ? router.push({ pathname: "/group/[id]", params: { id: String(friend.sharedGroupId) } })
            : router.push("/add")
        }
        style={{ marginTop: 14 }}
      />
    </View>
  );
}

function Legend() {
  const rows: { s: CottageState; text: string }[] = [
    { s: "thriving", text: `You hung out in the last ${plural(VILLAGE.thrivingMaxDays / 7, "week")}` },
    {
      s: "weathered",
      text: `Vines are creeping in, ${VILLAGE.thrivingMaxDays / 7} to ${VILLAGE.weatheredMaxDays / 7} weeks apart`,
    },
    { s: "run-down", text: `Over ${VILLAGE.weatheredMaxDays / 7} weeks. Plan something to rebuild it!` },
  ];
  return (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>How cottages age</Text>
      {rows.map(({ s, text }) => (
        <View key={s} style={styles.legendRow}>
          <StateBadge state={s} />
          <Text style={styles.legendLine}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingBottom: 6, gap: 12 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  h1: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  summary: { fontSize: 15, fontWeight: "700", color: colors.muted, marginTop: 2 },
  main: { paddingHorizontal: 20, paddingTop: 10, gap: 16 },

  detail: { ...cardSurface, padding: 16, minHeight: 130 },
  detailEmptyTitle: { fontFamily: fonts.display, fontSize: 22, fontWeight: "600", color: colors.ink },
  detailEmptySub: { fontSize: 14, fontWeight: "600", lineHeight: 20, color: colors.muted, marginTop: 4 },
  detailHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  detailWho: { flex: 1, minWidth: 0, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  detailName: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, fontWeight: "600", color: colors.ink, letterSpacing: -0.3 },
  detailMeta: { fontSize: 13.5, fontWeight: "600", color: colors.muted },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: "800", color: colors.ink },
  outings: { marginTop: 12 },
  outing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  outingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lavender },
  outingName: { flex: 1, minWidth: 0, fontFamily: fonts.display, fontSize: 18, fontWeight: "600", color: colors.ink },
  outingDate: { fontSize: 13, fontWeight: "800", color: colors.accent },
  footnote: { fontSize: 12.5, fontWeight: "600", lineHeight: 17, color: colors.muted, marginTop: 4 },

  rowBox: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#C9D8B2",
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 12,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(67,54,47,0.07)",
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  rowTitle: { fontFamily: fonts.display, fontSize: 21, fontWeight: "600", color: colors.ink, letterSpacing: -0.2 },
  subPill: { backgroundColor: "rgba(255,251,240,0.75)", borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  rowSub: { fontSize: 11.5, fontWeight: "800", color: colors.muted },
  cells: { flexDirection: "row", alignItems: "flex-start", minHeight: 128 },
  ghost: { flex: 1, alignItems: "center", paddingTop: 6 },
  lockedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#B9BEB0",
    backgroundColor: "rgba(255,251,240,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockedPad: { width: 50, height: 16, borderRadius: 25, marginTop: 38, backgroundColor: "rgba(120,125,110,0.18)" },
  lock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginHorizontal: 8,
    padding: 12,
    backgroundColor: "rgba(255,251,240,0.7)",
    borderRadius: 14,
  },
  lockText: { flex: 1, fontSize: 14, fontWeight: "700", lineHeight: 19, color: colors.ink },

  legend: { ...cardSurface, padding: 16, gap: 10 },
  legendTitle: { fontFamily: fonts.display, fontSize: 21, fontWeight: "600", color: colors.ink, marginBottom: 2 },
  legendRow: { gap: 5, alignItems: "flex-start" },
  legendLine: { fontSize: 13.5, fontWeight: "600", lineHeight: 19, color: colors.muted },
});

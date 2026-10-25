import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Cottage } from "@/components/Cottage";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { COTTAGE_LABEL, type CottageState } from "@/lib/config";
import { colors } from "@/lib/theme";
import type { VillageFriend } from "@/lib/village";

// State colors, shared by the plots, the detail badge and the legend.
export const STATE_COLOR: Record<CottageState, { dot: string; bg: string; ring: string }> = {
  thriving: { dot: "#4F8F68", bg: "#CFE6D3", ring: "#7FBF98" },
  weathered: { dot: "#C48A1A", bg: "#F6E3A8", ring: "#E3B04B" },
  "run-down": { dot: "#B25560", bg: "#F2CBCE", ring: "#D98B92" },
};

// One plot in the village: the friend's profile photo on top, their cottage below, name and state underneath.
export function CottagePlot({
  friend,
  state,
  selected,
  onPress,
}: {
  friend: VillageFriend;
  state: CottageState;
  selected: boolean;
  onPress: () => void;
}) {
  const c = STATE_COLOR[state];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${friend.name}, ${COTTAGE_LABEL[state]} cottage. Show hangouts`}
      style={({ pressed }) => [styles.cell, selected && styles.cellOn, pressed && { opacity: 0.85 }]}
    >
      <Avatar
        person={friend}
        size={32}
        border={2.5}
        borderColor={selected ? colors.accent : c.ring}
        style={styles.photo}
      />
      <View style={styles.ground}>
        <View style={styles.shadow} />
        <Cottage state={state} width={74} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {friend.name}
      </Text>
      <View style={[styles.state, { backgroundColor: c.bg }]}>
        <View style={[styles.dot, { backgroundColor: c.dot }]} />
        <Text style={styles.stateText} numberOfLines={1}>
          {COTTAGE_LABEL[state]}
        </Text>
      </View>
    </Pressable>
  );
}

export function OpenPlotCell({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open plot. Invite a friend"
      style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.dashed}>
        <Icon name="plus" size={16} color={colors.accentDeep} strokeWidth={2.6} />
      </View>
      <View style={[styles.ground, { height: 56, justifyContent: "center" }]}>
        <View style={styles.emptyPlot} />
      </View>
      <Text style={styles.name}>Open plot</Text>
      <Text style={styles.invite}>Invite</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
    justifyContent: "flex-start",
    paddingVertical: 6,
    borderRadius: 16,
  },
  cellOn: { backgroundColor: "rgba(255, 251, 240, 0.7)", boxShadow: "0 2px 10px rgba(67,54,47,0.12)" },
  photo: { zIndex: 2, marginBottom: -2 },
  ground: { alignItems: "center", justifyContent: "flex-end", height: 76 },
  shadow: {
    position: "absolute",
    bottom: 4,
    width: 52,
    height: 9,
    borderRadius: 26,
    backgroundColor: "rgba(60, 80, 50, 0.22)",
  },
  name: { fontSize: 13, fontWeight: "800", color: colors.ink, marginTop: 2 },
  state: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999,
    maxWidth: "100%",
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  stateText: { fontSize: 10, fontWeight: "800", color: colors.ink, flexShrink: 1 },
  dashed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.accentDeep,
    backgroundColor: "rgba(255,251,240,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -2,
  },
  emptyPlot: {
    width: 50,
    height: 16,
    borderRadius: 25,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(90, 78, 153, 0.55)",
  },
  invite: { fontSize: 11, fontWeight: "800", color: colors.accentDeep, marginTop: 3 },
});

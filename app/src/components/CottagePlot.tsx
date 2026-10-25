import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Cottage, OpenPlot } from "@/components/Cottage";
import { COTTAGE_LABEL, type CottageState } from "@/lib/config";
import { colors } from "@/lib/theme";
import type { VillageFriend } from "@/lib/village";

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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${friend.name}, ${COTTAGE_LABEL[state]} cottage. Show hangouts`}
      style={styles.cell}
    >
      <Avatar
        person={friend}
        size={48}
        border={selected ? 4 : 2}
        borderColor={selected ? colors.gold : "#FFFFFF"}
        style={styles.photo}
      />
      <Cottage state={state} />
      <Text style={styles.name} numberOfLines={1}>
        {friend.name}
      </Text>
      <Text style={styles.state}>{COTTAGE_LABEL[state]}</Text>
    </Pressable>
  );
}

export function OpenPlotCell({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open plot. Invite a friend"
      style={styles.cell}
    >
      <View style={styles.dashed}>
        <Text style={styles.plus}>+</Text>
      </View>
      <OpenPlot />
      <Text style={styles.name}>Open plot</Text>
      <Text style={styles.state}>Invite a friend</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: "center", minWidth: 0 },
  photo: { marginBottom: 2, zIndex: 1 },
  name: { fontSize: 13, fontWeight: "800", color: colors.ink, marginTop: 4 },
  state: { fontSize: 11, fontWeight: "700", color: colors.muted },
  dashed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A98BE8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  plus: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.accent,
    marginTop: -2,
  },
});

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
        size={30}
        border={1}
        borderColor={colors.line}
        style={styles.photo}
      />
      <Cottage state={state} width={76} />
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
      <View style={{ height: 48 }} />
      <Text style={styles.name}>Open plot</Text>
      
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: "center", minWidth: 0, justifyContent: "flex-start" },
  photo: { marginBottom: 2, zIndex: 1 },
  name: { fontSize: 11, fontWeight: "600", color: colors.ink, marginTop: 4 },
  state: { fontSize: 9, fontWeight: "400", color: colors.muted },
  dashed: {
    width: 32,
    height: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
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

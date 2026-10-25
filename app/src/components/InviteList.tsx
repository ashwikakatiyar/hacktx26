import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { cardSurface, colors } from "@/lib/theme";
import type { Contact } from "@/mock/data";

// People you can add or invite. Shared by onboarding step 4 and the invite screen (group page, open plots).
export function InviteList({
  contacts,
  invited,
  onToggle,
}: {
  contacts: Contact[];
  invited: Set<number>;
  onToggle: (personId: number) => void;
}) {
  return (
    <View style={styles.card}>
      {contacts.map(({ person, onApp }, i) => {
        const on = invited.has(person.id);
        const label = onApp
          ? on
            ? "Added"
            : "Add"
          : on
            ? "Invited"
            : "Invite";
        return (
          <View key={person.id} style={[styles.row, i > 0 && styles.rule]}>
            <Avatar person={person} size={44} />
            <View style={styles.body}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.sub}>
                {onApp ? "Already on the app" : "In your contacts"}
              </Text>
            </View>
            <Pressable
              onPress={() => onToggle(person.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${label} ${person.name}`}
              style={[styles.btn, on && styles.btnOn]}
            >
              <Text style={[styles.btnText, on && styles.btnTextOn]}>
                {label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardSurface, paddingHorizontal: 16, paddingVertical: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rule: { borderTopWidth: 1, borderTopColor: colors.lineSoft },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: "800", color: colors.ink },
  sub: { fontSize: 13, fontWeight: "600", color: colors.muted },
  btn: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOn: { backgroundColor: colors.accent },
  btnText: { fontSize: 14, fontWeight: "800", color: colors.accent },
  btnTextOn: { color: "#fff" },
});

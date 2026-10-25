import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, AvatarStack } from "@/components/Avatar";
import { Icon } from "@/components/Icon";
import { PriceTag } from "@/components/CardView";
import { PlaceArt } from "@/components/PlaceArt";
import { whenLabel, plural } from "@/lib/dates";
import { colors, fonts } from "@/lib/theme";
import { PEOPLE, type EventItem, type Group, type Idea } from "@/mock/data";

// Confirmed plan: place art, status, price range, name, type and address, when.
export function EventCard({ event, compact = false, onPress }: { event: EventItem; compact?: boolean; onPress?: () => void }) {
  const size = compact ? 80 : 96;
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? "button" : undefined} style={styles.row}>
      <PlaceArt type={event.activityType} imageUrl={event.imageUrl} size={size} />
      <View style={styles.rowBody}>
        <View style={styles.inline}>
          {!compact && (
            <View style={styles.confirmed}>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          )}
          <PriceTag level={event.priceLevel} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {capitalize(event.activityType)} · {event.address}
        </Text>
        <Text style={styles.when}>{whenLabel(event.startsAt)}</Text>
      </View>
    </Pressable>
  );
}

// A circle (group): member photos, name, and how many ideas are waiting.
export function GroupCard({ group, ideaCount, onPress }: { group: Group; ideaCount: number; onPress: () => void }) {
  const members = group.memberIds.map((id) => PEOPLE[id]).filter(Boolean);
  const friends = members.length - 1; // not counting you
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${group.name}, ${plural(friends, "friend")}, ${plural(ideaCount, "idea")} brewing`}
      style={[styles.row, styles.groupRow]}
    >
      <AvatarStack people={members} size={40} max={4} />
      <View style={styles.groupBody}>
        <Text style={styles.title} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={styles.meta}>
          {plural(friends, "friend")} · {plural(ideaCount, "idea")} brewing
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.accent} strokeWidth={2.4} />
    </Pressable>
  );
}

const SOURCE_TAG = (idea: Idea): { label: string; bg: string } => {
  const who = idea.sourceBy ? PEOPLE[idea.sourceBy]?.name : null;
  switch (idea.source) {
    case "pixie":
      return { label: "Pixie’s pick", bg: colors.butter };
    case "screenshot":
      return { label: who ? `From ${who}’s screenshot` : "From a screenshot", bg: colors.tagLavender };
    case "chat":
      return { label: who ? `From ${who} in the chat` : "From the chat", bg: colors.tagLavender };
    default:
      return { label: who ? `From ${who}’s text` : "From a message", bg: colors.tagLavender };
  }
};

// An idea in a group's pot, with a tag showing where it came from.
export function IdeaCard({ idea, onPress }: { idea: Idea; onPress?: () => void }) {
  const tag = SOURCE_TAG(idea);
  const by = idea.sourceBy ? PEOPLE[idea.sourceBy] : null;
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? "button" : undefined} style={styles.row}>
      <PlaceArt type={idea.activityType} imageUrl={idea.imageUrl} size={88} />
      <View style={styles.rowBody}>
        <View style={styles.inline}>
          <View style={[styles.tag, { backgroundColor: tag.bg }]}>
            {by && <Avatar person={by} size={16} />}
            <Text style={styles.tagText} numberOfLines={1}>
              {tag.label}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {idea.name}
        </Text>
        <View style={styles.inline}>
          <PriceTag level={idea.priceLevel} />
          <Text style={styles.meta}>· {capitalize(idea.activityType)}</Text>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {idea.address}
        </Text>
      </View>
    </Pressable>
  );
}

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, padding: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 18 },
  rowBody: { flex: 1, minWidth: 0, gap: 3, justifyContent: "center" },
  inline: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  groupRow: { alignItems: "center", gap: 14, padding: 14 },
  groupBody: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.display, fontSize: 19, fontWeight: "700", color: colors.ink, lineHeight: 22 },
  meta: { fontSize: 13, fontWeight: "600", color: colors.muted },
  when: { fontSize: 13, fontWeight: "800", color: colors.accent },
  confirmed: { backgroundColor: colors.green, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2 },
  confirmedText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  tag: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2, maxWidth: "100%" },
  tagText: { fontSize: 12, fontWeight: "800", color: colors.ink, flexShrink: 1 },
});

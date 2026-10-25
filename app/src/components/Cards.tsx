import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, AvatarStack } from "@/components/Avatar";
import { Icon } from "@/components/Icon";
import { PriceTag } from "@/components/CardView";
import { ActivityArt } from "@/components/PlaceArt";
import { Text } from "@/components/Text";
import { whenLabel, plural } from "@/lib/dates";
import { useFairy } from "@/lib/fairy";
import { cardSurface, colors, fonts } from "@/lib/theme";
import { PEOPLE, type EventItem, type Group, type Idea } from "@/mock/data";

const pressed = ({ pressed }: { pressed: boolean }) =>
  pressed ? { transform: [{ scale: 0.985 }], opacity: 0.95 } : null;

// Confirmed plan: place art, status, price range, name, type and address, when.
export function EventCard({
  event,
  compact = false,
  onPress,
}: {
  event: EventItem;
  compact?: boolean;
  onPress?: () => void;
}) {
  const size = compact ? 48 : 56;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={(s) => [styles.row, pressed(s)]}
    >
      <ActivityArt type={event.activityType} size={size} height={compact ? 64 : 72} />
      <View style={[styles.rowBody, compact && styles.compactBody]}>
        <View style={styles.inline}>
          <Text style={styles.status}>Confirmed</Text>
          {!compact && <PriceTag level={event.priceLevel} />}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        {compact ? (
          <Text style={styles.when}>{whenLabel(event.startsAt)}</Text>
        ) : (
          <>
            <View style={styles.inline}>
              <Icon name="pin" size={13} color={colors.muted} strokeWidth={2.2} />
              <Text style={[styles.meta, { flex: 1 }]} numberOfLines={1}>
                {capitalize(event.activityType)} · {event.address}
              </Text>
            </View>
            <View style={styles.inline}>
              <Icon name="clock" size={13} color={colors.accent} strokeWidth={2.4} />
              <Text style={styles.when}>{whenLabel(event.startsAt)}</Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

// A circle (group): member photos, name, and how many ideas are waiting.
export function GroupCard({
  group,
  ideaCount,
  onPress,
}: {
  group: Group;
  ideaCount: number;
  onPress: () => void;
}) {
  const members = group.memberIds.map((id) => PEOPLE[id]).filter(Boolean);
  const friends = members.length - 1; // not counting you
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${group.name}, ${plural(friends, "friend")}, ${plural(ideaCount, "idea")} brewing`}
      style={(s) => [styles.row, styles.groupRow, pressed(s)]}
    >
      <AvatarStack people={members} size={38} max={3} borderColor={colors.card} />
      <View style={styles.groupBody}>
        <Text style={styles.title} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {plural(friends, "friend")} · ✦ {plural(ideaCount, "idea")} brewing
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.accent} strokeWidth={2.4} />
    </Pressable>
  );
}

const SOURCE_TAG = (idea: Idea, fairy: string): { label: string; bg: string } => {
  const who = idea.sourceBy ? PEOPLE[idea.sourceBy]?.name : null;
  switch (idea.source) {
    case "pixie":
      return { label: `${fairy}’s pick`, bg: colors.butter };
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
  const { name: fairy } = useFairy();
  const tag = SOURCE_TAG(idea, fairy);
  const by = idea.sourceBy ? PEOPLE[idea.sourceBy] : null;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={(s) => [styles.row, pressed(s)]}
    >
      <ActivityArt type={idea.activityType} size={52} height={64} />
      <View style={styles.rowBody}>
        <View style={[styles.tag, { backgroundColor: tag.bg }]}>
          {by && <Avatar person={by} size={16} />}
          <Text style={styles.tagText} numberOfLines={1}>
            {tag.label}
          </Text>
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
  row: {
    ...cardSurface,
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderRadius: 14,
  },
  rowBody: { flex: 1, minWidth: 0, gap: 2, justifyContent: "center" },
  compactBody: { gap: 1 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  groupRow: { alignItems: "center", gap: 12, padding: 10, minHeight: 70 },
  groupBody: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    lineHeight: 20,
  },
  meta: { fontSize: 11, fontWeight: "600", color: colors.muted },
  when: { fontSize: 11, fontWeight: "600", color: colors.muted },
  status: { fontSize: 10, color: colors.muted },
  ideas: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  ideasText: { fontSize: 13, fontWeight: "800", color: colors.ink },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.ink, flexShrink: 1 },
});

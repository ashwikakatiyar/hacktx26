import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Card } from "@/lib/api";
import { ACTIVITY_EMOJI, PLACEHOLDER_TINT, colors } from "@/lib/theme";

// The visual identity of the app: image, name, $-$$$$ range, activity type, address.
export function PriceTag({ level }: { level: number | null }) {
  if (level == null) return <Text style={styles.priceMissing}>$ ?</Text>;
  return (
    <Text style={styles.price}>
      {"$".repeat(level)}
      <Text style={styles.priceDim}>{"$".repeat(4 - level)}</Text>
    </Text>
  );
}

export function CardView({ card, onPress }: { card: Card; onPress?: () => void }) {
  const type = card.activity_type ?? "other";
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.card}>
      {card.image_url ? (
        <Image source={{ uri: card.image_url }} style={styles.image} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.image, styles.placeholder, { backgroundColor: PLACEHOLDER_TINT[type] ?? PLACEHOLDER_TINT.other }]}>
          <Text style={styles.emoji}>{ACTIVITY_EMOJI[type] ?? ACTIVITY_EMOJI.other}</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {card.name}
          </Text>
          <PriceTag level={card.price_level} />
        </View>
        <View style={styles.row}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {ACTIVITY_EMOJI[type] ?? ""} {type}
            </Text>
          </View>
          {card.rating != null && <Text style={styles.rating}>★ {card.rating.toFixed(1)}</Text>}
        </View>
        {card.address ? (
          <Text style={styles.address} numberOfLines={1}>
            {card.address}
          </Text>
        ) : null}
        {card.needs_review ? <Text style={styles.review}>Some details are missing. Tap to fill them in.</Text> : null}
        {card.shared_groups.length > 0 && (
          <Text style={styles.shared} numberOfLines={1}>
            Shared with {card.shared_groups.join(", ")}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: { width: "100%", height: 150 },
  placeholder: { alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 44 },
  body: { padding: 14, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 18, fontWeight: "700", color: colors.ink },
  price: { fontSize: 16, fontWeight: "700", color: colors.green },
  priceDim: { color: colors.line },
  priceMissing: { fontSize: 14, fontWeight: "700", color: colors.accent },
  chip: { backgroundColor: colors.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { color: colors.accent, fontWeight: "600", fontSize: 13, textTransform: "capitalize" },
  rating: { color: colors.muted, fontSize: 13 },
  address: { color: colors.muted, fontSize: 13 },
  review: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  shared: { color: colors.muted, fontSize: 12 },
});

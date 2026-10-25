import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "@/components/Icon";
import { PlaceArt } from "@/components/PlaceArt";
import { Text } from "@/components/Text";
import { Pill } from "@/components/ui";
import type { Card } from "@/lib/api";
import { ACTIVITY_EMOJI, cardSurface, colors, fonts } from "@/lib/theme";

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
      <PlaceArt
        type={type}
        imageUrl={card.image_url}
        width="100%"
        height={160}
        radius={0}
        seed={card.name}
      />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={2}>
            {card.name}
          </Text>
          <PriceTag level={card.price_level} />
        </View>
        <View style={styles.row}>
          <Pill label={`${ACTIVITY_EMOJI[type] ?? ""} ${capitalize(type)}`} bg={colors.accentSoft} fg={colors.accentDeep} />
          {card.rating != null && (
            <Text style={styles.rating}>★ {card.rating.toFixed(1)}</Text>
          )}
        </View>
        {card.address ? (
          <View style={styles.inline}>
            <Icon name="pin" size={14} color={colors.muted} strokeWidth={2.2} />
            <Text style={styles.address} numberOfLines={1}>
              {card.address}
            </Text>
          </View>
        ) : null}
        {card.needs_review ? (
          <Text style={styles.review}>Some details are missing. Tap to fill them in.</Text>
        ) : null}
        {card.shared_groups.length > 0 && (
          <Text style={styles.shared} numberOfLines={1}>
            Shared with {card.shared_groups.join(", ")}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const styles = StyleSheet.create({
  card: { ...cardSurface, overflow: "hidden" },
  body: { padding: 16, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  price: { fontSize: 17, fontWeight: "800", color: colors.green },
  priceDim: { color: "#C9BDAA" },
  priceMissing: { fontSize: 14, fontWeight: "800", color: colors.accent },
  rating: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  address: { flex: 1, color: colors.muted, fontSize: 14, fontWeight: "600" },
  review: { color: colors.accentDeep, fontSize: 13, fontWeight: "700" },
  shared: { color: colors.muted, fontSize: 13, fontWeight: "600" },
});

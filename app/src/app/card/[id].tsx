import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/ui";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { CardView } from "@/components/CardView";
import { api, type Card } from "@/lib/api";
import { ACTIVITY_EMOJI, ACTIVITY_TYPES, colors } from "@/lib/theme";

// Manual edit: the fallback when SerpApi finds nothing or gets the price wrong.
export default function EditCard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("other");
  const [price, setPrice] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCard(Number(id))
      .then((c) => {
        setCard(c);
        setName(c.name);
        setAddress(c.address ?? "");
        setImageUrl(c.image_url ?? "");
        setType(c.activity_type ?? "other");
        setPrice(c.price_level);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [id]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.updateCard(Number(id), {
        name: name.trim() || card?.name,
        address: address.trim() || null,
        image_url: imageUrl.trim() || null,
        activity_type: type,
        price_level: price,
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSaving(false);
    }
  };

  if (!card) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <ActivityIndicator color={colors.accent} />
        )}
      </View>
    );
  }

  const preview: Card = {
    ...card,
    name,
    address: address || null,
    image_url: imageUrl || null,
    activity_type: type,
    price_level: price,
    needs_review: false,
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader title="Edit card" subtitle="Fix anything Pixie missed." />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
      <CardView card={preview} />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Price</Text>
      <View style={styles.chips}>
        {[1, 2, 3, 4].map((p) => (
          <Pressable
            key={p}
            onPress={() => setPrice(p)}
            style={[styles.chip, price === p && styles.chipOn]}
          >
            <Text style={[styles.chipText, price === p && styles.chipTextOn]}>
              {"$".repeat(p)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Type</Text>
      <View style={styles.chips}>
        {ACTIVITY_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            style={[styles.chip, type === t && styles.chipOn]}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextOn]}>
              {ACTIVITY_EMOJI[t]} {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Street, city"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://…"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.save, saving && { opacity: 0.5 }]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? "Saving…" : "Save"}</Text>
      </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  label: { fontSize: 14, fontWeight: "700", color: colors.ink, marginTop: 10 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: {
    color: colors.ink,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  chipTextOn: { color: "#fff" },
  error: { color: "#B3261E", marginTop: 10, lineHeight: 20 },
  save: {
    marginTop: 22,
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { CardView } from "@/components/CardView";
import { Icon } from "@/components/Icon";
import { Button, Card, Chip, ScreenHeader } from "@/components/ui";
import { useFairy } from "@/lib/fairy";
import { api, type CreateResult, type Group } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

type Picked = { uri: string; base64: string; mime: string };

// Paste text or a screenshot -> card appears. This is the heart of the demo.
export default function AddIdea() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<Picked | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResult | null>(null);
  const { name: fairy } = useFairy();

  useEffect(() => {
    api
      .listGroups()
      .then(setGroups)
      .catch(() => {});
  }, []);

  const paste = async () => {
    setError(null);
    if (await Clipboard.hasImageAsync()) {
      const img = await Clipboard.getImageAsync({ format: "png" });
      if (img) {
        // img.data is already a data URI; the API accepts it as is.
        setImage({ uri: img.data, base64: img.data, mime: "image/png" });
        return;
      }
    }
    const s = await Clipboard.getStringAsync();
    if (s) setText(s);
    else
      Alert.alert("Nothing to paste", "Copy some text or a screenshot first.");
  };

  const pickScreenshot = async () => {
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Photos access needed",
        "Allow photo access in Settings to choose a screenshot.",
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (!asset.base64) {
      setError("Couldn't read that image. Try another one.");
      return;
    }
    // The picker re-encodes to JPEG when quality < 1.
    setImage({ uri: asset.uri, base64: asset.base64, mime: "image/jpeg" });
  };

  const toggleGroup = (id: number) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const canSubmit = !busy && (text.trim().length > 0 || image !== null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      setResult(
        await api.createCard({
          text: text.trim() || undefined,
          image_base64: image?.base64,
          mime_type: image?.mime,
          group_ids: selected.length ? selected : undefined,
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setText("");
    setImage(null);
    setResult(null);
    setError(null);
  };

  if (result) {
    const { card } = result;
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title={card.needs_review ? "Almost there" : "Ooh, shiny!"}
            subtitle={
              card.needs_review
                ? "We couldn’t find every detail. Check the price and address."
                : `${fairy} conjured a card for you.`
            }
            onBack={() => router.back()}
            backIcon="close"
          />
          <View style={styles.body}>
            <CardView card={card} />
            <View style={{ gap: 10, marginTop: 6 }}>
              {card.needs_review && (
                <Button
                  label="Edit details"
                  onPress={() => router.replace({ pathname: "/card/[id]", params: { id: String(card.id) } })}
                />
              )}
              <Button
                label="Done"
                variant={card.needs_review ? "ghost" : "primary"}
                onPress={() => router.back()}
              />
              <Button label="Add another" variant="ghost" onPress={reset} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Drop in an idea"
          subtitle={`Paste a message or a screenshot. ${fairy} does the rest.`}
          onBack={() => router.back()}
          backIcon="close"
        />
        <View style={styles.body}>
          <Card style={{ gap: 12 }}>
            <Text style={styles.label}>Paste a message</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="we should try Ramen Tatsu-Ya!"
              placeholderTextColor={colors.muted}
              multiline
            />
            <View style={styles.buttons}>
              <Button label="Paste" variant="ghost" icon="link" onPress={paste} flex />
              <Button label="Screenshot" variant="ghost" icon="plus" onPress={pickScreenshot} flex />
            </View>
            {image && (
              <View style={styles.preview}>
                <Image source={{ uri: image.uri }} style={styles.previewImg} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>Screenshot ready</Text>
                  <Pressable onPress={() => setImage(null)} hitSlop={10}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Card>

          {groups.length > 0 && (
            <Card style={{ gap: 12 }}>
              <Text style={styles.label}>Who’s thinking about it?</Text>
              <Text style={styles.hint}>Add it to a circle (optional)</Text>
              <View style={styles.chips}>
                {groups.map((g) => (
                  <Chip key={g.id} label={g.name} selected={selected.includes(g.id)} onPress={() => toggleGroup(g.id)} />
                ))}
              </View>
            </Card>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            label={busy ? (image ? "Reading your screenshot…" : "Finding the place…") : "Make a card"}
            variant="gold"
            icon={busy ? undefined : "sparkle"}
            loading={busy}
            disabled={!canSubmit}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 48 },
  body: { paddingHorizontal: 20, gap: 16 },
  label: { fontFamily: fonts.display, fontSize: 20, fontWeight: "600", color: colors.ink },
  hint: { fontSize: 13.5, fontWeight: "600", color: colors.muted, marginTop: -8 },
  input: {
    minHeight: 120,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.ink,
    textAlignVertical: "top",
  },
  buttons: { flexDirection: "row", gap: 10 },
  preview: { flexDirection: "row", alignItems: "center", gap: 14 },
  previewImg: { width: 72, height: 72, borderRadius: 14, backgroundColor: colors.lineSoft },
  previewTitle: { fontSize: 15, fontWeight: "800", color: colors.ink },
  remove: { color: colors.accent, fontWeight: "800", fontSize: 14, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  error: { color: "#A32A22", fontWeight: "700", lineHeight: 20 },
});

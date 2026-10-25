import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CardView } from "@/components/CardView";
import { api, type CreateResult, type Group } from "@/lib/api";
import { colors } from "@/lib/theme";

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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {card.needs_review ? "Almost there" : "Added to your ideas"}
        </Text>
        <CardView card={card} />
        {card.needs_review && (
          <Text style={styles.hint}>
            We couldn't find every detail for this one. Check the price and
            address.
          </Text>
        )}
        <View style={styles.buttons}>
          {card.needs_review && (
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={() =>
                router.replace({
                  pathname: "/card/[id]",
                  params: { id: String(card.id) },
                })
              }
            >
              <Text style={styles.btnPrimaryText}>Edit details</Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.btn,
              card.needs_review ? styles.btnGhost : styles.btnPrimary,
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={
                card.needs_review ? styles.btnGhostText : styles.btnPrimaryText
              }
            >
              Done
            </Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={reset}>
            <Text style={styles.btnGhostText}>Add another</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Paste a message or describe the idea</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="we should try Ramen Tatsu-Ya!"
        placeholderTextColor={colors.muted}
        multiline
      />

      <View style={styles.buttons}>
        <Pressable
          style={[styles.btn, styles.btnGhost, styles.flex]}
          onPress={paste}
        >
          <Text style={styles.btnGhostText}>Paste</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnGhost, styles.flex]}
          onPress={pickScreenshot}
        >
          <Text style={styles.btnGhostText}>Choose screenshot</Text>
        </Pressable>
      </View>

      {image && (
        <View style={styles.preview}>
          <Image
            source={{ uri: image.uri }}
            style={styles.previewImg}
            contentFit="cover"
          />
          <Pressable onPress={() => setImage(null)} hitSlop={10}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      )}

      {groups.length > 0 && (
        <>
          <Text style={[styles.label, { marginTop: 18 }]}>
            Add to a group (optional)
          </Text>
          <View style={styles.chips}>
            {groups.map((g) => {
              const on = selected.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  onPress={() => toggleGroup(g.id)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {g.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[
          styles.btn,
          styles.btnPrimary,
          !canSubmit && styles.disabled,
          { marginTop: 22 },
        ]}
        onPress={submit}
        disabled={!canSubmit}
      >
        {busy ? (
          <View style={styles.busy}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.btnPrimaryText}>
              {image ? "Reading your screenshot…" : "Finding the place…"}
            </Text>
          </View>
        ) : (
          <Text style={styles.btnPrimaryText}>Make a card</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 48, gap: 10 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 4,
  },
  label: { fontSize: 14, fontWeight: "700", color: colors.ink },
  input: {
    minHeight: 110,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: colors.ink,
    textAlignVertical: "top",
  },
  buttons: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 6 },
  flex: { flex: 1 },
  btn: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: colors.accent },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnGhost: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnGhostText: { color: colors.ink, fontWeight: "700", fontSize: 15 },
  disabled: { opacity: 0.45 },
  busy: { flexDirection: "row", alignItems: "center", gap: 10 },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  previewImg: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: colors.line,
  },
  remove: { color: colors.accent, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.greenSoft, borderColor: colors.green },
  chipText: { color: colors.ink, fontWeight: "600" },
  chipTextOn: { color: "#2F6B52" },
  error: { color: "#B3261E", marginTop: 12, lineHeight: 20 },
  hint: { color: colors.muted, lineHeight: 20 },
});

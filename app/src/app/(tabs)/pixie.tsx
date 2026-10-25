import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { Pixie } from "@/components/Pixie";
import { Text, TextInput } from "@/components/Text";
import { Button, ScreenHeader } from "@/components/ui";
import {
  DRESS_SWATCHES,
  HAIR_SWATCHES,
  SKIN_SWATCHES,
  WING_SWATCHES,
  setFairy,
  useFairy,
  type FairyLook,
} from "@/lib/fairy";
import { ME } from "@/mock/data";
import { cardSurface, colors, fonts } from "@/lib/theme";

// Preview appearance changes locally; apply them across the app on Save.
export default function PixieScreen() {
  const insets = useSafeAreaInsets();
  const saved = useFairy();
  const [name, setName] = useState(saved.name);
  const [look, setLook] = useState<FairyLook>(saved.look);
  const shownName = name.trim() || saved.name;

  const save = () => {
    setFairy({ name: shownName, look });
    router.navigate("/");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Make your fairy"
          subtitle="Dress them up. They’ll pop up with ideas all over the app."
          onBack={() => router.navigate("/")}
        />

        <View style={styles.body}>
          <View style={styles.stage}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>Where to tonight, {ME.name}?</Text>
            </View>
            <View style={styles.fairy} pointerEvents="none">
              <Pixie size={190} look={look} />
            </View>
          </View>

          <View style={styles.card}>
            <Swatches title="Wings" swatches={WING_SWATCHES} value={look.wing} onPick={(c) => setLook((l) => ({ ...l, wing: c }))} />
            <Swatches title="Dress" swatches={DRESS_SWATCHES} value={look.dress} onPick={(c) => setLook((l) => ({ ...l, dress: c }))} />
            <Swatches title="Hair" swatches={HAIR_SWATCHES} value={look.hair} onPick={(c) => setLook((l) => ({ ...l, hair: c }))} />
            <Swatches title="Skin tone" swatches={SKIN_SWATCHES} value={look.skin} onPick={(c) => setLook((l) => ({ ...l, skin: c }))} />
            <View style={{ gap: 8 }}>
              <Text style={styles.h2}>Name your fairy</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Pixie"
                placeholderTextColor={colors.muted}
                maxLength={16}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button label="Save my fairy" onPress={save} />
      </View>
    </KeyboardAvoidingView>
  );
}

function swatchInk(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  return r * 0.299 + g * 0.587 + b * 0.114 < 150 ? "#FFFFFF" : colors.ink;
}

function Swatches({
  title,
  swatches,
  value,
  onPick,
}: {
  title: string;
  swatches: { c: string; name: string }[];
  value: string;
  onPick: (c: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.h2}>{title}</Text>
      <View style={styles.swatchRow}>
        {swatches.map((s) => {
          const on = s.c === value;
          return (
            <Pressable
              key={s.c}
              onPress={() => onPick(s.c)}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              accessibilityState={{ selected: on }}
              style={[styles.swatchOuter, on && styles.swatchOuterOn]}
            >
              <View style={[styles.swatch, { backgroundColor: s.c }]}>
                {on && <Icon name="check" size={18} color={swatchInk(s.c)} strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 20 },
  body: { paddingHorizontal: 20, gap: 16 },
  h2: { fontFamily: fonts.display, fontSize: 19, fontWeight: "600", color: colors.ink },
  stage: { height: 260, backgroundColor: colors.bg, overflow: "hidden" },
  bubble: {
    position: "absolute",
    alignSelf: "center",
    top: 2,
    maxWidth: 220,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  bubbleText: { fontSize: 14, fontWeight: "800", color: colors.ink, lineHeight: 18 },
  fairy: { position: "absolute", left: 0, right: 0, top: 44, alignItems: "center" },
  card: { ...cardSurface, padding: 18, gap: 18 },
  swatchRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  swatchOuter: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: "transparent", alignItems: "center", justifyContent: "center" },
  swatchOuterOn: { borderColor: colors.accent },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: "rgba(67,54,47,0.25)", alignItems: "center", justifyContent: "center" },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  footer: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.bg },
});

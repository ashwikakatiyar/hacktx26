import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { Icon } from "@/components/Icon";
import { Pixie } from "@/components/Pixie";
import {
  DRESS_SWATCHES,
  HAIR_SWATCHES,
  WING_SWATCHES,
  setFairy,
  useFairy,
  type FairyLook,
} from "@/lib/fairy";
import { ME } from "@/mock/data";
import { colors, fonts } from "@/lib/theme";

// "Make your fairy": wing, dress and hair colors plus a name. Changes apply when you tap Save.
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.navigate("/")}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            style={styles.back}
          >
            <Icon
              name="chevron-left"
              size={22}
              color={colors.ink}
              strokeWidth={2.4}
            />
          </Pressable>
          <Text style={styles.h1}>Make your fairy</Text>
        </View>

        <View style={styles.stage}>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 350 330"
              preserveAspectRatio="xMidYMid slice"
            >
              <Circle cx={40} cy={40} r={2} fill="#F2D27A" />
              <Circle cx={120} cy={24} r={1.5} fill="#fff" />
              <Circle cx={300} cy={50} r={2} fill="#F2D27A" />
              <Circle cx={330} cy={130} r={1.5} fill="#fff" />
              <Circle cx={30} cy={150} r={1.5} fill="#fff" />
              <Circle cx={250} cy={20} r={1.5} fill="#fff" />
              <Path
                d="M0 270 Q80 236 170 262 T350 252 V330 H0Z"
                fill={colors.night2}
              />
              <Path
                d="M0 304 Q100 276 200 300 T350 292 V330 H0Z"
                fill={colors.night3}
              />
              <Path d="M262 306 V280" stroke="#1B3326" strokeWidth={6} />
              <Path d="M244 284 Q262 250 280 284Z" fill="#B8456B" />
              <Circle cx={256} cy={274} r={3} fill="#fff" />
              <Circle cx={268} cy={270} r={2.5} fill="#fff" />
            </Svg>
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Where to tonight, {ME.name}?</Text>
          </View>
          <View style={styles.fairy}>
            <Pixie size={240} look={look} />
          </View>
        </View>

        <Swatches
          title="Wings"
          swatches={WING_SWATCHES}
          value={look.wing}
          onPick={(c) => setLook((l) => ({ ...l, wing: c }))}
        />
        <Swatches
          title="Dress"
          swatches={DRESS_SWATCHES}
          value={look.dress}
          onPick={(c) => setLook((l) => ({ ...l, dress: c }))}
        />
        <Swatches
          title="Hair"
          swatches={HAIR_SWATCHES}
          value={look.hair}
          onPick={(c) => setLook((l) => ({ ...l, hair: c }))}
        />

        <View style={{ gap: 6 }}>
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
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={save}
          accessibilityRole="button"
          style={styles.save}
        >
          <Text style={styles.saveText}>Save my fairy</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
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
    <View>
      <Text style={[styles.h2, { marginBottom: 6 }]}>{title}</Text>
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
              style={[
                styles.swatch,
                {
                  backgroundColor: s.c,
                  borderWidth: on ? 4 : 2,
                  borderColor: on ? colors.accent : colors.line,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  stage: {
    height: 330,
    borderRadius: 24,
    backgroundColor: colors.night,
    overflow: "hidden",
  },
  bubble: {
    position: "absolute",
    left: 16,
    top: 16,
    maxWidth: 170,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleText: { fontSize: 14, fontWeight: "700", color: colors.ink },
  fairy: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 34,
    alignItems: "center",
  },
  swatchRow: { flexDirection: "row", gap: 12 },
  swatch: { width: 44, height: 44, borderRadius: 22 },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.bg,
  },
  save: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});

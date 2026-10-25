import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { InviteList } from "@/components/InviteList";
import { INVITE_LINK } from "@/lib/config";
import { cardSurface, colors, fonts } from "@/lib/theme";
import { Button, ScreenHeader } from "@/components/ui";
import { CONTACTS, groupById } from "@/mock/data";

// One invite screen, used by "+ Invite a friend" on the group page, open plots in the village, and "+ New circle" on home.
// Mock only: nothing is sent yet.
export default function Invite() {
  const { mode, groupId } = useLocalSearchParams<{
    mode?: string;
    groupId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const group = groupId ? groupById(Number(groupId)) : undefined;
  const [invited, setInvited] = useState<Set<number>>(new Set());
  const [circleName, setCircleName] = useState("");
  const [copied, setCopied] = useState(false);
  const isCircle = mode === "circle";

  const toggle = (id: number) =>
    setInvited((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const copyLink = async () => {
    await Clipboard.setStringAsync(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const heading = isCircle
    ? "Start a new circle"
    : group
      ? `Invite to ${group.name}`
      : "Fill an open plot";
  const lede = isCircle
    ? "Name it, then pick who to bring in."
    : "Every friend you add gets a cottage in your village.";

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={heading} subtitle={lede} onBack={() => router.back()} backIcon="close" />
        <View style={styles.body}>
        {isCircle && (
          <View style={styles.card}>
            <Text style={styles.label}>Name your circle</Text>
            <TextInput
              style={styles.input}
              value={circleName}
              onChangeText={setCircleName}
              placeholder="The Wild Oats"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
            />
          </View>
        )}

        <InviteList contacts={CONTACTS} invited={invited} onToggle={toggle} />

        <View style={styles.linkCard}>
          <Icon name="link" size={24} color={colors.accent} strokeWidth={2.2} />
          <Text style={styles.linkText}>
            Not in the list? Share an invite link on WhatsApp or text.
          </Text>
          <Pressable
            onPress={copyLink}
            accessibilityRole="button"
            style={[styles.darkBtn, copied && styles.darkBtnOn]}
          >
            <Text style={[styles.darkBtnText, copied && { color: colors.ink }]}>
              {copied ? "Copied" : "Copy link"}
            </Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
      >
        <Button label={isCircle ? "Create circle" : "Done"} onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  body: { paddingHorizontal: 20, gap: 16 },
  h1: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.ink,
  },
  lede: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
    color: colors.muted,
    marginTop: 4,
  },
  card: { ...cardSurface, padding: 16, gap: 8 },
  label: { fontSize: 14, fontWeight: "800", color: colors.ink },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    color: colors.ink,
  },
  darkBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
  },
  darkBtnOn: { backgroundColor: colors.mint },
  darkBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  footer: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.bg },
  primary: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: 17, fontWeight: "800", color: "#fff" },
});

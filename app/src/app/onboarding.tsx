import * as Clipboard from "expo-clipboard";
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
import { Icon } from "@/components/Icon";
import { InviteList } from "@/components/InviteList";
import { Pixie } from "@/components/Pixie";
import { MultiSelectField, SelectField } from "@/components/Select";
import { INVITE_LINK } from "@/lib/config";
import { useFairy } from "@/lib/fairy";
import { colors, fonts } from "@/lib/theme";
import { CONTACTS } from "@/mock/data";
import {
  ACCESSIBILITY,
  AGE_RANGES,
  DIETARY,
  DISTANCES,
  EXCLUSIVE,
  GENDERS,
  INTEREST_BUCKETS,
  TRANSPORT,
} from "@/mock/options";
import { session } from "@/mock/session";

const STEPS = 4;

// Four short steps. Everything here feeds the planner (diet, access, transport, distance, interests),
// so there are no fields we don't use. Nothing is saved yet: this is the mock phase.
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { name: fairy } = useFairy();
  const [step, setStep] = useState(0);

  // step 1: about you
  const [name, setName] = useState("Alex");
  const [age, setAge] = useState<string | null>("25–34");
  const [gender, setGender] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState<string | null>("10 mi");
  // step 2: getting around
  const [access, setAccess] = useState<string[]>([]);
  const [transport, setTransport] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);
  const [calendar, setCalendar] = useState(false);
  // step 3: interests
  const [interests, setInterests] = useState<Set<string>>(new Set());
  // step 4: people
  const [circleName, setCircleName] = useState("");
  const [invited, setInvited] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = <T,>(set: Set<T>, v: T) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  };

  const finish = () => {
    session.onboarded = true;
    router.replace("/");
  };
  const last = step === STEPS - 1;

  const copyLink = async () => {
    await Clipboard.setStringAsync(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityLabel={`Step ${step + 1} of ${STEPS}`}
        >
          {Array.from({ length: STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.seg,
                {
                  backgroundColor:
                    i < step
                      ? colors.accent
                      : i === step
                        ? colors.gold
                        : colors.lavender,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <>
            <View style={styles.introRow}>
              <Pixie size={64} />
              <View style={{ flex: 1 }}>
                <Text style={styles.h1}>Once upon a you…</Text>
                <Text style={styles.lede}>
                  I’m {fairy}. Tell me a little about yourself so I can find
                  your kind of adventures.
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="What should we call you?"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="words"
                />
              </View>
              <SelectField
                label="Age range"
                options={AGE_RANGES}
                value={age}
                onChange={setAge}
              />
              <SelectField
                label="Gender"
                options={GENDERS}
                value={gender}
                onChange={setGender}
              />
              <View style={styles.field}>
                <Text style={styles.label}>Where are you based?</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City or neighborhood"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <SelectField
                label="How far will you go for a good time?"
                options={DISTANCES}
                value={distance}
                onChange={setDistance}
              />
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.h1}>The fine print of magic</Text>
            <Text style={styles.lede}>
              Pick everything that applies. {fairy} will only suggest places
              that work for you and your friends.
            </Text>
            <View style={styles.card}>
              <MultiSelectField
                label="Accessibility needs"
                options={ACCESSIBILITY}
                value={access}
                onChange={setAccess}
                exclusive={EXCLUSIVE.accessibility}
              />
              <MultiSelectField
                label="How do you get around?"
                options={TRANSPORT}
                value={transport}
                onChange={setTransport}
              />
              <MultiSelectField
                label="Dietary needs"
                options={DIETARY}
                value={diet}
                onChange={setDiet}
                exclusive={EXCLUSIVE.dietary}
              />
            </View>
            <View style={styles.calendar}>
              <View style={styles.calIcon}>
                <Icon name="calendar" size={26} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.calTitle}>Link Google Calendar</Text>
                <Text style={styles.calSub}>
                  {calendar
                    ? `Connected. ${fairy} can see when you’re free.`
                    : `So ${fairy} knows when you’re free.`}
                </Text>
              </View>
              {/* Mock toggle. Real Google Calendar sync is a later upgrade. */}
              <Pressable
                onPress={() => setCalendar((c) => !c)}
                accessibilityRole="button"
                style={[styles.darkBtn, calendar && styles.darkBtnOn]}
              >
                <Text
                  style={[
                    styles.darkBtnText,
                    calendar && { color: colors.ink },
                  ]}
                >
                  {calendar ? "Connected" : "Connect"}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.h1}>What sparks your magic?</Text>
            <Text style={styles.lede}>
              Tap anything that sounds fun. You can change these any time.
            </Text>
            <View style={{ gap: 12 }}>
              {INTEREST_BUCKETS.map((b) => (
                <View key={b.title} style={styles.bucket}>
                  <View style={styles.bucketHead}>
                    <View style={[styles.dot, { backgroundColor: b.dot }]} />
                    <Text style={styles.bucketTitle}>{b.title}</Text>
                  </View>
                  <View style={styles.chips}>
                    {b.options.map((o) => {
                      const on = interests.has(o);
                      return (
                        <Pressable
                          key={o}
                          onPress={() => setInterests((s) => toggle(s, o))}
                          accessibilityRole="button"
                          accessibilityState={{ selected: on }}
                          style={[styles.chip, on && styles.chipOn]}
                        >
                          <Text
                            style={[styles.chipText, on && styles.chipTextOn]}
                          >
                            {o}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.h1}>Gather your people</Text>
            <Text style={styles.lede}>
              Adventures are better together. Invite the friends you want to
              plan with.
            </Text>
            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Name your first circle</Text>
                <TextInput
                  style={styles.input}
                  value={circleName}
                  onChangeText={setCircleName}
                  placeholder="The Wild Oats"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <InviteList
              contacts={CONTACTS}
              invited={invited}
              onToggle={(id) => setInvited((s) => toggle(s, id))}
            />
            <View style={styles.linkCard}>
              <Icon
                name="link"
                size={24}
                color={colors.accent}
                strokeWidth={2.2}
              />
              <Text style={styles.linkText}>
                Not in the list? Share an invite link on WhatsApp or text.
              </Text>
              <Pressable
                onPress={copyLink}
                accessibilityRole="button"
                style={[styles.darkBtn, copied && styles.darkBtnOn]}
              >
                <Text
                  style={[styles.darkBtnText, copied && { color: colors.ink }]}
                >
                  {copied ? "Copied" : "Copy link"}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
      >
        {step === 0 ? (
          <Pressable
            onPress={finish}
            accessibilityRole="button"
            style={styles.ghost}
          >
            <Text style={styles.ghostText}>Skip</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setStep((s) => s - 1)}
            accessibilityRole="button"
            style={styles.ghost}
          >
            <Text style={styles.ghostText}>Back</Text>
          </Pressable>
        )}
        <Pressable
          onPress={last ? finish : () => setStep((s) => s + 1)}
          accessibilityRole="button"
          style={[styles.primary, last && styles.primaryGold]}
        >
          {last && <Icon name="sparkle" size={20} color={colors.ink} />}
          <Text style={[styles.primaryText, last && { color: colors.ink }]}>
            {last ? "Enter the story" : "Next"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { paddingHorizontal: 22 },
  progress: { flexDirection: "row", gap: 6 },
  seg: { flex: 1, height: 6, borderRadius: 3 },
  content: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  introRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  h1: {
    fontSize: 32,
    lineHeight: 34,
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    padding: 16,
    gap: 16,
  },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "800", color: colors.ink },
  input: {
    height: 48,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },

  calendar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    padding: 14,
  },
  calIcon: {
    width: 48,
    height: 48,
    borderRadius: 11,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  calTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  calSub: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
    color: colors.muted,
    marginTop: 2,
  },
  darkBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
  },
  darkBtnOn: { backgroundColor: colors.mint },
  darkBtnText: { fontSize: 14, fontWeight: "800", color: colors.card },

  bucket: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  bucketHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 28, height: 28, borderRadius: 14 },
  bucketTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.ink,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  chipText: { fontSize: 14, fontWeight: "800", color: colors.ink },
  chipTextOn: { color: "#fff" },

  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: 15,
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

  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 10,
    backgroundColor: colors.bg,
  },
  ghost: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { fontSize: 16, fontWeight: "800", color: colors.accent },
  primary: {
    flex: 1,
    minHeight: 52,
    borderRadius: 11,
    backgroundColor: colors.accent,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryGold: { backgroundColor: colors.accent },
  primaryText: { fontSize: 17, fontWeight: "800", color: "#fff" },
});

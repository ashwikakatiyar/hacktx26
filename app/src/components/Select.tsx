import { useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { colors, fonts } from "@/lib/theme";

// Onboarding dropdowns. Tapping a field opens a bottom sheet of options.
//   SelectField      : pick one (age range, gender, distance)
//   MultiSelectField : pick several (accessibility, transportation, dietary), with an optional
//                      "exclusive" option such as "None right now" that clears the rest.

type FieldProps = { label: string; placeholder?: string; hint?: string };

export function SelectField({
  label,
  placeholder = "Choose one",
  hint,
  options,
  value,
  onChange,
}: FieldProps & {
  options: readonly string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Field
        label={label}
        hint={hint}
        display={value}
        placeholder={placeholder}
        onPress={() => setOpen(true)}
      />
      <Sheet visible={open} title={label} onClose={() => setOpen(false)}>
        {options.map((o) => (
          <OptionRow
            key={o}
            label={o}
            selected={o === value}
            onPress={() => {
              onChange(o);
              setOpen(false);
            }}
          />
        ))}
      </Sheet>
    </>
  );
}

export function MultiSelectField({
  label,
  placeholder = "Choose any that apply",
  hint,
  options,
  value,
  onChange,
  exclusive,
}: FieldProps & {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  exclusive?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (o: string) => {
    if (value.includes(o)) return onChange(value.filter((x) => x !== o));
    if (exclusive && o === exclusive) return onChange([o]);
    onChange([...value.filter((x) => x !== exclusive), o]);
  };
  const display =
    value.length === 0
      ? null
      : value.length <= 2
        ? value.join(", ")
        : `${value[0]}, ${value[1]} +${value.length - 2}`;
  return (
    <>
      <Field
        label={label}
        hint={hint}
        display={display}
        placeholder={placeholder}
        onPress={() => setOpen(true)}
      />
      <Sheet
        visible={open}
        title={label}
        onClose={() => setOpen(false)}
        footer="Done"
      >
        {options.map((o) => (
          <OptionRow
            key={o}
            label={o}
            selected={value.includes(o)}
            multi
            onPress={() => toggle(o)}
          />
        ))}
      </Sheet>
    </>
  );
}

function Field({
  label,
  hint,
  display,
  placeholder,
  onPress,
}: {
  label: string;
  hint?: string;
  display: string | null;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display ?? "not set"}`}
        accessibilityHint="Opens a list of options"
        style={({ pressed }) => [
          styles.input,
          pressed && { backgroundColor: colors.accentSoft },
        ]}
      >
        <Text
          style={[styles.value, !display && styles.placeholder]}
          numberOfLines={1}
        >
          {display ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={colors.accent} />
      </Pressable>
    </View>
  );
}

function OptionRow({
  label,
  selected,
  multi,
  onPress,
}: {
  label: string;
  selected: boolean;
  multi?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multi ? "checkbox" : "radio"}
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.option,
        pressed && { backgroundColor: colors.accentSoft },
      ]}
    >
      <Text style={[styles.optionText, selected && styles.optionTextOn]}>
        {label}
      </Text>
      <View
        style={[
          styles.mark,
          multi ? styles.markBox : styles.markDot,
          selected && styles.markOn,
        ]}
      >
        {selected && (
          <Icon name="check" size={16} color="#fff" strokeWidth={3} />
        )}
      </View>
    </Pressable>
  );
}

function Sheet({
  visible,
  title,
  onClose,
  footer,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  footer?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close"
      />
      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
      >
        <View style={styles.grabber} />
        <Text style={styles.sheetTitle}>{title}</Text>
        <ScrollView style={styles.list} bounces={false}>
          {children}
        </ScrollView>
        {footer ? (
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={styles.done}
          >
            <Text style={styles.doneText}>{footer}</Text>
          </Pressable>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "800", color: colors.ink },
  hint: { fontSize: 12, fontWeight: "600", color: colors.muted, marginTop: -2 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  value: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.ink },
  placeholder: { color: colors.muted, fontWeight: "600" },
  backdrop: { flex: 1, backgroundColor: "rgba(43,35,71,0.45)" },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    maxHeight: "70%",
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 6,
  },
  list: { flexGrow: 0 },
  option: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  optionText: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.ink },
  optionTextOn: { fontWeight: "800", color: colors.accent },
  mark: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  markDot: { borderRadius: 12 },
  markBox: { borderRadius: 7 },
  markOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  done: {
    marginTop: 12,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});

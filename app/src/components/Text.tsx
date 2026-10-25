import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from "react-native";
import { fonts } from "@/lib/theme";

// Drop-in replacements for react-native's Text and TextInput.
// Custom fonts have no real "bold" on native, so each weight maps to its own font file here.
// Styles keep using fontWeight as before; set fontFamily: fonts.display for headings.

const NUNITO: Record<string, string> = {
  "300": "Nunito_400Regular",
  "400": "Nunito_400Regular",
  "500": "Nunito_500Medium",
  "600": "Nunito_600SemiBold",
  "700": "Nunito_700Bold",
  "800": "Nunito_800ExtraBold",
  "900": "Nunito_900Black",
};
const FRAUNCES: Record<string, string> = {
  "300": "Fraunces_400Regular",
  "400": "Fraunces_400Regular",
  "500": "Fraunces_500Medium",
  "600": "Fraunces_600SemiBold",
  "700": "Fraunces_700Bold",
  "800": "Fraunces_700Bold",
  "900": "Fraunces_700Bold",
};

function resolve(style: StyleProp<TextStyle>): TextStyle {
  const flat = StyleSheet.flatten(style) ?? {};
  const w =
    flat.fontWeight === "normal" || flat.fontWeight == null
      ? "400"
      : flat.fontWeight === "bold"
        ? "700"
        : String(flat.fontWeight);
  const table = flat.fontFamily === fonts.display ? FRAUNCES : NUNITO;
  // Only remap our two logical families (or the default). Anything else is left alone.
  if (flat.fontFamily && flat.fontFamily !== fonts.display && flat.fontFamily !== fonts.body) {
    return {};
  }
  return { fontFamily: table[w] ?? table["400"], fontWeight: "normal" };
}

export function Text({ style, ...rest }: TextProps) {
  return <RNText {...rest} style={[style, resolve(style)]} />;
}

export function TextInput({ style, ...rest }: TextInputProps) {
  return <RNTextInput {...rest} style={[style, resolve(style)]} />;
}

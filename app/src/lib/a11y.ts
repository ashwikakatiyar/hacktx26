import { Platform } from "react-native";

// Props that hide a decorative SVG from screen readers.
// Android/iOS props are invalid DOM attributes on web (React logs errors), so web gets aria-hidden instead.
export const decorative: Record<string, unknown> =
  Platform.OS === "web"
    ? { "aria-hidden": true }
    : { accessibilityElementsHidden: true, importantForAccessibility: "no" };

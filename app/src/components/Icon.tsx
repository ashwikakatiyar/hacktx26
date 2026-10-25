import Svg, { Circle, Path, Rect } from "react-native-svg";

export type IconName =
  | "home"
  | "village"
  | "profile"
  | "sparkle"
  | "fairy"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "lock"
  | "check"
  | "gear"
  | "calendar"
  | "link";

// Stroke icons drawn on a 24x24 grid, matching the mockup's line weight.
export function Icon({ name, size = 24, color = "#2B2347", strokeWidth = 2 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const stroke = { stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === "home" && (
        <>
          <Path d="M4 11l8-7 8 7v9H4z" {...stroke} />
          <Path d="M10 20v-5h4v5" {...stroke} />
        </>
      )}
      {name === "village" && (
        <>
          <Path d="M2.5 20v-7l4-3.5 4 3.5v7z" {...stroke} />
          <Path d="M11 20V9.5l5-4.5 5 4.5V20z" {...stroke} />
          <Path d="M14.5 20v-4h3v4" {...stroke} />
        </>
      )}
      {name === "profile" && (
        <>
          <Circle cx={12} cy={8} r={4} {...stroke} />
          <Path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" {...stroke} />
        </>
      )}
      {name === "sparkle" && (
        <>
          <Path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7z" fill={color} />
          <Path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9z" fill={color} />
        </>
      )}
      {name === "fairy" && (
        <>
          <Path d="M12 12c-3-5-8-6-9-3s3 6 9 3z" {...stroke} />
          <Path d="M12 12c3-5 8-6 9-3s-3 6-9 3z" {...stroke} />
          <Path d="M12 12l-3 8M12 12l3 8" {...stroke} />
        </>
      )}
      {name === "chevron-right" && <Path d="M9 6l6 6-6 6" {...stroke} />}
      {name === "chevron-left" && <Path d="M15 6l-6 6 6 6" {...stroke} />}
      {name === "chevron-down" && <Path d="M6 9l6 6 6-6" {...stroke} />}
      {name === "check" && <Path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} />}
      {name === "lock" && (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2.5} {...stroke} />
          <Path d="M8 11V8a4 4 0 018 0v3" {...stroke} />
        </>
      )}
      {name === "gear" && (
        <>
          <Circle cx={12} cy={12} r={3} {...stroke} />
          <Path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" {...stroke} />
        </>
      )}
      {name === "calendar" && (
        <>
          <Rect x={3.5} y={5} width={17} height={15} rx={3} {...stroke} />
          <Path d="M8 3v4M16 3v4M3.5 10h17" {...stroke} />
          <Path d="M8.5 14.5l2 2 4-4" {...stroke} />
        </>
      )}
      {name === "link" && (
        <>
          <Path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" {...stroke} />
          <Path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" {...stroke} />
        </>
      )}
    </Svg>
  );
}

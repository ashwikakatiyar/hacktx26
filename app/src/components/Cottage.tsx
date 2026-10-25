import { Image, View } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import type { CottageState } from "@/lib/config";

// The cottage illustration in its three states. Drawn on an 84x96 grid; the profile photo sits on top (see CottagePlot).
//   thriving  : fresh paint, glowing windows, flowers  (hung out in the last 14 days)
//   weathered : faded, vines creeping in               (15 to 56 days)
//   run-down  : cracked, boarded up, dead tree         (over 56 days)
export function Cottage({
  state,
  width = "100%",
}: {
  state: CottageState;
  width?: number | `${number}%`;
}) {
  const illustrations = {
    thriving: require("../../assets/illustrations/cottage-thriving.png"),
    weathered: require("../../assets/illustrations/cottage-weathered.png"),
    "run-down": require("../../assets/illustrations/cottage-run-down.png"),
  };
  return <Image source={illustrations[state]} resizeMode="contain" style={{ width, height: typeof width === "number" ? width : 76, maxWidth: "100%" }} />;
}

function Thriving() {
  return (
    <>
      <Rect x={0} y={84} width={84} height={12} fill="#7FBF98" />
      <Rect x={54} y={26} width={8} height={16} fill="#8A6FC4" />
      <Circle cx={60} cy={20} r={3} fill="#fff" opacity={0.8} />
      <Circle cx={64} cy={13} r={2.4} fill="#fff" opacity={0.6} />
      <Rect x={16} y={50} width={52} height={34} fill="#F6E9D2" />
      <Path d="M9 52 L42 23 L75 52Z" fill="#6B47C4" />
      <Path d="M9 52 L75 52" stroke="#4E2F9A" strokeWidth={3} />
      <Rect x={20} y={58} width={11} height={11} rx={2} fill="#F7DE8E" />
      <Rect x={53} y={58} width={11} height={11} rx={2} fill="#F7DE8E" />
      <Path d="M25.5 58 V69 M20 63.5 H31" stroke="#B88A2E" strokeWidth={1} />
      <Path d="M58.5 58 V69 M53 63.5 H64" stroke="#B88A2E" strokeWidth={1} />
      <Rect x={36} y={64} width={12} height={20} rx={6} fill="#E3B04B" />
      <Circle cx={45} cy={75} r={1.2} fill="#2B2347" />
      <Circle cx={12} cy={82} r={2.6} fill="#F29BB8" />
      <Circle cx={19} cy={84} r={2.2} fill="#F7DE8E" />
      <Circle cx={70} cy={83} r={2.6} fill="#F29BB8" />
      <Circle cx={76} cy={82} r={2.2} fill="#fff" />
    </>
  );
}

function Weathered() {
  const vine = {
    stroke: "#2F7A4F",
    strokeWidth: 2.6,
    fill: "none" as const,
    strokeLinecap: "round" as const,
  };
  return (
    <>
      <Rect x={0} y={84} width={84} height={12} fill="#6F9F7D" />
      <Rect x={54} y={28} width={8} height={14} fill="#7C7499" />
      <Rect x={16} y={50} width={52} height={34} fill="#DDD0B3" />
      <Path d="M9 52 L42 23 L75 52Z" fill="#7A6EA5" />
      <Path d="M26 40 Q36 30 48 38 L54 46 L22 46Z" fill="#5E9470" />
      <Rect x={20} y={58} width={11} height={11} rx={2} fill="#C8BCE4" />
      <Rect x={53} y={58} width={11} height={11} rx={2} fill="#C8BCE4" />
      <Rect x={36} y={64} width={12} height={20} rx={6} fill="#A5803A" />
      <Path d="M17 84 Q11 70 21 62 Q13 56 19 48 Q22 44 18 38" {...vine} />
      <Path d="M66 84 Q72 72 63 64 Q70 58 64 50" {...vine} />
      <G fill="#2F7A4F">
        <Circle cx={13} cy={72} r={3} />
        <Circle cx={22} cy={60} r={3} />
        <Circle cx={16} cy={52} r={3} />
        <Circle cx={70} cy={72} r={3} />
        <Circle cx={62} cy={58} r={3} />
        <Circle cx={31} cy={49} r={2.6} />
      </G>
      <Path
        d="M4 84 L6 78 L8 84 M74 84 L76 77 L79 84"
        stroke="#3E8E63"
        strokeWidth={2}
        fill="none"
      />
    </>
  );
}

function RunDown() {
  return (
    <>
      <Rect x={0} y={84} width={84} height={12} fill="#8E8068" />
      <Path d="M54 38 L62 38 L62 44 L58 40 L54 45Z" fill="#6E6A82" />
      <Rect x={16} y={52} width={52} height={32} fill="#B5AB9C" />
      <Path d="M9 56 L28 36 L40 44 L56 30 L75 56Z" fill="#5C5870" />
      <Path d="M44 38 L53 37 L50 46Z" fill="#2B2347" />
      <Path
        d="M30 52 L34 62 L30 70 L35 84"
        stroke="#6B6254"
        strokeWidth={1.6}
        fill="none"
      />
      <Rect x={20} y={58} width={11} height={11} fill="#3A3350" />
      <Path
        d="M19 61 L32 66 M19 67 L32 62"
        stroke="#8E7A55"
        strokeWidth={2.4}
      />
      <Path d="M53 58 L64 58 L64 62 L60 64 L64 69 L53 69Z" fill="#3A3350" />
      <Path d="M36 84 L36 68 L46 63 L49 84Z" fill="#6B5A3E" />
      <Path
        d="M70 84 L68 70 L72 62 M68 74 L63 70 M70 68 L75 64"
        stroke="#5A4A35"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M6 84 L8 76 M10 84 L9 78 M14 84 L17 77 M76 84 L74 78"
        stroke="#7A7440"
        strokeWidth={1.6}
        fill="none"
      />
    </>
  );
}

// An empty plot: a dashed outline and a flag, with an invite waiting inside.
export function OpenPlot({
  width = "100%",
}: {
  width?: number | `${number}%`;
}) {
  return (
    <View style={{ width, height: typeof width === "number" ? width : 76, maxWidth: "100%" }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 84 96"
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <Rect x={0} y={84} width={84} height={12} fill="#7FBF98" />
        <Rect
          x={22}
          y={74}
          width={40}
          height={10}
          rx={3}
          fill="none"
          stroke="#6B47C4"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <Path d="M42 70 V54" stroke="#8A6B3F" strokeWidth={2.4} />
        <Path d="M42 54 L60 59 L42 64Z" fill="#E3B04B" />
      </Svg>
    </View>
  );
}

// Locked plots are drawn as pale ghosts.
export function GhostCottage({
  width = "100%",
}: {
  width?: number | `${number}%`;
}) {
  return (
    <View style={{ width, height: typeof width === "number" ? width : 76, maxWidth: "100%" }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 84 96"
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <Rect x={0} y={84} width={84} height={12} fill="#CFC6E6" />
        <Rect x={16} y={50} width={52} height={34} fill="#D9D1EC" />
        <Path d="M9 52 L42 23 L75 52Z" fill="#C2B7E0" />
        <Rect x={36} y={64} width={12} height={20} rx={6} fill="#C2B7E0" />
      </Svg>
    </View>
  );
}

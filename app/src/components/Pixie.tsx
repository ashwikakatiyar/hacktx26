import { FigmaFairy } from "@/components/FigmaFairy";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { useFairy, type FairyLook } from "@/lib/fairy";

// Your fairy. Wing, dress and hair colors come from the saved look, or from `look` when previewing a draft.
export function Pixie({
  size = 104,
  look,
}: {
  size?: number;
  look?: FairyLook;
}) {
  const saved = useFairy();
  const { wing, dress, hair } = look ?? saved.look;
  return <FigmaFairy size={size} look={{ wing, dress, hair }} />;
  return (
    <Svg
      width={size}
      height={(size * 140) / 120}
      viewBox="0 0 120 140"
      accessibilityLabel="Your fairy"
    >
      <Ellipse
        cx={38}
        cy={56}
        rx={24}
        ry={36}
        transform="rotate(-25 38 56)"
        fill={wing}
        opacity={0.92}
      />
      <Ellipse
        cx={82}
        cy={56}
        rx={24}
        ry={36}
        transform="rotate(25 82 56)"
        fill={wing}
        opacity={0.92}
      />
      <Ellipse
        cx={44}
        cy={84}
        rx={14}
        ry={20}
        transform="rotate(-40 44 84)"
        fill={wing}
        opacity={0.6}
      />
      <Ellipse
        cx={76}
        cy={84}
        rx={14}
        ry={20}
        transform="rotate(40 76 84)"
        fill={wing}
        opacity={0.6}
      />
      <Path d="M60 70 L36 112 Q60 122 84 112 Z" fill={dress} />
      <Path
        d="M52 112 L50 130 M68 112 L70 130"
        stroke="#FBD9C0"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Circle cx={60} cy={48} r={14} fill="#FBD9C0" />
      <Path
        d="M45 50 Q44 30 60 30 Q77 30 75 50 Q70 39 60 39 Q50 39 45 50Z"
        fill={hair}
      />
      <Circle cx={60} cy={25} r={7} fill={hair} />
      <Circle cx={55} cy={50} r={1.8} fill="#2B2347" />
      <Circle cx={65} cy={50} r={1.8} fill="#2B2347" />
      <Path
        d="M56 56 Q60 59 64 56"
        stroke="#2B2347"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={52} cy={55} r={2.2} fill="#F29BB8" opacity={0.6} />
      <Circle cx={68} cy={55} r={2.2} fill="#F29BB8" opacity={0.6} />
      <Path
        d="M72 78 L98 54"
        stroke="#F2D27A"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M100 42 L103 50 L111 52 L104 56 L106 64 L100 59 L93 63 L95 55 L89 50 L97 49Z"
        fill="#F2D27A"
      />
    </Svg>
  );
}

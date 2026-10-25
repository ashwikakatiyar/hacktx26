import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import { FAIRY_DEFAULT, type FairyLook } from "@/lib/fairy";

export function FigmaFairy({ size = 104, look = FAIRY_DEFAULT.look }: { size?: number; look?: FairyLook }) {
  const { wing, dress, hair, skin = FAIRY_DEFAULT.look.skin } = look;
  const ink = "#503F45";
  return (
    <Svg width={size} height={size * 4 / 3} viewBox="0 0 120 160" accessibilityLabel="Your fairy">
      <G fill={wing} stroke={wing} strokeWidth={1.5}>
        <Path d="M54 79C32 75 8 49 13 33C18 18 49 42 55 68Z" fillOpacity={0.85} />
        <Path d="M66 79C88 75 112 49 107 33C102 18 71 42 65 68Z" fillOpacity={0.85} />
        <Path d="M54 80C29 73 15 89 23 101C31 113 49 100 56 88Z" fillOpacity={0.6} />
        <Path d="M66 80C91 73 105 89 97 101C89 113 71 100 64 88Z" fillOpacity={0.6} />
      </G>
      <Path d="M51 70Q32 47 20 38M69 70Q88 47 100 38M49 85L29 96M71 85L91 96" fill="none" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={1.2} strokeLinecap="round" />
      <G fill="none" stroke={skin} strokeWidth={6} strokeLinecap="round">
        <Path d="M54 120L51 143M66 120L69 143M51 77Q42 87 32 84M69 77Q80 87 89 73" />
        <Path d="M60 61V76" strokeWidth={9} />
      </G>
      <G fill={dress} stroke={ink} strokeWidth={1.2} strokeLinejoin="round">
        <Path d="M50 73Q60 79 70 73L67 88Q73 103 82 119Q71 130 60 123Q49 130 38 119Q47 103 53 88Z" />
        <Path d="M48 141Q51 138 55 142L55 148H45Q44 144 48 141ZM65 142Q69 138 72 141L75 148H65Z" />
      </G>
      <Path d="M53 89Q60 92 67 89M60 97Q58 110 53 119" fill="none" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={60} cy={18} r={10} fill={hair} stroke={ink} strokeWidth={1.2} />
      <Ellipse cx={60} cy={42} rx={21} ry={24} fill={hair} />
      <Path d="M42 44L34 38Q33 50 43 52M78 44L86 38Q87 50 77 52" fill={skin} stroke={ink} strokeWidth={1} />
      <Ellipse cx={60} cy={46} rx={18} ry={20} fill={skin} stroke={ink} strokeWidth={1.2} />
      <Path d="M41 43Q36 22 56 21Q79 18 80 45Q66 42 60 30Q54 41 41 43Z" fill={hair} stroke={ink} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M53 24Q60 21 67 24" fill="none" stroke={dress} strokeWidth={3} strokeLinecap="round" />
      <G fill={ink}>
        <Ellipse cx={53} cy={47} rx={1.6} ry={2.2} />
        <Ellipse cx={67} cy={47} rx={1.6} ry={2.2} />
      </G>
      <G fill="#EA8797" opacity={0.45}>
        <Ellipse cx={48} cy={53} rx={3.5} ry={2} />
        <Ellipse cx={72} cy={53} rx={3.5} ry={2} />
      </G>
      <Path d="M56 55Q60 59 64 55" fill="none" stroke={ink} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M87 80L101 52" stroke="#E8BD5B" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M103 40L105 47L112 49L106 53L107 60L101 56L95 59L97 52L92 47L100 47Z" fill="#F8D780" stroke="#BA8B45" strokeWidth={1} strokeLinejoin="round" />
      <G fill="#F8D780">
        <Circle cx={88} cy={33} r={1.6} />
        <Circle cx={113} cy={69} r={1.3} />
        <Circle cx={17} cy={117} r={1.6} />
      </G>
    </Svg>
  );
}

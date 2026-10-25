import Svg, { G, Path, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/lib/theme";

type Month = { label: string; amount: number };

// Monthly spending bars. The last bar (this month so far) is gold. Fed by mock data now, Nessie data later.
export function SpendingChart({ months }: { months: Month[] }) {
  const W = 340;
  const base = 140;
  const maxBar = 100;
  const max = Math.max(1, ...months.map((m) => m.amount));
  const top = Math.ceil(max / 30) * 30; // headroom so the tallest bar never touches the top
  const slot = W / months.length;
  const barW = Math.min(38, slot - 12);
  const summary = months
    .map(
      (m, i) =>
        `${m.label} $${m.amount}${i === months.length - 1 ? " so far" : ""}`,
    )
    .join(", ");

  return (
    <Svg
      width="100%"
      viewBox="0 0 340 170"
      style={{ aspectRatio: 340 / 170 }}
      accessibilityLabel={`Bar chart of monthly spending on outings: ${summary}`}
    >
      <G stroke={colors.lineSoft} strokeWidth={1} strokeDasharray="3 5">
        <Path d="M0 30H340" />
        <Path d="M0 70H340" />
        <Path d="M0 110H340" />
      </G>
      {months.map((m, i) => {
        const h = Math.max(4, (m.amount / top) * maxBar);
        const x = i * slot + (slot - barW) / 2;
        const cx = x + barW / 2;
        const current = i === months.length - 1;
        return (
          <G key={m.label}>
            <Rect
              x={x}
              y={base - h}
              width={barW}
              height={h}
              rx={10}
              fill={current ? colors.gold : colors.lavender}
            />
            <SvgText
              x={cx}
              y={base - h - 6}
              fontSize={12}
              fontWeight="800"
              fontFamily="Nunito_800ExtraBold"
              fill={colors.ink}
              textAnchor="middle"
            >
              {`$${m.amount}`}
            </SvgText>
            <SvgText
              x={cx}
              y={160}
              fontSize={12}
              fontWeight="700"
              fontFamily="Nunito_700Bold"
              fill={colors.muted}
              textAnchor="middle"
            >
              {m.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

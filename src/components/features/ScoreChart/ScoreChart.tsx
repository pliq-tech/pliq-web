import type { ScoreChartProps, ScoreDataPoint } from "./ScoreChart.model";
import styles from "./ScoreChartStyles.module.css";

const PADDING_TOP = 24;
const PADDING_BOTTOM = 28;
const PADDING_X = 8;
const BAR_GAP_RATIO = 0.3;
const MAX_SCORE = 100;

function computeBarLayout(
  data: ScoreDataPoint[],
  width: number,
  chartHeight: number,
) {
  const count = data.length;
  if (count === 0) return [];

  const usableWidth = width - PADDING_X * 2;
  const totalBarWidth = usableWidth / count;
  const gap = totalBarWidth * BAR_GAP_RATIO;
  const barWidth = totalBarWidth - gap;

  return data.map((point, i) => {
    const x = PADDING_X + i * totalBarWidth + gap / 2;
    const barHeight = (point.score / MAX_SCORE) * chartHeight;
    const y = PADDING_TOP + (chartHeight - barHeight);
    return { x, y, width: barWidth, height: barHeight, point };
  });
}

export function ScoreChart({ data, height = 160 }: ScoreChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.empty} role="img" aria-label="No score data">
        No data available
      </div>
    );
  }

  const svgWidth = 400;
  const chartHeight = height - PADDING_TOP - PADDING_BOTTOM;
  const bars = computeBarLayout(data, svgWidth, chartHeight);

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${svgWidth} ${height}`}
        role="img"
        aria-label="Score trend chart"
      >
        <title>Score trend over time</title>
        {bars.map(({ x, y, width: bw, height: bh, point }) => (
          <g key={point.month}>
            <rect
              className={styles.bar}
              x={x}
              y={y}
              width={bw}
              height={Math.max(bh, 1)}
              rx={3}
            />
            <text className={styles.scoreLabel} x={x + bw / 2} y={y - 6}>
              {point.score}
            </text>
            <text className={styles.label} x={x + bw / 2} y={height - 6}>
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

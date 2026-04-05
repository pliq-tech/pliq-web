export interface ScoreDataPoint {
  month: string;
  score: number;
}

export interface ScoreChartProps {
  data: ScoreDataPoint[];
  height?: number;
}

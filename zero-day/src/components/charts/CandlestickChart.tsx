/**
 * Candlestick Chart Component
 * Financial OHLC chart using chartjs-chart-financial
 */
import { Chart } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

type CandlestickPoint = {
  x: number
  o: number
  h: number
  l: number
  c: number
}

interface CandlestickChartProps {
  data: ChartData<'candlestick', CandlestickPoint[]>
  options?: ChartOptions<'candlestick'>
  height?: number
}

export function CandlestickChart({ data, options, height = 360 }: CandlestickChartProps) {
  const defaultOptions: ChartOptions<'candlestick'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        type: 'linear',
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        border: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
    },
  }

  return (
    <div style={{ height }}>
      <Chart type="candlestick" data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  )
}

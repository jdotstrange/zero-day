/**
 * Radar Chart Component
 * Multi-dimensional comparison chart
 */
import { Radar } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

interface RadarChartProps {
  data: ChartData<'radar'>
  options?: ChartOptions<'radar'>
  height?: number
}

export function RadarChart({ data, options, height = 320 }: RadarChartProps) {
  const defaultOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#64748b',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11 },
        },
        ticks: {
          color: '#94a3b8',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
      },
    },
  }

  return (
    <div style={{ height }}>
      <Radar data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  )
}

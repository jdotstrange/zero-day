import { useMemo } from 'react'
import { CandlestickChart } from '@/components/charts'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { useLocale } from '@/i18n'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

interface OHLCDataPoint {
  x: number
  o: number
  h: number
  l: number
  c: number
}

export function CandlestickChartsPage() {
  const { locale, t } = useLocale()

  const labels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const base = new Date(2024, 0, 1) // Monday
    return Array.from({ length: 5 }, (_, i) => fmt.format(new Date(2024, 0, base.getDate() + i)))
  }, [locale])

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'AAPL (Demo)',
          data: [
            { x: 0, o: 185, h: 192, l: 182, c: 190 },
            { x: 1, o: 190, h: 195, l: 188, c: 191 },
            { x: 2, o: 191, h: 193, l: 186, c: 187 },
            { x: 3, o: 187, h: 189, l: 180, c: 183 },
            { x: 4, o: 183, h: 188, l: 181, c: 186 },
          ],
          borderColors: {
            up: '#16a34a',
            down: '#dc2626',
            unchanged: '#64748b',
          },
          backgroundColors: {
            up: 'rgba(34, 197, 94, 0.35)',
            down: 'rgba(239, 68, 68, 0.35)',
            unchanged: 'rgba(100, 116, 139, 0.25)',
          },
        },
      ],
    }),
    [],
  )

  const options = useMemo(
    () => ({
      scales: {
        x: {
          type: 'linear' as const,
          ticks: {
            callback: (value: string | number) => labels[Number(value)] ?? '',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx: TooltipItem<'candlestick'>) => {
              const v = ctx.raw as OHLCDataPoint
              return t('charts.candlestick.tooltip_ohlc', { o: v.o, h: v.h, l: v.l, c: v.c })
            },
          },
        },
      },
    }),
    [labels, t],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('charts.candlestick_chart')}
        subtitle={t('charts.candlestick.subtitle')}
      />

      <ChartCard
        title={t('charts.candlestick.demo_title')}
        subtitle={t('charts.candlestick.demo_desc')}
      >
        <CandlestickChart
          data={data as ChartData<'candlestick'>}
          options={options as ChartOptions<'candlestick'>}
          height={420}
        />
      </ChartCard>
    </div>
  )
}

export default CandlestickChartsPage

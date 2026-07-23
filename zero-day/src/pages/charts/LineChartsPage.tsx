import { useMemo } from 'react'
import { LineChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function LineChartsPage() {
  const { locale, t } = useLocale()

  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const base = new Date(2024, 0, 1) // Monday
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, base.getDate() + i)))
  }, [locale])

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 6 }, (_, i) => fmt.format(new Date(2024, i, 1)))
  }, [locale])

  const basic = useMemo(
    () => ({
      labels: weekdayLabels,
      datasets: [
        {
          label: t('charts.dataset.visitors'),
          data: [4200, 5100, 4600, 5900, 7200, 6800, 6100],
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    }),
    [t, weekdayLabels],
  )

  const multi = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: t('charts.dataset.signups'),
          data: [320, 410, 380, 520, 610, 590],
          borderColor: chartColors.green.solid,
          backgroundColor: chartColors.green.light,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: t('charts.dataset.purchases'),
          data: [180, 240, 220, 310, 420, 400],
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    }),
    [monthLabels, t],
  )

  const stepped = useMemo(
    () => ({
      labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      datasets: [
        {
          label: t('charts.dataset.queue_size'),
          data: [12, 14, 9, 18, 22, 17, 11, 8],
          borderColor: chartColors.orange.solid,
          backgroundColor: chartColors.orange.light,
          borderWidth: 2,
          pointRadius: 0,
          stepped: true,
        },
      ],
    }),
    [t],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('charts.line_chart')}
        subtitle={t('charts.line.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={t('charts.line.basic.title')}
          subtitle={t('charts.line.basic.desc')}
        >
          <LineChart data={basic} height={320} />
        </ChartCard>

        <ChartCard
          title={t('charts.line.multi.title')}
          subtitle={t('charts.line.multi.desc')}
        >
          <LineChart data={multi} height={320} />
        </ChartCard>

        <ChartCard
          className="xl:col-span-2"
          title={t('charts.line.stepped.title')}
          subtitle={t('charts.line.stepped.desc')}
        >
          <LineChart data={stepped} height={320} />
        </ChartCard>
      </div>
    </div>
  )
}

export default LineChartsPage

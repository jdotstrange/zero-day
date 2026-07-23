import { useMemo } from 'react'
import { AreaChart, BarChart, DoughnutChart, LineChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader } from '@/components/dashboard'
import { Card } from '@/components/ui'
import { useLocale } from '@/i18n'

export function ChartsPage() {
  const { t } = useLocale()

  const revenueData = useMemo(
    () => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: t('charts.dataset.revenue'),
          data: [18500, 22400, 19800, 28200, 32100, 28800, 35200],
          fill: true,
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: chartColors.blue.solid,
        },
      ],
    }),
    [t],
  )

  const trafficLineData = useMemo(
    () => ({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: t('charts.dataset.visitors'),
          data: [4200, 5100, 4600, 5900, 7200, 6800, 6100],
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: t('charts.dataset.signups'),
          data: [380, 420, 390, 510, 640, 600, 530],
          borderColor: chartColors.green.solid,
          backgroundColor: chartColors.green.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    }),
    [t],
  )

  const salesBarData = useMemo(
    () => ({
      labels: [
        t('charts.category.shoes'),
        t('charts.category.bags'),
        t('charts.category.watches'),
        t('charts.category.hoodies'),
        t('charts.category.caps'),
        t('charts.category.sunglasses'),
      ],
      datasets: [
        {
          label: t('charts.dataset.sales'),
          data: [1200, 950, 780, 1400, 620, 860],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.purple.solid,
            chartColors.green.solid,
            chartColors.orange.solid,
            chartColors.cyan.solid,
            chartColors.pink.solid,
          ],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }),
    [t],
  )

  const horizontalBarData = useMemo(
    () => ({
      labels: ['US', 'UK', 'Canada', 'Germany', 'France'],
      datasets: [
        {
          label: t('charts.overview.orders'),
          data: [520, 410, 360, 290, 240],
          backgroundColor: chartColors.blue.solid,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }),
    [t],
  )

  const doughnutData = useMemo(
    () => ({
      labels: [
        t('charts.source.organic'),
        t('charts.source.paid'),
        t('charts.source.referral'),
        t('charts.source.email'),
      ],
      datasets: [
        {
          data: [42, 28, 18, 12],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.purple.solid,
            chartColors.green.solid,
            chartColors.orange.solid,
          ],
          borderWidth: 0,
        },
      ],
    }),
    [t],
  )

  const doughnutLegend = useMemo(
    () => [
      { label: t('charts.source.organic'), value: '42%', color: chartColors.blue.solid },
      { label: t('charts.source.paid'), value: '28%', color: chartColors.purple.solid },
      { label: t('charts.source.referral'), value: '18%', color: chartColors.green.solid },
      { label: t('charts.source.email'), value: '12%', color: chartColors.orange.solid },
    ],
    [t],
  )

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('nav.charts')}
        subtitle={t('charts.overview.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={t('charts.area_chart')}
          subtitle={t('charts.overview.area.desc')}
        >
          <AreaChart data={revenueData} height={320} />
        </ChartCard>

        <ChartCard
          title={t('charts.line_chart')}
          subtitle={t('charts.overview.line.desc')}
        >
          <LineChart data={trafficLineData} height={320} />
        </ChartCard>

        <ChartCard
          title={t('charts.bar_chart')}
          subtitle={t('charts.overview.bar.desc')}
        >
          <BarChart data={salesBarData} height={320} />
        </ChartCard>

        <ChartCard
          title={t('charts.overview.horizontal_bar.title')}
          subtitle={t('charts.overview.horizontal_bar.desc')}
        >
          <BarChart data={horizontalBarData} height={320} horizontal />
        </ChartCard>

        <ChartCard
          className="xl:col-span-2"
          title={t('charts.doughnut_chart')}
          subtitle={t('charts.overview.doughnut.desc')}
          action={
            <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
              {t('charts.overview.doughnut.tip')}
            </p>
          }
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DoughnutChart data={doughnutData} height={280} />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {doughnutLegend.map((item) => (
                  <Card key={item.label} padding="sm" className="rounded-xl">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-body-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {item.label}
                      </span>
                    </div>
                    <div className="heading-3 mt-2 text-secondary-900 dark:text-white">{item.value}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default ChartsPage

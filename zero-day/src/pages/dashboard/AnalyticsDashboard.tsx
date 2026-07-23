/**
 * Analytics Dashboard
 */
import { Icon, Icons } from '@/components/common'
import { AreaChart, BarChart, DoughnutChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader, StatCard } from '@/components/dashboard'
import { Button, Card, CardContent } from '@/components/ui'
import { topPages, browserStats, countries } from '@/data'
import { useLocale } from '@/i18n'

export function AnalyticsDashboard() {
  const { t } = useLocale()

  const trafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    datasets: [
      {
        label: 'Visitors',
        data: [2400, 3200, 2800, 3600, 4100, 3200, 2100, 2800, 3400, 3100, 3800, 4200, 3400, 4800],
        fill: true,
        borderColor: chartColors.blue.solid,
        backgroundColor: chartColors.blue.light,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  }

  const hourlyData = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [{
      label: 'Sessions',
      data: [120, 80, 200, 890, 1240, 1580, 1120, 680],
      backgroundColor: chartColors.purple.solid,
      borderRadius: 4,
      borderSkipped: false,
      barThickness: 20,
    }],
  }

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [58, 35, 7],
      backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.orange.solid],
      borderWidth: 0,
      cutout: '70%',
    }],
  }

  return (
    <div className="animate-fade-in space-y-6">
      <DashboardPageHeader
        title={t('dashboard.analytics_overview')}
        subtitle={t('dashboard.monitor_performance')}
        badge={
          <span className="flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
            <Icon icon={Icons.circleFilled} className="h-1.5 w-1.5 animate-pulse" />
            {t('dashboard.live')}
          </span>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" iconOnly aria-label="Refresh">
              <Icon icon={Icons.refresh} />
            </Button>
            <Button variant="outline">
              <Icon icon={Icons.calendar} />
              {t('dashboard.last_14_days')}
            </Button>
            <Button>
              <Icon icon={Icons.download} />
              {t('dashboard.export')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.total_visitors')}
          value="45,890"
          change="12.5%"
          icon={Icons.users}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label={t('dashboard.page_views')}
          value="128,430"
          change="8.2%"
          icon={Icons.eye}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label={t('dashboard.avg_session_duration')}
          value="4m 32s"
          change="2.4%"
          isPositive={false}
          icon={Icons.clock}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          label={t('dashboard.bounce_rate')}
          value="32.8%"
          change="1.2%"
          icon={Icons.activity}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>

      <Card className="rounded-xl border-theme-primary/20 bg-theme-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-lg bg-theme-primary/15 p-2 text-theme-primary">
            <Icon icon={Icons.sparkles} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-label text-secondary-900 dark:text-white">
              {t('dashboard.traffic_spike_detected')}
            </h3>
            <p
              className="mt-1 text-body-sm text-secondary-600 dark:text-secondary-400"
              dangerouslySetInnerHTML={{ __html: t('dashboard.traffic_spike_description') }}
            />
          </div>
          <button
            type="button"
            className="shrink-0 text-secondary-400 transition-colors hover:text-secondary-600 dark:hover:text-secondary-200"
            aria-label={t('common.close')}
          >
            <Icon icon={Icons.x} className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      <ChartCard
        title={t('dashboard.traffic_overview')}
        subtitle={t('dashboard.compare_traffic_stats')}
        action={
          <div className="flex items-center gap-1">
            <Button size="xs">{t('dashboard.14_days')}</Button>
            <Button variant="ghost" size="xs">{t('dashboard.30_days')}</Button>
            <Button variant="ghost" size="xs">{t('dashboard.90_days')}</Button>
          </div>
        }
      >
        <AreaChart data={trafficData} height={320} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title={t('dashboard.device_breakdown')} subtitle={t('dashboard.traffic_source_by_device')}>
          <div className="mb-6 flex justify-center">
            <DoughnutChart data={deviceData} height={160} />
          </div>
          <div className="space-y-3">
            {[
              { icon: Icons.deviceDesktop, label: 'Desktop', value: '58%', color: 'text-blue-500', bg: 'bg-blue-500' },
              { icon: Icons.deviceMobile, label: 'Mobile', value: '35%', color: 'text-purple-500', bg: 'bg-purple-500' },
              { icon: Icons.deviceTablet, label: 'Tablet', value: '7%', color: 'text-orange-500', bg: 'bg-orange-500' },
            ].map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${d.bg}`} />
                  <div className="flex items-center gap-2">
                    <Icon icon={d.icon} className={`h-4 w-4 ${d.color}`} />
                    <span className="text-body-sm text-secondary-600 dark:text-secondary-400">{d.label}</span>
                  </div>
                </div>
                <span className="text-label text-secondary-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={t('dashboard.browser_stats')} subtitle={t('dashboard.most_used_browsers')}>
          <div className="space-y-4">
            {browserStats.map((b) => (
              <div key={b.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={Icons.brandChrome} className="h-4 w-4" style={{ color: b.color }} />
                    <span className="text-label text-secondary-700 dark:text-secondary-300">{b.name}</span>
                  </div>
                  <span className="text-label text-secondary-900 dark:text-white">{b.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${b.value}%`, backgroundColor: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={t('dashboard.top_countries')} subtitle={t('dashboard.traffic_distribution_by_country')}>
          <div className="space-y-4">
            {countries.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
              >
                <span className="heading-3">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate text-label text-secondary-900 dark:text-white">{c.name}</span>
                    <span className="text-caption font-semibold text-secondary-500">
                      {c.sessions.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                    <div className="h-full rounded-full bg-theme-primary" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card padding="none" className="overflow-hidden rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-surface-200 p-6 dark:border-surface-700">
            <div>
              <h2 className="heading-4 text-secondary-900 dark:text-white">{t('dashboard.top_pages')}</h2>
              <p className="mt-0.5 text-body-sm text-secondary-500 dark:text-secondary-400">
                {t('dashboard.most_visited_pages')}
              </p>
            </div>
            <button type="button" className="flex items-center gap-1 text-sm font-medium text-theme-primary hover:underline">
              {t('dashboard.view_full_report')} <Icon icon={Icons.externalLink} className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.page_name')}</th>
                  <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.views')}</th>
                  <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.unique')}</th>
                  <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.avg_time')}</th>
                  <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.bounce')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {topPages.map((page) => (
                  <tr key={page.path} className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/30">
                    <td className="px-6 py-4">
                      <p className="text-label text-secondary-900 dark:text-white">{page.title}</p>
                      <p className="mt-0.5 text-caption text-secondary-400">{page.path}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-label text-secondary-900 dark:text-white">{page.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-body-sm text-secondary-600 dark:text-secondary-400">{page.unique.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-body-sm text-secondary-600 dark:text-secondary-400">{page.avgTime}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        parseInt(page.bounce) < 40
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : parseInt(page.bounce) < 60
                            ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                            : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                      }`}>
                        {page.bounce}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <ChartCard
          title={t('dashboard.sessions_by_hour')}
          subtitle={t('dashboard.peak_traffic_times')}
          action={
            <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1 text-body-sm dark:bg-surface-800">
              <span className="text-secondary-500">{t('dashboard.peak')}:</span>
              <span className="font-semibold text-secondary-900 dark:text-white">3:00 PM</span>
            </div>
          }
        >
          <BarChart data={hourlyData} height={280} />
          <div className="mt-4 border-t border-surface-100 pt-4 dark:border-surface-800">
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-secondary-500">{t('dashboard.lowest_traffic')}</span>
              <span className="font-medium text-secondary-900 dark:text-white">3:00 AM (80)</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-body-sm">
              <span className="text-secondary-500">{t('dashboard.average_per_hour')}</span>
              <span className="font-medium text-secondary-900 dark:text-white">731</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

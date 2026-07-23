import { Icon, Icons } from '@/components/common'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import {
  ActivityItem,
  ChartCard,
  DashboardPageHeader,
  ProgressBar,
  StatCard,
} from '@/components/dashboard'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useLocale } from '@/i18n'

export function DashboardPage() {
  const { t } = useLocale()

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [18500, 22400, 19800, 28200, 32100, 28800, 35200, 38400, 42100, 39500, 45200, 48295],
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
  }

  const stats = [
    {
      labelKey: 'dashboard.visitors',
      value: '12,845',
      change: '+12%',
      isPositive: true,
      icon: Icons.users,
      iconBg: 'bg-primary-100 dark:bg-primary-900/40',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      labelKey: 'dashboard.revenue',
      value: '$48,295',
      change: '+8%',
      isPositive: true,
      icon: Icons.currencyDollar,
      iconBg: 'bg-success-100 dark:bg-success-900/40',
      iconColor: 'text-success-600 dark:text-success-400',
    },
    {
      labelKey: 'dashboard.orders',
      value: '1,234',
      change: '-3%',
      isPositive: false,
      icon: Icons.package,
      iconBg: 'bg-warning-100 dark:bg-warning-900/40',
      iconColor: 'text-warning-600 dark:text-warning-400',
    },
    {
      labelKey: 'dashboard.growth',
      value: '18.2%',
      change: '+4%',
      isPositive: true,
      icon: Icons.trendingUp,
      iconBg: 'bg-info-100 dark:bg-info-900/40',
      iconColor: 'text-info-600 dark:text-info-400',
    },
  ]

  const activities = [
    {
      action: 'New user registered',
      time: '2 min ago',
      user: 'Sarah Connor',
      icon: Icons.user,
      iconBg: 'bg-primary-100 dark:bg-primary-900/40',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      action: 'Order #1234 completed',
      time: '15 min ago',
      user: 'John Smith',
      icon: Icons.circleCheck,
      iconBg: 'bg-success-100 dark:bg-success-900/40',
      iconColor: 'text-success-600 dark:text-success-400',
    },
    {
      action: 'Payment received',
      time: '1 hour ago',
      user: 'Mike Johnson',
      icon: Icons.creditCard,
      iconBg: 'bg-accent-100 dark:bg-accent-900/40',
      iconColor: 'text-accent-600 dark:text-accent-400',
    },
    {
      action: 'New review posted',
      time: '2 hours ago',
      user: 'Emily Davis',
      icon: Icons.star,
      iconBg: 'bg-warning-100 dark:bg-warning-900/40',
      iconColor: 'text-warning-600 dark:text-warning-400',
    },
  ]

  const topProducts = [
    { name: 'Premium Plan', revenue: '$12,450', progress: 85 },
    { name: 'Basic Plan', revenue: '$8,200', progress: 65 },
    { name: 'Enterprise', revenue: '$24,500', progress: 45 },
    { name: 'Starter Kit', revenue: '$3,150', progress: 30 },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <DashboardPageHeader
        title={t('header.top.dashboard')}
        subtitle={t('dashboard.welcome_back')}
        actions={
          <>
            <Button variant="outline">
              <Icon icon={Icons.calendar} />
              {t('dashboard.last_30_days')}
            </Button>
            <Button>{t('dashboard.download_report')}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.labelKey}
            label={t(stat.labelKey)}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title={t('dashboard.revenue_overview')}
          subtitle={t('dashboard.monthly_revenue_statistics')}
          action={
            <div className="flex items-center gap-1">
              <Button size="xs">{t('dashboard.monthly')}</Button>
              <Button variant="ghost" size="xs">{t('dashboard.weekly')}</Button>
              <Button variant="ghost" size="xs">{t('dashboard.daily')}</Button>
            </div>
          }
        >
          <div className="h-72">
            <AreaChart data={revenueData} height={288} />
          </div>
        </ChartCard>

        <ChartCard
          title={t('dashboard.top_products')}
          action={
            <button type="button" className="text-sm font-medium text-theme-primary hover:underline">
              {t('dashboard.view_all')}
            </button>
          }
        >
          <div className="space-y-4">
            {topProducts.map((product) => (
              <ProgressBar
                key={product.name}
                label={product.name}
                value={product.progress}
                rightLabel={product.revenue}
                showValue={false}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title={t('dashboard.recent_activity')}
          action={
            <button type="button" className="text-sm font-medium text-theme-primary hover:underline">
              {t('dashboard.view_all')}
            </button>
          }
          contentClassName="space-y-1"
        >
          {activities.map((activity) => (
            <ActivityItem
              key={activity.action}
              title={activity.action}
              subtitle={`by ${activity.user}`}
              time={activity.time}
              icon={activity.icon}
              iconBg={activity.iconBg}
              iconColor={activity.iconColor}
            />
          ))}
        </ChartCard>

        <Card className="rounded-xl">
          <CardHeader className="mb-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>{t('dashboard.performance')}</CardTitle>
            </div>
            <span className="text-caption text-secondary-400">{t('dashboard.last_7_days')}</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '89%', label: t('dashboard.task_completion') },
                { value: '4.8', label: t('dashboard.customer_rating') },
                { value: '2.4k', label: t('dashboard.active_sessions') },
                { value: '98%', label: t('dashboard.uptime') },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-surface-50 p-4 dark:bg-surface-800/50"
                >
                  <p className="heading-3 text-secondary-900 dark:text-white">{item.value}</p>
                  <CardDescription className="mt-1">{item.label}</CardDescription>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

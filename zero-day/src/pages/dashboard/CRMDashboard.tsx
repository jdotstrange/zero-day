/**
 * CRM Dashboard
 */
import { Icon, Icons } from '@/components/common'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader, ProgressBar, StatCard } from '@/components/dashboard'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { HeaderSearch } from '@/layouts/header/HeaderSearch'
import { pipeline, crmContacts, activities } from '@/data'
import { useLocale } from '@/i18n'
import { cn } from '@/components/ui/cn'

export function CRMDashboard() {
  const { t } = useLocale()

  const leadData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [{
      label: 'Leads',
      data: [45, 68, 52, 84, 72, 96],
      fill: true,
      borderColor: chartColors.purple.solid,
      backgroundColor: chartColors.purple.light,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }],
  }

  const activityIcons: Record<string, string> = {
    call: Icons.phone,
    email: Icons.mail,
    meeting: Icons.calendar,
    task: Icons.briefcase,
  }

  const statusColors: Record<string, string> = {
    hot: 'bg-danger-500',
    warm: 'bg-warning-500',
    new: 'bg-blue-500',
  }

  const avatarColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ]

  const leadSources = [
    { source: t('dashboard.website'), value: 45, color: 'bg-blue-500' },
    { source: t('dashboard.referral'), value: 28, color: 'bg-green-500' },
    { source: t('dashboard.social'), value: 18, color: 'bg-purple-500' },
    { source: t('dashboard.other'), value: 9, color: 'bg-orange-500' },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <DashboardPageHeader
        title={t('dashboard.crm_pipeline')}
        subtitle={t('dashboard.manage_deals')}
        actions={
          <>
            <HeaderSearch
              placeholder={t('dashboard.search_contacts')}
              className="hidden sm:block"
              inputClassName="w-64"
            />
            <Button>
              <Icon icon={Icons.plus} />
              {t('dashboard.new_deal')}
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-4 text-secondary-900 dark:text-white">{t('dashboard.deal_pipeline')}</h2>
          <div className="flex items-center gap-4 rounded-lg bg-surface-100 px-3 py-1.5 text-body-sm dark:bg-surface-800">
            <span className="text-secondary-500">{t('dashboard.total_value')}:</span>
            <span className="font-semibold text-secondary-900 dark:text-white">$573,000</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-4">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="flex h-full min-w-[280px] flex-col">
              <div className={cn('flex items-center justify-between rounded-t-xl border-b border-surface-200 p-3 dark:border-surface-700', stage.headerBg)}>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-surface-900', stage.color)} />
                  <span className="text-label text-secondary-900 dark:text-white">{stage.stage}</span>
                </div>
                <span className="rounded-full bg-white/50 px-2 py-0.5 text-xs font-bold text-secondary-600 dark:bg-black/20 dark:text-secondary-300">
                  {stage.deals.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 rounded-b-xl border border-t-0 border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/30">
                {stage.deals.map((deal) => (
                  <div
                    key={deal.company}
                    className="card group cursor-pointer rounded-lg p-3 transition-colors hover:border-theme-primary/30"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="text-label text-secondary-900 transition-colors group-hover:text-theme-primary dark:text-white">
                        {deal.company}
                      </h4>
                      <button
                        type="button"
                        className="rounded p-1 opacity-0 transition-all hover:bg-surface-100 group-hover:opacity-100 dark:hover:bg-surface-700"
                        aria-label="Deal options"
                      >
                        <Icon icon={Icons.dotsVertical} className="h-3.5 w-3.5 text-secondary-400" />
                      </button>
                    </div>
                    <p className="heading-5 mb-1 text-secondary-900 dark:text-white">{deal.value}</p>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary/10 text-ui-2xs font-bold text-theme-primary">
                        {deal.contact.charAt(0)}
                      </div>
                      <p className="text-caption text-secondary-500">{deal.contact}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-surface-100 pt-2 dark:border-surface-700">
                      <span className="rounded bg-surface-100 px-1.5 py-0.5 text-ui-2xs font-medium text-secondary-400 dark:bg-surface-700/50">
                        {deal.days} days
                      </span>
                      <Icon icon={Icons.chevronRight} className="h-3.5 w-3.5 text-secondary-300 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-surface-300 py-2 text-xs font-medium text-secondary-500 transition-colors hover:border-theme-primary/40 hover:bg-white hover:text-theme-primary dark:border-surface-600 dark:hover:bg-surface-800"
                >
                  <Icon icon={Icons.plus} className="h-3 w-3" />
                  {t('dashboard.add_deal')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title={t('dashboard.todays_schedule')}
          subtitle={`${activities.filter((a) => !a.done).length} ${t('dashboard.tasks_remaining')}`}
          className="h-full"
          contentClassName="space-y-3"
        >
          {activities.map((activity, idx) => {
            const activityIcon = activityIcons[activity.type]
            return (
              <div
                key={idx}
                className={cn(
                  'flex gap-3 rounded-xl p-3 transition-colors',
                  activity.done
                    ? 'bg-surface-50 opacity-60 dark:bg-surface-800/30'
                    : 'card rounded-xl',
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  activity.done ? 'bg-success-100 dark:bg-success-900/30' : 'bg-surface-100 dark:bg-surface-700',
                )}>
                  {activity.done ? (
                    <Icon icon={Icons.check} className="h-4 w-4 text-success-600" />
                  ) : (
                    <Icon icon={activityIcon} className="h-4 w-4 text-secondary-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <p className={cn(
                      'text-label',
                      activity.done ? 'text-secondary-400 line-through' : 'text-secondary-900 dark:text-white',
                    )}>
                      {activity.title}
                    </p>
                    <span className="shrink-0 rounded bg-surface-100 px-1.5 py-0.5 text-xs font-medium text-secondary-400 dark:bg-surface-700">
                      {activity.time}
                    </span>
                  </div>
                  <p className="truncate text-caption text-secondary-500">{activity.description}</p>
                </div>
              </div>
            )
          })}
        </ChartCard>

        <ChartCard
          title={t('dashboard.key_contacts')}
          subtitle={t('dashboard.recent_interactions')}
          action={
            <button type="button" className="text-xs font-medium text-theme-primary hover:underline">
              {t('dashboard.view_all')}
            </button>
          }
          className="h-full"
          contentClassName="space-y-3"
        >
          {crmContacts.map((contact, index) => (
            <div
              key={contact.email}
              className="group flex items-center gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-surface-200 hover:bg-surface-50 dark:hover:border-surface-700 dark:hover:bg-surface-800/50"
            >
              <div className="relative">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white dark:ring-surface-800',
                  avatarColors[index % avatarColors.length],
                )}>
                  {contact.avatar}
                </div>
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-surface-900',
                  statusColors[contact.status],
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-label text-secondary-900 dark:text-white">{contact.name}</p>
                  <span className={cn(
                    'shrink-0 rounded px-1.5 py-0.5 text-ui-2xs font-bold uppercase tracking-wider',
                    contact.status === 'hot' ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400' :
                    contact.status === 'warm' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                  )}>
                    {contact.status}
                  </span>
                </div>
                <p className="truncate text-caption font-medium text-secondary-500">{contact.role}</p>
                <p className="truncate text-caption text-secondary-400">{contact.company}</p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" className="rounded-lg p-1.5 text-secondary-500 transition-colors hover:bg-surface-200 hover:text-theme-primary dark:hover:bg-surface-700">
                  <Icon icon={Icons.phone} className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="rounded-lg p-1.5 text-secondary-500 transition-colors hover:bg-surface-200 hover:text-theme-primary dark:hover:bg-surface-700">
                  <Icon icon={Icons.mail} className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </ChartCard>

        <div className="space-y-6">
          <StatCard
            label={t('dashboard.total_leads')}
            value="384"
            change="23.5%"
            icon={Icons.users}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            label={t('dashboard.conversion_rate')}
            value="24.8%"
            change="1.2%"
            icon={Icons.trendingUp}
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />

          <ChartCard title={t('dashboard.lead_trend')} subtitle={t('dashboard.last_6_weeks')}>
            <AreaChart data={leadData} height={140} options={{ plugins: { legend: { display: false } } }} />
          </ChartCard>

          <Card padding="sm" className="rounded-xl">
            <CardHeader className="mb-4 space-y-0">
              <CardTitle className="text-label">{t('dashboard.lead_sources')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadSources.map((s) => (
                <ProgressBar
                  key={s.source}
                  label={s.source}
                  value={s.value}
                  color={s.color}
                  size="sm"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

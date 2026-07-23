import { Icons } from '@/components/common'
import { FeatureHighlight, FeaturePageHeader } from '@/components/features'
import { useLocale } from '@/i18n'
import { TaskSchedulerDashboard } from '../../features/task-scheduler'

export function TaskSchedulerPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.taskScheduler}
        iconWrapClassName="bg-info-100 text-info-600 dark:bg-info-900/40 dark:text-info-400"
        title={t('features.task_scheduler.title')}
        subtitle={t('features.task_scheduler.subtitle')}
      />
      <FeatureHighlight
        title={t('features.task_scheduler.advanced_complex_logic')}
        description={t('features.task_scheduler.description')}
        items={[
          { icon: 'solar:chart-2-bold', label: t('features.task_scheduler.gantt_charts') },
          { icon: 'solar:link-bold', label: t('features.task_scheduler.dependencies') },
          { icon: 'solar:route-bold', label: t('features.task_scheduler.critical_path') },
          { icon: 'solar:calendar-mark-bold', label: t('features.task_scheduler.calendar_view') },
        ]}
      />
      <TaskSchedulerDashboard />
    </div>
  )
}

export default TaskSchedulerPage

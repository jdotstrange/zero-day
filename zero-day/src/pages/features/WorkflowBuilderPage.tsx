import { Icons } from '@/components/common'
import { FeatureHighlight, FeaturePageHeader } from '@/components/features'
import { useLocale } from '@/i18n'
import { WorkflowDashboard } from '../../features/workflow-builder'

export function WorkflowBuilderPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.workflowBuilder}
        title={t('features.workflow.title')}
        subtitle={t('features.workflow.subtitle')}
      />
      <FeatureHighlight
        title={t('features.workflow.advanced_complex_logic')}
        description={t('features.workflow.description')}
        items={[
          { icon: 'solar:box-bold', label: t('features.workflow.drag_drop_nodes') },
          { icon: 'solar:link-bold', label: t('features.workflow.visual_connections') },
          { icon: 'solar:play-bold', label: t('features.workflow.workflow_execution') },
          { icon: 'solar:check-circle-bold', label: t('features.workflow.realtime_validation') },
        ]}
      />
      <WorkflowDashboard />
    </div>
  )
}

export default WorkflowBuilderPage

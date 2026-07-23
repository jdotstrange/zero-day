import { useMemo, useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { StatCard } from '@/components/dashboard'
import { FeaturePageHeader, FeatureTabBar } from '@/components/features'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useLocale } from '@/i18n'
import {
  useRuleEngine,
  RuleList,
  RuleEditor,
  RuleTester,
  ruleTemplates,
  countConditions,
  type Rule,
} from '../../features/rule-engine'

type RuleTab = 'list' | 'editor' | 'tester'

export function RuleEnginePage() {
  const [activeTab, setActiveTab] = useState<RuleTab>('list')
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [isNewRule, setIsNewRule] = useState(false)
  const { t } = useLocale()

  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    duplicateRule,
    createFromTemplate,
  } = useRuleEngine()

  const selectedRule = rules.find((r) => r.id === selectedRuleId) ?? null

  const handleSelectRule = (id: string) => {
    setSelectedRuleId(id)
    setIsNewRule(false)
    setActiveTab('editor')
  }

  const handleNewRule = () => {
    setSelectedRuleId(null)
    setIsNewRule(true)
    setActiveTab('editor')
  }

  const handleSaveRule = (rule: Rule) => {
    if (selectedRuleId && rules.some((r) => r.id === selectedRuleId)) {
      updateRule(rule.id, rule)
    } else {
      addRule(rule)
    }
    setActiveTab('list')
    setSelectedRuleId(null)
    setIsNewRule(false)
  }

  const handleCancelEdit = () => {
    setActiveTab('list')
    setSelectedRuleId(null)
    setIsNewRule(false)
  }

  const tabs = [
    { id: 'list' as const, label: t('features.rule_engine.tab_rules'), icon: Icons.list },
    { id: 'editor' as const, label: t('features.rule_engine.tab_editor'), icon: Icons.edit },
    { id: 'tester' as const, label: t('features.rule_engine.tab_tester'), icon: Icons.bolt },
  ]

  const stats = useMemo(() => {
    const activeRules = rules.filter((r) => r.enabled).length
    return {
      total: rules.length,
      active: activeRules,
      disabled: rules.length - activeRules,
      conditions: rules.reduce((acc, r) => acc + countConditions(r.conditionGroup), 0),
    }
  }, [rules])

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.ruleEngine}
        iconWrapClassName="bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400"
        title={t('features.rule_engine.title')}
        subtitle={t('features.rule_engine.subtitle')}
        actions={
          <Button type="button" onClick={handleNewRule}>
            <Icon icon={Icons.plus} />
            {t('features.rule_engine.new_rule')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('features.rule_engine.total_rules')}
          value={String(stats.total)}
          icon={Icons.list}
          showMenu={false}
        />
        <StatCard
          label={t('features.rule_engine.active_rules')}
          value={String(stats.active)}
          icon={Icons.circleCheck}
          iconBg="bg-success-100 dark:bg-success-900/40"
          iconColor="text-success-600 dark:text-success-400"
          showMenu={false}
        />
        <StatCard
          label={t('features.rule_engine.disabled_rules')}
          value={String(stats.disabled)}
          icon={Icons.clock}
          iconBg="bg-warning-100 dark:bg-warning-900/40"
          iconColor="text-warning-600 dark:text-warning-400"
          showMenu={false}
        />
        <StatCard
          label={t('features.rule_engine.total_conditions')}
          value={String(stats.conditions)}
          icon={Icons.layoutGrid}
          iconBg="bg-info-100 dark:bg-info-900/40"
          iconColor="text-info-600 dark:text-info-400"
          showMenu={false}
        />
      </div>

      <FeatureTabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'list' && (
        <RuleList
          rules={rules}
          selectedRuleId={selectedRuleId}
          onSelect={handleSelectRule}
          onToggle={toggleRule}
          onDuplicate={duplicateRule}
          onDelete={deleteRule}
          onCreateNew={handleNewRule}
          onCreateFromTemplate={createFromTemplate}
        />
      )}

      {activeTab === 'editor' && (
        <RuleEditor
          rule={selectedRule}
          onSave={handleSaveRule}
          onCancel={handleCancelEdit}
          isNew={isNewRule}
        />
      )}

      {activeTab === 'tester' && <RuleTester rules={rules.filter((r) => r.enabled)} />}

      {activeTab === 'list' && rules.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('features.rule_engine.available_templates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ruleTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => createFromTemplate(template.id)}
                  className="rounded-lg border border-surface-200 p-4 text-left transition-colors hover:border-theme-primary hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-800"
                >
                  <div className="text-body-sm font-medium text-secondary-900 dark:text-white">
                    {template.name}
                  </div>
                  <div className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Rule List Component
 * Displays all rules with management actions
 */

import { useMemo, useState } from 'react'
import { Icon } from '@/components/common'
import { Badge, Button, Card, CardContent, CardHeader, Input } from '@/components/ui'
import { cn } from '@/components/ui/cn'
import type { Rule } from '../types'
import { ruleTemplates } from '../config'

interface RuleListProps {
  rules: Rule[]
  selectedRuleId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onCreateNew: () => void
  onCreateFromTemplate: (templateId: string) => void
}

export function RuleList({
  rules,
  selectedRuleId,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
  onCreateNew,
  onCreateFromTemplate,
}: RuleListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const allTags = useMemo(() => Array.from(new Set(rules.flatMap((r) => r.tags))), [rules])

  const sortedRules = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return [...rules]
      .filter((rule) => {
        const matchesSearch =
          rule.name.toLowerCase().includes(query) ||
          rule.description.toLowerCase().includes(query)
        const matchesTag = !filterTag || rule.tags.includes(filterTag)
        return matchesSearch && matchesTag
      })
      .sort((a, b) => b.priority - a.priority)
  }, [rules, searchQuery, filterTag])

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="mb-0 border-b border-surface-200 px-6 py-5 dark:border-surface-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
            {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowTemplates(!showTemplates)}>
              <Icon icon="solar:document-linear" />
              Templates
            </Button>
            <Button type="button" onClick={onCreateNew}>
              <Icon icon="solar:add-circle-linear" />
              Create Rule
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules..."
            prefix={<Icon icon="solar:magnifer-linear" className="h-4 w-4 text-secondary-400" />}
            className="flex-1"
          />
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Button
                type="button"
                size="sm"
                variant={!filterTag ? 'primary' : 'secondary'}
                onClick={() => setFilterTag(null)}
              >
                All
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={filterTag === tag ? 'primary' : 'secondary'}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      {showTemplates && (
        <div className="border-b border-surface-200 bg-surface-50 px-6 py-4 dark:border-surface-700 dark:bg-surface-900/30">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-body-sm font-semibold text-secondary-900 dark:text-white">
              Quick Start Templates
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowTemplates(false)}
              aria-label="Close templates"
            >
              <Icon icon="solar:close-circle-linear" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ruleTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  onCreateFromTemplate(template.id)
                  setShowTemplates(false)
                }}
                className="flex items-start gap-3 rounded-lg border border-surface-200 bg-white p-3 text-left transition-colors hover:border-theme-primary dark:border-surface-700 dark:bg-surface-800"
              >
                <div className="rounded-lg bg-surface-100 p-2 dark:bg-surface-700">
                  <Icon icon={template.icon} className="h-5 w-5 text-secondary-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-secondary-900 dark:text-white">
                    {template.name}
                  </p>
                  <p className="line-clamp-2 text-xs text-secondary-500">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <CardContent className="max-h-[600px] divide-y divide-surface-100 overflow-y-auto p-0 dark:divide-surface-800">
        {sortedRules.map((rule) => (
          <div
            key={rule.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(rule.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(rule.id)
            }}
            className={cn(
              'cursor-pointer px-6 py-4 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50',
              selectedRuleId === rule.id &&
                'border-l-4 border-l-theme-primary bg-primary-50 dark:bg-primary-900/20',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconOnly
                  className={cn(
                    'mt-0.5 shrink-0',
                    rule.enabled
                      ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                      : '',
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(rule.id)
                  }}
                  aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
                >
                  <Icon
                    icon={rule.enabled ? 'solar:check-circle-bold' : 'solar:close-circle-linear'}
                  />
                </Button>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="truncate text-body-sm font-semibold text-secondary-900 dark:text-white">
                      {rule.name || 'Untitled Rule'}
                    </h4>
                    <Badge
                      variant={
                        rule.priority >= 8 ? 'danger' : rule.priority >= 5 ? 'warning' : 'neutral'
                      }
                    >
                      P{rule.priority}
                    </Badge>
                  </div>

                  <p className="mb-2 truncate text-xs text-secondary-500">{rule.description || 'No description'}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-400">
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:filter-linear" className="h-3.5 w-3.5" />
                      {rule.conditionGroup.conditions.length} conditions
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:bolt-linear" className="h-3.5 w-3.5" />
                      {rule.actions.length} actions
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:graph-up-linear" className="h-3.5 w-3.5" />
                      {rule.triggerCount} triggers
                    </span>
                  </div>

                  {rule.tags.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {rule.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="neutral" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {rule.tags.length > 3 && (
                        <span className="text-[10px] text-secondary-400">+{rule.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(rule.id)
                  }}
                  aria-label="Duplicate rule"
                >
                  <Icon icon="solar:copy-linear" />
                </Button>

                {deleteConfirmId === rule.id ? (
                  <div className="flex items-center gap-1 rounded-lg bg-danger-50 px-2 py-1 dark:bg-danger-900/30">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-danger-600 dark:text-danger-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(rule.id)
                        setDeleteConfirmId(null)
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirmId(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirmId(rule.id)
                    }}
                    aria-label="Delete rule"
                  >
                    <Icon icon="solar:trash-bin-2-linear" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedRules.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="mb-4 rounded-full bg-surface-100 p-4 dark:bg-surface-800">
              <Icon icon="solar:code-linear" className="h-10 w-10 text-secondary-300 dark:text-secondary-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-secondary-700 dark:text-secondary-300">
              {searchQuery || filterTag ? 'No rules found' : 'No rules yet'}
            </h3>
            <p className="max-w-sm text-center text-body-sm text-secondary-500">
              {searchQuery || filterTag
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first rule to start automating your workflow'}
            </p>
            {!searchQuery && !filterTag && (
              <Button type="button" className="mt-4" onClick={onCreateNew}>
                <Icon icon="solar:add-circle-linear" />
                Create First Rule
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

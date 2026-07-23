import { useCallback, useMemo, useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { StatCard } from '@/components/dashboard'
import { FeaturePageHeader } from '@/components/features'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useLocale } from '@/i18n'
import {
  useQueryBuilder,
  QueryBuilder,
  queryPresets,
  queryFields,
  countFilters,
  exportQuery,
} from '../../features/query-builder'

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', age: 28, role: 'admin', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', age: 34, role: 'user', createdAt: '2024-02-20' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'inactive', age: 45, role: 'user', createdAt: '2024-01-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', age: 29, role: 'moderator', createdAt: '2024-03-05' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: 'pending', age: 52, role: 'user', createdAt: '2024-02-28' },
  { id: 6, name: 'Diana Evans', email: 'diana@example.com', status: 'active', age: 31, role: 'admin', createdAt: '2024-01-22' },
  { id: 7, name: 'Edward Foster', email: 'edward@example.com', status: 'inactive', age: 38, role: 'user', createdAt: '2024-03-10' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', status: 'active', age: 26, role: 'user', createdAt: '2024-02-14' },
]

export function QueryBuilderPage() {
  const [showPresets, setShowPresets] = useState(false)
  const { t } = useLocale()

  const {
    query,
    setQuery,
    result,
    isExecuting,
    lastExecutedAt,
    execute,
    loadPreset,
    resetQuery,
  } = useQueryBuilder()

  const handleExecute = useCallback(() => {
    execute(sampleData)
  }, [execute])

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId)
    setShowPresets(false)
  }

  const handleCopyExport = (format: 'json' | 'sql') => {
    const data = exportQuery(query, format)
    void navigator.clipboard.writeText(data)
  }

  const totalFilters = useMemo(() => countFilters(query.filterGroup), [query.filterGroup])
  const fieldCategories = useMemo(
    () => new Set(queryFields.map((f) => f.category)).size,
    [],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <FeaturePageHeader
        icon={Icons.queryBuilder}
        iconWrapClassName="bg-info-100 text-info-600 dark:bg-info-900/40 dark:text-info-400"
        title={t('features.query_builder.title')}
        subtitle={t('features.query_builder.subtitle')}
        actions={
          <>
            <div className="relative">
              <Button type="button" variant="secondary" onClick={() => setShowPresets(!showPresets)}>
                <Icon icon={Icons.bookmark} />
                {t('features.query_builder.presets')}
              </Button>
              {showPresets && (
                <Card padding="none" className="absolute right-0 z-50 mt-2 w-80 overflow-hidden shadow-lg">
                  <div className="border-b border-surface-200 p-3 dark:border-surface-700">
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {t('features.query_builder.query_presets')}
                    </p>
                    <p className="text-xs text-secondary-500">{t('features.query_builder.prebuilt_templates')}</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {queryPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleLoadPreset(preset.id)}
                        className="w-full rounded-lg p-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800"
                      >
                        <div className="text-body-sm font-medium text-secondary-900 dark:text-white">
                          {preset.name}
                        </div>
                        <div className="mt-1 text-xs text-secondary-500">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
            <Button type="button" variant="secondary" onClick={() => handleCopyExport('json')}>
              <Icon icon={Icons.code} />
              JSON
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleCopyExport('sql')}>
              <Icon icon={Icons.database} />
              SQL
            </Button>
            <Button type="button" variant="ghost" iconOnly onClick={resetQuery} aria-label="Reset query">
              <Icon icon={Icons.trash} />
            </Button>
            <Button type="button" onClick={handleExecute} disabled={isExecuting}>
              <Icon icon={isExecuting ? Icons.refresh : Icons.bolt} className={isExecuting ? 'animate-spin' : ''} />
              {t('features.query_builder.execute')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('features.query_builder.filters')}
          value={String(totalFilters)}
          icon={Icons.filter}
          iconBg="bg-info-100 dark:bg-info-900/40"
          iconColor="text-info-600 dark:text-info-400"
          showMenu={false}
        />
        <StatCard
          label={t('features.query_builder.categories')}
          value={String(fieldCategories)}
          icon={Icons.layoutGrid}
          iconBg="bg-accent-100 dark:bg-accent-900/40"
          iconColor="text-accent-600 dark:text-accent-400"
          showMenu={false}
        />
        <StatCard
          label={t('features.query_builder.results')}
          value={String(result?.filtered ?? 0)}
          icon={Icons.circleCheck}
          iconBg="bg-success-100 dark:bg-success-900/40"
          iconColor="text-success-600 dark:text-success-400"
          showMenu={false}
        />
        <StatCard
          label={t('features.query_builder.last_run')}
          value={lastExecutedAt ? new Date(lastExecutedAt).toLocaleTimeString() : t('features.query_builder.never')}
          icon={Icons.clock}
          showMenu={false}
        />
      </div>

      <QueryBuilder query={query} onChange={setQuery} onExecute={handleExecute} />

      {result && result.data.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="mb-0 flex-row items-center justify-between border-b border-surface-200 px-6 py-4 dark:border-surface-700">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <Icon icon={Icons.list} className="text-secondary-500" />
                {t('features.query_builder.query_results')}
              </CardTitle>
              <Badge variant="success">
                {result.filtered} of {result.total} matches
              </Badge>
              <span className="text-xs text-secondary-500">({result.executionTime.toFixed(2)}ms)</span>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  {Object.keys(result.data[0] as Record<string, unknown>).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {result.data.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    {Object.values(row as Record<string, unknown>).map((value, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-body-sm text-secondary-900 dark:text-secondary-100">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.data.length > 10 && (
              <div className="bg-surface-50 px-6 py-4 text-center dark:bg-surface-800">
                <span className="text-body-sm text-secondary-500">
                  Showing 10 of {result.data.length} results
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * eCommerce Dashboard
 */
import { Icon, Icons } from '@/components/common'
import { LineChart, DoughnutChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { ChartCard, DashboardPageHeader, ProgressBar, StatCard } from '@/components/dashboard'
import { Button, Card } from '@/components/ui'
import { products, orders, orderStatusConfig, stockStatusConfig } from '@/data'
import { useLocale } from '@/i18n'

export function EcommerceDashboard() {
  const { t } = useLocale()

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Revenue',
      data: [32000, 42000, 38000, 52000, 48000, 61000, 68000],
      borderColor: chartColors.green.solid,
      backgroundColor: 'transparent',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }],
  }

  const categoryData = {
    labels: ['Electronics', 'Fashion', 'Home', 'Sports'],
    datasets: [{
      data: [35, 25, 22, 18],
      backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.green.solid, chartColors.orange.solid],
      borderWidth: 0,
      cutout: '70%',
    }],
  }

  return (
    <div className="animate-fade-in space-y-6">
      <DashboardPageHeader
        title={t('dashboard.ecommerce_overview')}
        subtitle={t('dashboard.manage_store')}
        actions={
          <>
            <Button variant="outline">
              <Icon icon={Icons.filter} />
              {t('dashboard.filter')}
            </Button>
            <Button>
              <Icon icon={Icons.plus} />
              {t('dashboard.add_product')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-6 xl:col-span-3">
          <Card padding="none" className="overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-surface-200 p-6 dark:border-surface-700">
              <div>
                <h2 className="heading-4 text-secondary-900 dark:text-white">{t('dashboard.top_products')}</h2>
                <p className="mt-0.5 text-body-sm text-secondary-500 dark:text-secondary-400">
                  {t('dashboard.best_selling_items')}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm">
                {t('dashboard.view_all')}
                <Icon icon={Icons.chevronRight} />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.product')}</th>
                    <th className="px-6 py-3 text-left text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.sku')}</th>
                    <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.price')}</th>
                    <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.stock')}</th>
                    <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.sold')}</th>
                    <th className="px-6 py-3 text-center text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.rating')}</th>
                    <th className="px-6 py-3 text-right text-caption font-semibold uppercase tracking-wider text-secondary-500">{t('dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                            <Icon icon={Icons.image} className="h-5 w-5 text-secondary-400" />
                          </div>
                          <p className="text-label text-secondary-900 dark:text-white">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-body-sm text-secondary-500">{product.sku}</td>
                      <td className="px-6 py-4 text-right text-label text-secondary-900 dark:text-white">${product.price}</td>
                      <td className="px-6 py-4 text-right text-body-sm text-secondary-600 dark:text-secondary-400">{product.stock}</td>
                      <td className="px-6 py-4 text-right text-body-sm text-secondary-600 dark:text-secondary-400">{product.sold}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-warning-50 px-2 py-1 text-body-sm text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
                          <Icon icon={Icons.star} className="h-3.5 w-3.5 text-warning-400" />
                          {product.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stockStatusConfig[product.status || 'active'].color}`}>
                          {stockStatusConfig[product.status || 'active'].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card padding="none" className="overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-surface-200 p-6 dark:border-surface-700">
              <div>
                <h2 className="heading-4 text-secondary-900 dark:text-white">{t('dashboard.recent_orders')}</h2>
                <p className="mt-0.5 text-body-sm text-secondary-500 dark:text-secondary-400">
                  {t('dashboard.latest_transactions')}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm">
                {t('dashboard.view_all')}
                <Icon icon={Icons.chevronRight} />
              </Button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {orders.map((order) => {
                const status = orderStatusConfig[order.status]
                const statusIcon = order.status === 'delivered' ? Icons.check : order.status === 'shipped' ? Icons.truck : Icons.clock
                return (
                  <div key={order.id} className="group p-4 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${status.bg}`}>
                          <Icon icon={statusIcon} className={`h-6 w-6 ${status.color}`} />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-label text-secondary-900 dark:text-white">{order.id}</span>
                            <span className={`rounded-full border border-current/10 px-2 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-body-sm text-secondary-500">
                            {order.customer} · <span className="text-secondary-400">{order.items} items</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-label text-secondary-900 dark:text-white">${order.total.toFixed(2)}</p>
                        <p className="mt-1 text-caption text-secondary-400">{order.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-1">
          <div className="space-y-4">
            <StatCard
              label={t('dashboard.total_revenue')}
              value="$84,245"
              change="12.5%"
              icon={Icons.currencyDollar}
              iconBg="bg-green-100 dark:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.total_orders')}
              value="2,845"
              change="8.1%"
              icon={Icons.shopping}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.products_sold')}
              value="5,428"
              change="2.3%"
              isPositive={false}
              icon={Icons.package}
              iconBg="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.growth_rate')}
              value="+15.3%"
              change="4.2%"
              icon={Icons.trendingUp}
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              iconColor="text-orange-600 dark:text-orange-400"
              showMenu={false}
            />
          </div>

          <Card padding="sm" className="rounded-xl">
            <ProgressBar label={t('dashboard.monthly_goal')} value={85} rightLabel="$84,245 / $100,000" />
          </Card>

          <ChartCard title={t('dashboard.revenue_trend')} subtitle={t('dashboard.last_7_months')}>
            <LineChart data={revenueData} height={180} options={{ plugins: { legend: { display: false } } }} />
          </ChartCard>

          <ChartCard title={t('dashboard.by_category')} subtitle={t('dashboard.sales_distribution')}>
            <div className="mb-6 flex justify-center">
              <DoughnutChart data={categoryData} height={160} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Electronics', 'Fashion', 'Home', 'Sports'].map((cat, i) => (
                <div key={cat} className="flex items-center gap-2 rounded-lg bg-surface-50 p-2 dark:bg-surface-800/50">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.green.solid, chartColors.orange.solid][i] }}
                  />
                  <span className="truncate text-caption font-medium text-secondary-700 dark:text-secondary-300">{cat}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

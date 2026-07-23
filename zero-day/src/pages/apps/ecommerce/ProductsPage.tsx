import { useState } from 'react'
import { Link } from 'react-router'
import { SearchField } from '@/components/apps'
import { Icon, Icons } from '@/components/common'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Select } from '@/components/ui'
import { products, categories } from '@/data/ecommerce'
import { useLocale } from '@/i18n'

export default function ProductsPage() {
  const { t } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
        return (b.sold || 0) - (a.sold || 0)
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardPageHeader
        title={t('ecommerce.products_title')}
        subtitle={t('ecommerce.products_description')}
        actions={
          <Button asChild>
            <Link to="/app/ecommerce/products/create">
              <Icon icon={Icons.plus} className="w-4 h-4" width={16} height={16} />
              {t('ecommerce.add_product')}
            </Link>
          </Button>
        }
      />

      {/* Search and Filter Bar */}
      <div className="card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchField
            className="flex-1"
            placeholder={t('ecommerce.search_products')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* View Mode Toggle */}
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-surface-900 text-theme-primary shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
              }`}
            >
              <Icon icon={Icons.layoutGrid} className="w-5 h-5" width={20} height={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-surface-900 text-theme-primary shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
              }`}
            >
              <Icon icon={Icons.list} className="w-5 h-5" width={20} height={20} />
            </button>
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'bg-theme-primary-light border-theme-primary/30 text-theme-primary'
                  : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <Icon icon={Icons.filter} className="w-4 h-4" width={16} height={16} />
              {t('common.filter')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-theme-primary text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <Icon icon={Icons.chevronDown} className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} width={16} height={16} />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-[1040]" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-[1050] animate-fade-in">
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{t('common.filters')}</h3>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedCategory('All')
                            setSortBy('newest')
                          }}
                          className="text-xs text-theme-primary hover:underline"
                        >
                          {t('ecommerce.clear_all')}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="label mb-2 block">
                        {t('ecommerce.sort_by')}
                      </label>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">{t('ecommerce.sort.newest_first')}</option>
                        <option value="popular">{t('ecommerce.sort.most_popular')}</option>
                        <option value="rating">{t('ecommerce.sort.highest_rated')}</option>
                        <option value="price-low">{t('ecommerce.price_low_high')}</option>
                        <option value="price-high">{t('ecommerce.price_high_low')}</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-theme-primary text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-theme-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="card group overflow-hidden rounded-xl transition-colors"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-surface-100 dark:bg-surface-800">
                <Link to={`/app/ecommerce/products/${product.id}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                      {t('common.new')}
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-2 py-1 bg-danger-500 text-white text-xs font-medium rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    <Icon icon={Icons.heart} width={18} height={18} className="text-secondary-600 dark:text-secondary-400" />
                  </button>
                  <Link
                    to={`/app/ecommerce/products/${product.id}`}
                    className="p-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    <Icon icon={Icons.eye} width={18} height={18} className="text-secondary-600 dark:text-secondary-400" />
                  </Link>
                </div>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{t('ecommerce.out_of_stock')}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category & Brand */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {product.category}
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {product.brand}
                  </span>
                </div>

                {/* Name */}
                <Link to={`/app/ecommerce/products/${product.id}`}>
                  <h3 className="text-ui font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2 hover:text-theme-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Icon icon={Icons.star} width={14} height={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-secondary-400">({t('ecommerce.reviews_count', { count: product.reviews })})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-secondary-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm" disabled={product.stock === 0}>
                    <Icon icon={Icons.shopping} width={18} height={18} />
                    {t('ecommerce.add_to_cart')}
                  </Button>
                  <Link
                    to={`/app/ecommerce/products/${product.id}/edit`}
                    className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-secondary-900 dark:text-white rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  >
                    {t('common.edit')}
                  </Link>
                </div>

                {/* Stock Info */}
                <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary-500 dark:text-secondary-400">{t('ecommerce.stock')}:</span>
                    <span
                      className={`font-medium ${
                        product.stock === 0
                          ? 'text-danger-500'
                          : product.stock < 20
                          ? 'text-orange-500'
                          : 'text-success-500'
                      }`}
                    >
                      {product.stock} {t('ecommerce.units')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {sortedProducts.map((product) => (
            <div key={product.id} className="card rounded-xl p-5 flex gap-5">
              {/* Image */}
              <Link
                to={`/app/ecommerce/products/${product.id}`}
                className="flex-shrink-0"
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Link to={`/app/ecommerce/products/${product.id}`}>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white hover:text-theme-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                      <span>{product.brand}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>
                        {t('ecommerce.sku')}: {product.sku}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/app/ecommerce/products/${product.id}/edit`}
                      className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-secondary-900 dark:text-white rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-sm"
                    >
                      {t('common.edit')}
                    </Link>
                  </div>
                </div>

                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Icon icon={Icons.star} width={16} height={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {product.rating}
                      </span>
                      <span className="text-sm text-secondary-400">
                        ({t('ecommerce.reviews_count', { count: product.reviews })})
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="text-sm">
                      <span className="text-secondary-500 dark:text-secondary-400">
                        {t('ecommerce.stock')}:{' '}
                      </span>
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? 'text-danger-500'
                            : product.stock < 20
                            ? 'text-orange-500'
                            : 'text-success-500'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>

                    {/* Sold */}
                    {product.sold && (
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {t('ecommerce.sold')}: {product.sold}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xl font-semibold text-secondary-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-secondary-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <Button size="sm" disabled={product.stock === 0}>
                      <Icon icon={Icons.shopping} width={18} height={18} />
                      {t('ecommerce.add_to_cart')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {sortedProducts.length === 0 && (
        <div className="card rounded-xl p-12 text-center">
          <p className="text-secondary-500 dark:text-secondary-400">
            {t('ecommerce.no_products_found')}
          </p>
        </div>
      )}
    </div>
  )
}

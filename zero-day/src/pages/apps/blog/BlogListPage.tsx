import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SearchField } from '@/components/apps'
import { Icon, Icons } from '@/components/common'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Select } from '@/components/ui'
import { blogPosts, blogCategories, categoryColors, type BlogPost } from '@/data/blog'
import { useLocale } from '@/i18n'

type ViewMode = 'grid' | 'list'

/**
 * Blog Listing Page Component
 * Displays all blog posts with filtering and search
 */
export function BlogListPage() {
  const { t, locale } = useLocale()
  const navigate = useNavigate()
  const [posts] = useState<BlogPost[]>(blogPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory
    
    return matchesSearch && matchesCategory && post.status === 'published'
  })

  // Handle post click
  const handlePostClick = (post: BlogPost) => {
    navigate(`/app/blog/${post.slug}`)
  }

  // Clear filters
  const clearFilters = () => {
    setFilterCategory('All')
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const activeFilterCount = filterCategory !== 'All' ? 1 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardPageHeader
        title={t('blog.title')}
        subtitle={t('blog.description')}
        actions={
          <Button onClick={() => navigate('/app/blog/create')}>
            <Icon icon={Icons.plus} className="w-4 h-4" width={16} height={16} />
            {t('blog.new_post')}
          </Button>
        }
      />

      {/* Search and Filter Bar */}
      <div className="card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchField
            className="flex-1"
            placeholder={t('blog.search_placeholder')}
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
              {t('blog.filter')}
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
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{t('blog.filters')}</h3>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-theme-primary hover:underline"
                        >
                          {t('blog.clear_all')}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="label mb-2 block">
                        {t('blog.category')}
                      </label>
                      <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        {blogCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                    <Button fullWidth onClick={() => setIsFilterOpen(false)}>
                      {t('blog.apply_filters')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-theme-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          {t('blog.title')}: {filteredPosts.length} {filteredPosts.length === 1 ? t('blog.post_singular') : t('blog.post_plural')}
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const categoryColor = categoryColors[post.category] || categoryColors.Technology
            return (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="card group cursor-pointer overflow-hidden rounded-xl transition-colors duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-70 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                      {post.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-surface-800/90 rounded-lg text-secondary-500 hover:text-theme-primary transition-colors"
                  >
                    <Icon icon={Icons.bookmark} className="w-4 h-4" width={16} height={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Icon icon={Icons.calendar} className="w-3.5 h-3.5" width={14} height={14} />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon={Icons.clock} className="w-3.5 h-3.5" width={14} height={14} />
                      {post.readTime} {t('blog.min_read_label')}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 line-clamp-2 group-hover:text-theme-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Author & Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-100 dark:ring-surface-700"
                      />
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {post.author.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400">
                      <span className="flex items-center gap-1">
                        <Icon icon={Icons.eye} className="w-4 h-4" width={16} height={16} />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon={Icons.heart} className="w-4 h-4" width={16} height={16} />
                        {formatNumber(post.likes)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const categoryColor = categoryColors[post.category] || categoryColors.Technology
            return (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="card group cursor-pointer overflow-hidden rounded-xl transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Cover Image */}
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Category & Meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                            <Icon icon={Icons.calendar} className="w-3.5 h-3.5" width={14} height={14} />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                            <Icon icon={Icons.clock} className="w-3.5 h-3.5" width={14} height={14} />
                            {post.readTime} {t('blog.min_read_label')}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-theme-primary transition-colors">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        {/* Author & Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-100 dark:ring-surface-700"
                            />
                            <div>
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                {post.author.name}
                              </p>
                              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                {post.author.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                            <span className="flex items-center gap-1">
                              <Icon icon={Icons.eye} className="w-4 h-4" width={16} height={16} />
                              {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon icon={Icons.heart} className="w-4 h-4" width={16} height={16} />
                              {formatNumber(post.likes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon icon={Icons.message} className="w-4 h-4" width={16} height={16} />
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="hidden sm:flex p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 hover:text-theme-primary transition-colors"
                      >
                        <Icon icon={Icons.bookmark} className="w-5 h-5" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="card rounded-xl py-16 text-center">
          <Icon icon={Icons.search} className="w-12 h-12 mx-auto text-secondary-300 dark:text-secondary-600 mb-3" width={48} height={48} />
          <p className="text-secondary-500 dark:text-secondary-400">{t('blog.no_posts')}</p>
          <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1">
            {t('blog.no_posts_desc')}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-theme-primary hover:underline font-medium"
            >
              {t('blog.clear_filters')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default BlogListPage

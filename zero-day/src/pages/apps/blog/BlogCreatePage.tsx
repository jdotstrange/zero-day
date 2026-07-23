import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button, FormField, Input, Select, Textarea } from '@/components/ui'
import { blogCategories } from '@/data/blog'
import { useLocale } from '@/i18n'

const ToolbarButton = ({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick?: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
    title={label}
  >
    <Icon icon={icon} className="w-4 h-4" width={16} height={16} />
  </button>
)

/**
 * Blog Create/Edit Page Component
 * Full page form for creating new blog posts
 */
export function BlogCreatePage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  
  // Form state
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [publishDate, setPublishDate] = useState('')
  const [readTime, setReadTime] = useState(5)
  
  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // Handle tag add
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // Handle tag remove
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Handle image upload simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate upload - in real app, this would upload to server
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle save draft
  const handleSaveDraft = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStatus('draft')
    setIsSaving(false)
    // Show success message (in real app)
    alert(t('blog.alert_draft_saved'))
  }

  // Handle publish
  const handlePublish = async () => {
    if (!title.trim()) {
      alert(t('blog.validation.title_required'))
      return
    }
    if (!category) {
      alert(t('blog.validation.category_required'))
      return
    }
    if (!content.trim()) {
      alert(t('blog.validation.content_required'))
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStatus('published')
    setIsSaving(false)
    // Navigate back to blog list
    navigate('/app/blog')
  }

  // Categories without 'All'
  const selectableCategories = blogCategories.filter(cat => cat !== 'All')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/app/blog"
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <Icon icon={Icons.arrowLeft} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" width={20} height={20} />
          </Link>
          <div>
            <h1 className="heading-2 text-secondary-900 dark:text-white">{t('blog.create_title')}</h1>
            <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {t('blog.create_description')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            size="sm"
          >
            <Icon icon={Icons.eye} className="w-4 h-4" width={16} height={16} />
            {isPreview ? t('blog.edit') : t('blog.preview')}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving}
            loading={isSaving}
            size="sm"
          >
            <Icon icon={Icons.deviceFloppy} className="w-4 h-4" width={16} height={16} />
            {t('blog.save_draft')}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSaving}
            loading={isSaving}
            size="sm"
          >
            <Icon icon={Icons.send} className="w-4 h-4" width={16} height={16} />
            {t('blog.publish')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="card rounded-xl p-6">
            <FormField label={t('blog.post_title')} required>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('blog.post_title_placeholder')}
                inputSize="lg"
              />
            </FormField>
          </div>

          {/* Excerpt */}
          <div className="card rounded-xl p-6">
            <FormField label={t('blog.excerpt')} hint={t('blog.excerpt_help')}>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t('blog.excerpt_placeholder')}
                rows={3}
                className="resize-none"
              />
            </FormField>
          </div>

          {/* Content Editor */}
          <div className="card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-surface-200 dark:border-surface-700">
              <FormField label={t('blog.content')} required>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div className="flex items-center gap-0.5 pe-2 border-e border-surface-200 dark:border-surface-700">
                  <ToolbarButton icon={Icons.heading} label={t('blog.toolbar.heading_1')} />
                  <ToolbarButton icon={Icons.heading} label={t('blog.toolbar.heading_2')} />
                </div>
                <div className="flex items-center gap-0.5 px-2 border-e border-surface-200 dark:border-surface-700">
                  <ToolbarButton icon={Icons.textBold} label={t('blog.toolbar.bold')} />
                  <ToolbarButton icon={Icons.textItalic} label={t('blog.toolbar.italic')} />
                  <ToolbarButton icon={Icons.textUnderline} label={t('blog.toolbar.underline')} />
                </div>
                <div className="flex items-center gap-0.5 px-2 border-e border-surface-200 dark:border-surface-700">
                  <ToolbarButton icon={Icons.textAlignLeft} label={t('blog.toolbar.align_left')} />
                  <ToolbarButton icon={Icons.textAlignCenter} label={t('blog.toolbar.align_center')} />
                  <ToolbarButton icon={Icons.textAlignRight} label={t('blog.toolbar.align_right')} />
                </div>
                <div className="flex items-center gap-0.5 px-2 border-e border-surface-200 dark:border-surface-700">
                  <ToolbarButton icon={Icons.list} label={t('blog.toolbar.bullet_list')} />
                  <ToolbarButton icon={Icons.listNumbers} label={t('blog.toolbar.numbered_list')} />
                </div>
                <div className="flex items-center gap-0.5 px-2">
                  <ToolbarButton icon={Icons.link} label={t('blog.toolbar.insert_link')} />
                  <ToolbarButton icon={Icons.image} label={t('blog.toolbar.insert_image')} />
                  <ToolbarButton icon={Icons.code} label={t('blog.toolbar.code_block')} />
                  <ToolbarButton icon={Icons.quote} label={t('blog.toolbar.quote')} />
                </div>
              </div>
              </FormField>
            </div>

            {/* Editor */}
            <div className="p-4">
              {isPreview ? (
                <div 
                  className="min-h-[400px] prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || `<p class="text-secondary-400">${t('blog.nothing_to_preview')}</p>` }}
                />
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('blog.content_placeholder')}
                  className="min-h-[400px] resize-y"
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="card rounded-xl p-6">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              <Icon icon={Icons.photo} className="w-4 h-4 inline-block me-2" width={16} height={16} />
              {t('blog.cover_image')}
            </label>
            
            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={coverImage}
                  alt={t('blog.cover_preview_alt')}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors"
                >
                  <Icon icon={Icons.x} className="w-4 h-4" width={16} height={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl cursor-pointer hover:border-theme-primary hover:bg-theme-primary/5 transition-all">
                <Icon icon={Icons.upload} className="w-10 h-10 text-secondary-400 mb-2" width={40} height={40} />
                <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('blog.click_upload')}</p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">{t('blog.image_format')}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="card rounded-xl p-6">
            <FormField
              label={
                <>
                  <Icon icon={Icons.category} className="w-4 h-4 inline-block me-2" width={16} height={16} />
                  {t('blog.category')}
                </>
              }
              required
            >
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">{t('blog.select_category')}</option>
                {selectableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Tags */}
          <div className="card rounded-xl p-6">
            <FormField
              label={
                <>
                  <Icon icon={Icons.tag} className="w-4 h-4 inline-block me-2" width={16} height={16} />
                  {t('blog.tags')}
                </>
              }
              hint={t('blog.press_enter_to_add_tag')}
            >
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-theme-primary-light text-theme-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-danger-500 transition-colors"
                      >
                        <Icon icon={Icons.x} className="w-3.5 h-3.5" width={14} height={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={t('blog.add_tag_placeholder')}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  {t('common.add')}
                </Button>
              </div>
            </FormField>
          </div>

          {/* Publishing Options */}
          <div className="card rounded-xl p-6">
            <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-4">
              {t('blog.publish_settings')}
            </h3>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-2">
                {t('common.status')}
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="w-4 h-4 text-theme-primary focus:ring-theme-primary/20"
                  />
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">{t('blog.draft')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="w-4 h-4 text-theme-primary focus:ring-theme-primary/20"
                  />
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">{t('blog.published')}</span>
                </label>
              </div>
            </div>

            <FormField label={t('blog.publish_date')}>
              <Input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </FormField>

            <FormField
              label={`${t('blog.read_time')} (${t('blog.minutes')})`}
              className="mt-4"
            >
              <Input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                min={1}
                max={60}
              />
            </FormField>
          </div>

          {/* SEO Preview */}
          <div className="card rounded-xl p-6">
            <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-4">
              {t('blog.seo_preview')}
            </h3>
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <p className="text-sm text-theme-primary font-medium truncate">
                {title || t('blog.post_title')}
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                example.com/blog/{title ? title.toLowerCase().replace(/\s+/g, '-').slice(0, 30) : 'post-slug'}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 line-clamp-2">
                {excerpt || t('blog.seo_excerpt_placeholder')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCreatePage

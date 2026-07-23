import { useState } from 'react'
import { SearchField } from '@/components/apps'
import { Icon, Icons } from '@/components/common'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, FormField, Input, Select, Textarea } from '@/components/ui'
import { notesData, noteCategories, noteColors, type Note } from '@/data/notes'
import { useLocale } from '@/i18n'

const emptyFormData = {
  title: '',
  content: '',
  category: 'Personal',
  color: 'default',
  isPinned: false,
  tags: '',
}

export default function NotesPage() {
  const { t, locale } = useLocale()
  const [notes, setNotes] = useState<Note[]>(notesData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated')
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState(emptyFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Pinned notes always come first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    switch (sortBy) {
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'updated':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  // Get color classes
  const getColorClasses = (color: string) => {
    const colorObj = noteColors.find((c) => c.value === color)
    return colorObj || noteColors[0]
  }

  // Toggle pin
  const togglePin = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)))
  }

  // Handle add new note
  const handleAddNew = () => {
    setIsEditMode(false)
    setFormData(emptyFormData)
    setFormErrors({})
    setIsFormModalOpen(true)
  }

  // Handle edit note
  const handleEdit = (note: Note) => {
    setIsEditMode(true)
    setSelectedNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
      isPinned: note.isPinned,
      tags: note.tags.join(', '),
    })
    setFormErrors({})
    setIsFormModalOpen(true)
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.title.trim()) errors.title = t('notes.validation.title_required')
    if (!formData.content.trim()) errors.content = t('notes.validation.content_required')
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const now = new Date().toISOString()
    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (isEditMode && selectedNote) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title: formData.title,
                content: formData.content,
                category: formData.category,
                color: formData.color,
                isPinned: formData.isPinned,
                tags,
                updatedAt: now,
              }
            : note
        )
      )
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        color: formData.color,
        isPinned: formData.isPinned,
        tags,
        createdAt: now,
        updatedAt: now,
      }
      setNotes([newNote, ...notes])
    }

    setIsFormModalOpen(false)
    setFormData(emptyFormData)
  }

  // Handle delete click
  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter((note) => note.id !== noteToDelete.id))
      setIsDeleteDialogOpen(false)
      setNoteToDelete(null)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return t('notes.today')
    if (days === 1) return t('notes.yesterday')
    if (days < 7) return t('notes.days_ago', { count: days })
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
  }

  const getCategoryLabel = (category: string) => {
    if (category === 'All') return t('notes.all')
    return t(`notes.category.${category.toLowerCase()}`)
  }

  const getColorLabel = (colorValue: string, fallbackName: string) => {
    const key = `notes.color.${colorValue}`
    const translated = t(key)
    return translated === key ? fallbackName : translated
  }

  return (
    <div>
      <DashboardPageHeader
        className="mb-6"
        title={t('notes.title')}
        subtitle={t('notes.count', { count: sortedNotes.length })}
        actions={
          <Button onClick={handleAddNew}>
            <Icon icon={Icons.plus} width={18} height={18} />
            {t('notes.new_note')}
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="card rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchField
            className="flex-1"
            placeholder={t('notes.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="lg:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {noteCategories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </Select>
          </div>

          <div className="lg:w-48">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'title')}
            >
              <option value="updated">{t('notes.updated')}</option>
              <option value="created">{t('notes.created')}</option>
              <option value="title">{t('notes.title_sort')}</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="card rounded-xl p-12 text-center">
          <p className="text-secondary-500 dark:text-secondary-400">
            {searchQuery || selectedCategory !== 'All'
              ? `${t('notes.no_notes')}. ${t('notes.no_notes_desc')}`
              : t('notes.no_notes_yet')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => {
            const colorClasses = getColorClasses(note.color)
            return (
              <div
                key={note.id}
                className={`${colorClasses.bg} border ${colorClasses.border} group relative flex flex-col rounded-xl p-5 transition-colors`}
              >
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="px-2 py-0.5 bg-surface-100/80 dark:bg-surface-800/80 text-secondary-600 dark:text-secondary-400 text-xs rounded backdrop-blur-sm inline-flex items-center gap-1">
                    <Icon icon={Icons.tag} width={12} height={12} />
                    {getCategoryLabel(note.category)}
                  </span>
                </div>

                {/* Title with Pin */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-ui font-semibold text-secondary-900 dark:text-white line-clamp-2 flex-1">
                    {note.title}
                  </h3>
                  {note.isPinned && (
                    <Icon icon={Icons.pin} width={16} height={16} className="text-secondary-500 dark:text-secondary-400 flex-shrink-0" />
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3 line-clamp-4 whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-3">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-secondary-400 text-xs">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
                    <Icon icon={Icons.calendar} width={14} height={14} />
                    {formatDate(note.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(note.id)}
                      className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded text-secondary-500 hover:text-theme-primary transition-colors"
                      title={note.isPinned ? t('notes.unpin') : t('notes.pin')}
                    >
                      {note.isPinned ? <Icon icon={Icons.pinnedOff} width={16} height={16} /> : <Icon icon={Icons.pin} width={16} height={16} />}
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded text-secondary-500 hover:text-info-600 transition-colors"
                      title={t('common.edit')}
                    >
                      <Icon icon={Icons.edit} width={16} height={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="p-1.5 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded text-secondary-500 hover:text-danger-600 transition-colors"
                      title={t('common.delete')}
                    >
                      <Icon icon={Icons.trash} width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Note Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-surface-900 px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-secondary-900 dark:text-white">
                {isEditMode ? t('notes.edit_title') : t('notes.create_title')}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors"
              >
                <Icon icon={Icons.x} width={20} height={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                <FormField
                  label={t('notes.note_title')}
                  required
                  error={formErrors.title}
                >
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    error={!!formErrors.title}
                    placeholder={t('notes.note_title_placeholder')}
                  />
                </FormField>

                <FormField
                  label={t('notes.content')}
                  required
                  error={formErrors.content}
                >
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    error={!!formErrors.content}
                    placeholder={t('notes.content_placeholder')}
                    className="resize-none"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label={t('notes.category')}>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {noteCategories.filter((c) => c !== 'All').map((category) => (
                        <option key={category} value={category}>
                          {getCategoryLabel(category)}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label={t('notes.color')}>
                    <Select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    >
                      {noteColors.map((color) => (
                        <option key={color.value} value={color.value}>
                          {getColorLabel(color.value, color.name)}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>

                <FormField
                  label={t('notes.tags')}
                  hint={t('common.separate_with_commas')}
                >
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder={t('notes.tags_placeholder')}
                  />
                </FormField>

                {/* Pin */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="w-4 h-4 text-theme-primary rounded"
                    />
                    <span className="text-sm text-secondary-900 dark:text-white">
                      {t('notes.pin_note')}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => setIsFormModalOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" fullWidth>
                  {isEditMode ? t('notes.update_note') : t('notes.add_note')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && noteToDelete && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} width={28} height={28} className="text-danger-600 dark:text-danger-400" />
            </div>

            <h3 className="text-lg font-bold text-secondary-900 dark:text-white text-center mb-2">
              {t('notes.delete_note')}
            </h3>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center mb-6">
              {t('notes.delete_confirm_message', { title: noteToDelete.title })}
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button variant="danger" fullWidth onClick={handleConfirmDelete}>
                {t('notes.delete_note')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

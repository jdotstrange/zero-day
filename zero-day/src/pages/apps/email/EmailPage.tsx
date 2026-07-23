import { useState } from 'react'
import { SearchField } from '@/components/apps'
import { Icon, Icons } from '@/components/common'
import { Button, Input, Textarea } from '@/components/ui'
import { emailsData, emailLabels, type Email } from '@/data'
import { useLocale } from '@/i18n'

/**
 * Email Page Component
 * Full-featured email client interface
 */
export function EmailPage() {
  const { t } = useLocale()
  const [emails, setEmails] = useState<Email[]>(emailsData)
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])

  // Folder configuration with translated labels
  const folders = [
    { id: 'inbox', label: t('apps.email.inbox'), icon: 'inbox', count: 3 },
    { id: 'sent', label: t('apps.email.sent'), icon: 'sent', count: 0 },
    { id: 'drafts', label: t('apps.email.drafts'), icon: 'drafts', count: 2 },
    { id: 'spam', label: t('apps.email.spam'), icon: 'spam', count: 0 },
    { id: 'trash', label: t('apps.email.trash'), icon: 'trash', count: 0 },
  ]

  // Filter emails by folder and search
  const filteredEmails = emails.filter((email) => {
    const matchesFolder = email.folder === selectedFolder
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  // Get unread count for a folder
  const getUnreadCount = (folderId: string) => {
    return emails.filter((e) => e.folder === folderId && !e.isRead).length
  }

  // Toggle star
  const toggleStar = (emailId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setEmails(emails.map((email) =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ))
  }

  // Mark as read
  const markAsRead = (emailId: number) => {
    setEmails(emails.map((email) =>
      email.id === emailId ? { ...email, isRead: true } : email
    ))
  }

  // Open email
  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    markAsRead(email.id)
  }

  // Toggle email selection
  const toggleEmailSelection = (emailId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter((id) => id !== emailId))
    } else {
      setSelectedEmails([...selectedEmails, emailId])
    }
  }

  // Delete selected emails
  const deleteSelected = () => {
    setEmails(emails.map((email) =>
      selectedEmails.includes(email.id) ? { ...email, folder: 'trash' as const } : email
    ))
    setSelectedEmails([])
  }

  // Get label color
  const getLabelColor = (labelId: string) => {
    return emailLabels.find((l) => l.id === labelId)?.color || 'bg-secondary-500'
  }

  return (
    <div className="h-[calc(100vh-112px)] flex animate-fade-in card rounded-xl overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown on md+ */}
      <div className="hidden md:flex w-56 lg:w-60 shrink-0 bg-white dark:bg-surface-900 border-e border-surface-200 dark:border-surface-700 flex-col overflow-hidden">
        {/* Compose Button */}
        <div className="p-4">
          <Button fullWidth onClick={() => setIsComposeOpen(true)}>
            <Icon icon={Icons.plus} className="w-5 h-5" width={20} height={20} />
            {t('apps.email.compose')}
          </Button>
        </div>

        {/* Folders */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-label-sm text-secondary-400 dark:text-secondary-500">
            {t('apps.email.folders')}
          </p>
          {folders.map((folder) => {
            const unreadCount = getUnreadCount(folder.id)
            return (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id)
                  setSelectedEmail(null)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-label transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-theme-primary-light text-theme-primary'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon icon={Icons[folder.icon as keyof typeof Icons]} className="w-5 h-5" width={20} height={20} />
                  {folder.label}
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-caption font-semibold bg-theme-primary text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          })}

          {/* Labels */}
          <p className="px-3 py-2 mt-4 text-label-sm text-secondary-400 dark:text-secondary-500">
            {t('apps.email.labels')}
          </p>
          {emailLabels.map((label) => (
            <button
              key={label.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-label text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <span className={`w-3 h-3 rounded-full ${label.color}`} />
              {label.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List - Fixed width, hidden when email selected on mobile */}
      <div className={`w-full md:w-80 lg:w-96 shrink-0 flex flex-col bg-white dark:bg-surface-900 ${selectedEmail ? 'hidden md:flex' : 'flex'} border-e border-surface-200 dark:border-surface-700`}>
        {/* Toolbar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-2">
            {selectedEmails.length > 0 ? (
              <>
                <span className="text-body-sm text-secondary-600 dark:text-secondary-400">
                  {selectedEmails.length} {t('apps.email.selected')}
                </span>
                <button
                  onClick={deleteSelected}
                  className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg text-secondary-500 hover:text-danger-600 transition-colors"
                >
                  <Icon icon={Icons.trash} className="w-5 h-5" width={20} height={20} />
                </button>
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.archive} className="w-5 h-5" width={20} height={20} />
                </button>
              </>
            ) : (
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors">
                <Icon icon={Icons.refresh} className="w-5 h-5" width={20} height={20} />
              </button>
            )}
          </div>
          <SearchField
            className="relative flex-1 max-w-md ms-4"
            inputClassName="border-0 bg-surface-50 dark:bg-surface-800"
            placeholder={t('apps.email.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Icon icon={Icons.inbox} className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mb-4" width={64} height={64} />
              <p className="text-secondary-500 dark:text-secondary-400 font-medium">{t('apps.email.no_emails_found')}</p>
              <p className="text-body-sm text-secondary-400 dark:text-secondary-500 mt-1">
                {searchQuery ? t('apps.email.try_search') : t('apps.email.folder_empty')}
              </p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-surface-100 dark:border-surface-800 cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id
                    ? 'bg-theme-primary-light'
                    : email.isRead
                    ? 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
                    : 'bg-surface-50 dark:bg-surface-800/30 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => toggleEmailSelection(email.id, e)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedEmails.includes(email.id)
                      ? 'bg-theme-primary border-theme-primary text-white'
                      : 'border-surface-300 dark:border-surface-600 hover:border-theme-primary'
                  }`}
                >
                  {selectedEmails.includes(email.id) && <Icon icon={Icons.check} className="w-3 h-3" width={12} height={12} />}
                </button>

                {/* Star */}
                <button
                  onClick={(e) => toggleStar(email.id, e)}
                  className="p-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors"
                >
                  {email.isStarred ? (
                    <Icon icon={Icons.star} className="w-5 h-5 text-warning-500" width={20} height={20} />
                  ) : (
                    <Icon icon={Icons.star} className="w-5 h-5 text-secondary-400 hover:text-warning-500" width={20} height={20} />
                  )}
                </button>

                {/* Avatar */}
                <img
                  src={email.from.avatar}
                  alt={email.from.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-body-sm truncate ${email.isRead ? 'text-secondary-700 dark:text-secondary-300' : 'font-semibold text-secondary-900 dark:text-white'}`}>
                      {email.from.name}
                    </p>
                    <span className="text-caption text-secondary-500 dark:text-secondary-400 whitespace-nowrap">
                      {email.date}
                    </span>
                  </div>
                  <p className={`text-body-sm truncate ${email.isRead ? 'text-secondary-600 dark:text-secondary-400' : 'font-medium text-secondary-800 dark:text-secondary-200'}`}>
                    {email.subject}
                  </p>
                  <p className="text-caption text-secondary-500 dark:text-secondary-400 truncate mt-0.5">
                    {email.preview}
                  </p>
                </div>

                {/* Indicators */}
                <div className="flex items-center gap-2">
                  {email.hasAttachment && (
                    <Icon icon={Icons.paperclip} className="w-4 h-4 text-secondary-400" width={16} height={16} />
                  )}
                  {email.labels.slice(0, 2).map((label) => (
                    <span key={label} className={`w-2 h-2 rounded-full ${getLabelColor(label)}`} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Detail - Takes remaining space */}
      {selectedEmail ? (
        <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-surface-900 overflow-hidden">
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setSelectedEmail(null)}
              className="md:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors"
            >
              <Icon icon={Icons.arrowLeft} className="w-5 h-5" width={20} height={20} />
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors">
                <Icon icon={Icons.archive} className="w-5 h-5" width={20} height={20} />
              </button>
              <button className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg text-secondary-500 hover:text-danger-600 transition-colors">
                <Icon icon={Icons.trash} className="w-5 h-5" width={20} height={20} />
              </button>
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors">
                <Icon icon={Icons.dotsVertical} className="w-5 h-5" width={20} height={20} />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Subject */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="heading-4 text-secondary-900 dark:text-white">
                {selectedEmail.subject}
              </h1>
              <div className="flex items-center gap-2">
                {selectedEmail.labels.map((label) => {
                  const labelInfo = emailLabels.find((l) => l.id === label)
                  return labelInfo ? (
                    <span
                      key={label}
                      className={`px-2 py-0.5 text-caption font-medium text-white rounded ${labelInfo.color}`}
                    >
                      {labelInfo.label}
                    </span>
                  ) : null
                })}
              </div>
            </div>

            {/* Sender Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmail.from.avatar}
                  alt={selectedEmail.from.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-white">
                    {selectedEmail.from.name}
                  </p>
                  <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
                    {selectedEmail.from.email}
                  </p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-body-sm text-secondary-500 dark:text-secondary-400">
                  {selectedEmail.date}
                </p>
                <p className="text-caption text-secondary-400 dark:text-secondary-500">
                  {selectedEmail.time}
                </p>
              </div>
            </div>

            {/* Body */}
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-secondary-700 dark:text-secondary-300"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />

            {/* Attachments */}
            {selectedEmail.hasAttachment && (
              <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                <p className="text-label text-secondary-900 dark:text-white mb-3">
                  {t('apps.email.attachments')}
                </p>
                <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl w-fit">
                  <div className="w-10 h-10 bg-danger-100 dark:bg-danger-900/30 rounded-lg flex items-center justify-center">
                    <Icon icon={Icons.file} className="w-5 h-5 text-danger-600 dark:text-danger-400" width={20} height={20} />
                  </div>
                  <div>
                    <p className="text-label text-secondary-900 dark:text-white">
                      Document.pdf
                    </p>
                    <p className="text-caption text-secondary-500 dark:text-secondary-400">
                      245 KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reply Actions */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2">
              <Button className="flex-1" size="sm">
                <Icon icon={Icons.arrowLeft} className="w-4 h-4" width={16} height={16} />
                {t('apps.email.reply')}
              </Button>
              <Button variant="secondary" className="flex-1" size="sm">
                <Icon icon={Icons.share} className="w-4 h-4" width={16} height={16} />
                {t('apps.email.forward')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-surface-900">
          <div className="text-center">
            <Icon icon={Icons.mail} className="w-20 h-20 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" width={80} height={80} />
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">{t('apps.email.select_email')}</p>
            <p className="text-body-sm text-secondary-400 dark:text-secondary-500 mt-1">
              {t('apps.email.choose_from_folders')}
            </p>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-[1050] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsComposeOpen(false)}
          />

          {/* Compose Window */}
          <div className="relative w-full sm:w-full sm:max-w-2xl bg-white dark:bg-surface-900 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
              <h3 className="heading-5 text-secondary-900 dark:text-white">{t('apps.email.new_message')}</h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors"
              >
                <Icon icon={Icons.x} className="w-5 h-5" width={20} height={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-200 dark:border-surface-700">
                <label className="text-label text-secondary-500 dark:text-secondary-400 w-12">{t('apps.email.to')}</label>
                <Input
                  type="email"
                  placeholder={t('apps.email.recipient_placeholder') || 'recipient@example.com'}
                  className="flex-1 border-0 bg-transparent shadow-none focus:ring-0 px-0"
                />
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-surface-200 dark:border-surface-700">
                <label className="text-label text-secondary-500 dark:text-secondary-400 w-12">{t('apps.email.subject')}</label>
                <Input
                  type="text"
                  placeholder={t('apps.email.enter_subject')}
                  className="flex-1 border-0 bg-transparent shadow-none focus:ring-0 px-0"
                />
              </div>

              <Textarea
                rows={10}
                placeholder={t('apps.email.write_message')}
                className="border-0 bg-transparent shadow-none focus:ring-0 px-0 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.textBold} className="w-5 h-5" width={20} height={20} />
                </button>
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.textItalic} className="w-5 h-5" width={20} height={20} />
                </button>
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.link} className="w-5 h-5" width={20} height={20} />
                </button>
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.list} className="w-5 h-5" width={20} height={20} />
                </button>
                <div className="w-px h-6 bg-surface-300 dark:bg-surface-600 mx-1" />
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.paperclip} className="w-5 h-5" width={20} height={20} />
                </button>
                <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg text-secondary-500 transition-colors">
                  <Icon icon={Icons.photo} className="w-5 h-5" width={20} height={20} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsComposeOpen(false)}>
                  {t('apps.email.discard')}
                </Button>
                <Button size="sm">
                  <Icon icon={Icons.send} className="w-4 h-4" width={16} height={16} />
                  {t('apps.email.send')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

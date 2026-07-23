import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { SearchField } from '@/components/apps'
import { Button, Input } from '@/components/ui'
import { useLocale } from '@/i18n'
import {
  chatConversations,
  chatMessages,
  chatUsers,
  currentUser,
  statusColors,
  type ChatConversation,
  type ChatMessage,
  type ChatUser,
} from '@/data/chat'

/**
 * Chat Page Component
 * Full-featured chat application with conversations list and message view
 */
export function ChatPage() {
  const navigate = useNavigate()
  const { t, locale } = useLocale()
  const [conversations, setConversations] = useState<ChatConversation[]>(chatConversations)
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(conversations[0])
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages['conv-1'] || [])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showNewChatMenu, setShowNewChatMenu] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNewChatMenu(false)
      setShowChatMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages(chatMessages[selectedConversation.id] || [])
    }
  }, [selectedConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const name = conv.isGroup
      ? conv.groupName
      : conv.participants[0]?.name
    return name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Handle conversation select
  const handleConversationSelect = (conv: ChatConversation) => {
    setSelectedConversation(conv)
    setShowMobileChat(true)
    // Mark as read
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
    )
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update last message in conversation
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: message }
          : c
      )
    )
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      // Reuse existing translations (also used by Notes).
      return t('notes.yesterday')
    } else if (days < 7) {
      return date.toLocaleDateString(locale, { weekday: 'short' })
    } else {
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
    }
  }

  // Get conversation display info
  const getConversationInfo = (conv: ChatConversation) => {
    if (conv.isGroup) {
      return {
        name: conv.groupName || 'Group Chat',
        avatar: conv.groupAvatar,
        status: null,
        subtitle: `${conv.participants.length + 1} ${t('apps.chat.members')}`
      }
    }
    const user = conv.participants[0]
    return {
      name: user?.name || 'Unknown',
      avatar: user?.avatar,
      status: user?.status,
      subtitle: user?.status === 'online' ? t('apps.chat.online') : user?.lastSeen || t('apps.chat.offline')
    }
  }

  // Get sender info
  const getSender = (senderId: string): ChatUser => {
    if (senderId === currentUser.id) return currentUser
    return chatUsers.find(u => u.id === senderId) || currentUser
  }

  // Message status icon
  const MessageStatus = ({ status }: { status: ChatMessage['status'] }) => {
    if (status === 'sent') {
      return <Icon icon={Icons.check} width={16} height={16} className="text-secondary-400" />
    }
    if (status === 'delivered') {
      return <Icon icon={Icons.checks} width={16} height={16} className="text-secondary-400" />
    }
    return <Icon icon={Icons.checks} width={16} height={16} className="text-theme-primary" />
  }

  const selectedInfo = selectedConversation ? getConversationInfo(selectedConversation) : null

  return (
    <div className="h-[calc(100vh-7rem)] flex animate-fade-in card rounded-xl overflow-hidden">
      {/* Conversations List */}
      <div className={`
        w-full md:w-80 lg:w-96 flex-shrink-0 bg-white dark:bg-surface-900 border-e border-surface-200 dark:border-surface-700 flex flex-col
        ${showMobileChat ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('apps.chat.chats')}</h1>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNewChatMenu(!showNewChatMenu); setShowChatMenu(false) }}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              >
                <Icon icon={Icons.plus} width={20} height={20} className="text-secondary-600 dark:text-secondary-400" />
              </button>
              {showNewChatMenu && (
                <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-1 z-50">
                  <button 
                    onClick={() => { setShowNewChatMenu(false) }}
                    className="w-full px-4 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    {t('apps.chat.new_chat')}
                  </button>
                  <button 
                    onClick={() => { setShowNewChatMenu(false) }}
                    className="w-full px-4 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    {t('apps.chat.new_group')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <SearchField
            placeholder={t('apps.chat.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const info = getConversationInfo(conv)
            const isSelected = selectedConversation?.id === conv.id
            const isOwnMessage = conv.lastMessage?.senderId === currentUser.id

            return (
              <button
                key={conv.id}
                onClick={() => handleConversationSelect(conv)}
                className={`
                  w-full flex items-center gap-3 p-4 text-start transition-colors
                  ${isSelected
                    ? 'bg-theme-primary-light dark:bg-theme-primary/10'
                    : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conv.isGroup ? (
                    <div className="w-11 h-11 rounded-full bg-theme-primary flex items-center justify-center">
                      <Icon icon={Icons.users} width={20} height={20} className="text-white" />
                    </div>
                  ) : (
                    <img
                      src={info.avatar}
                      alt={info.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  )}
                  {info.status && (
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-surface-900 ${statusColors[info.status]}`} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-ui font-medium truncate ${isSelected ? 'text-theme-primary' : 'text-secondary-900 dark:text-white'}`}>
                      {info.name}
                    </span>
                    <span className="text-ui-sm text-secondary-500 dark:text-secondary-400 flex-shrink-0">
                      {formatTime(conv.lastMessage?.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                      {isOwnMessage && <span className="text-secondary-400">{t('apps.chat.you')}: </span>}
                      {conv.lastMessage?.content}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-theme-primary text-white text-xs font-medium rounded-full flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className={`
          flex-1 flex flex-col bg-surface-50 dark:bg-surface-950
          ${showMobileChat ? 'flex' : 'hidden md:flex'}
        `}>
          {/* Chat Header */}
          <div className="h-16 px-4 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Back button (mobile) */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-2 -ms-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              >
                <Icon icon={Icons.chevronLeft} width={20} height={20} className="text-secondary-600 dark:text-secondary-400" />
              </button>

              {/* Avatar */}
              <div className="relative">
                {selectedConversation.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center">
                    <Icon icon={Icons.users} width={20} height={20} className="text-white" />
                  </div>
                ) : (
                  <img
                    src={selectedInfo?.avatar}
                    alt={selectedInfo?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                {selectedInfo?.status && (
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-surface-900 ${statusColors[selectedInfo.status]}`} />
                )}
              </div>

              {/* Info */}
              <div>
                <h2 className="text-ui font-semibold text-secondary-900 dark:text-white">
                  {selectedInfo?.name}
                </h2>
                <p className="text-ui-sm text-secondary-500 dark:text-secondary-400">
                  {selectedInfo?.subtitle}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => navigate(`/app/chat/voice-call?user=${selectedConversation.participants[0]?.id}`)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                title={t('apps.chat.voice_call')}
              >
                <Icon icon={Icons.phone} width={20} height={20} className="text-secondary-600 dark:text-secondary-400" />
              </button>
              <button 
                onClick={() => navigate(`/app/chat/video-call?user=${selectedConversation.participants[0]?.id}`)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                title={t('apps.chat.video_call')}
              >
                <Icon icon={Icons.video} width={20} height={20} className="text-secondary-600 dark:text-secondary-400" />
              </button>
              <button 
                onClick={() => setShowUserInfo(!showUserInfo)}
                className={`p-2 rounded-lg transition-colors ${showUserInfo ? 'bg-theme-primary-light text-theme-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-secondary-600 dark:text-secondary-400'}`}
              >
                <Icon icon={Icons.infoCircle} width={20} height={20} />
              </button>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowChatMenu(!showChatMenu); setShowNewChatMenu(false) }}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                >
                  <Icon icon={Icons.dots} width={20} height={20} className="text-secondary-600 dark:text-secondary-400" />
                </button>
                {showChatMenu && (
                  <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-1 z-50">
                    <button 
                      onClick={() => { setShowChatMenu(false) }}
                      className="w-full px-4 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      {t('apps.chat.view_profile')}
                    </button>
                    <button 
                      onClick={() => { setShowChatMenu(false) }}
                      className="w-full px-4 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      {t('apps.chat.search_in_chat')}
                    </button>
                    <button 
                      onClick={() => { setShowChatMenu(false) }}
                      className="w-full px-4 py-2 text-sm text-start text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      {t('apps.chat.mute_notifications')}
                    </button>
                    <hr className="my-1 border-surface-200 dark:border-surface-700" />
                    <button 
                      onClick={() => { setShowChatMenu(false) }}
                      className="w-full px-4 py-2 text-sm text-start text-red-600 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      {t('apps.chat.delete_chat')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUser.id
              const sender = getSender(message.senderId)
              const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.senderId !== message.senderId)
              const showTime = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar */}
                  {!isOwn && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        <img
                          src={sender.avatar}
                          alt={sender.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Message */}
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    {/* Sender name for group chats */}
                    {selectedConversation.isGroup && !isOwn && showAvatar && (
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1 ms-3">
                        {sender.name}
                      </p>
                    )}

                    <div
                      className={`
                        px-4 py-2.5 rounded-2xl
                        ${isOwn
                          ? 'bg-theme-primary text-white rounded-br-md'
                          : 'bg-white dark:bg-surface-800 text-secondary-900 dark:text-white rounded-bl-md shadow-sm'
                        }
                      `}
                    >
                      {/* Text content */}
                      <p className={`text-sm whitespace-pre-wrap ${isOwn ? 'text-white' : ''}`}>{message.content}</p>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 p-2 rounded-lg ${isOwn ? 'bg-white/10' : 'bg-surface-100 dark:bg-surface-700'}`}
                            >
                              <div className={`p-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-theme-primary-light'}`}>
                                <Icon icon={Icons.file} width={20} height={20} className={isOwn ? 'text-white' : 'text-theme-primary'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-secondary-900 dark:text-white'}`}>
                                  {attachment.name}
                                </p>
                                <p className={`text-xs ${isOwn ? 'text-white/70' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                  {attachment.size}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Time & Status */}
                    {showTime && (
                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'} px-1`}>
                        <span className="text-xs text-secondary-400">
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwn && <MessageStatus status={message.status} />}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-end gap-3">
              {/* Attachment button */}
              <div className="flex gap-1">
                <button className="p-2.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
                  <Icon icon={Icons.paperclip} width={20} height={20} className="text-secondary-500 dark:text-secondary-400" />
                </button>
                <button className="p-2.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
                  <Icon icon={Icons.photo} width={20} height={20} className="text-secondary-500 dark:text-secondary-400" />
                </button>
              </div>

              {/* Input */}
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('apps.chat.type_message')}
                  suffix={
                    <button
                      type="button"
                      className="rounded-lg p-1 transition-colors hover:bg-surface-200 dark:hover:bg-surface-700"
                    >
                      <Icon icon={Icons.moodSmile} width={20} height={20} className="text-secondary-400" />
                    </button>
                  }
                />
              </div>

              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-3"
              >
                <Icon icon={Icons.send} width={20} height={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-surface-50 dark:bg-surface-950">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Icon icon={Icons.users} width={32} height={32} className="text-secondary-400" />
            </div>
            <h3 className="text-base font-semibold text-secondary-900 dark:text-white mb-1">
              {t('apps.chat.select_chat')}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {t('apps.chat.start_messaging')}
            </p>
          </div>
        </div>
      )}

      {/* User Info Panel */}
      {showUserInfo && selectedConversation && (
        <div className="w-72 bg-white dark:bg-surface-900 border-s border-surface-200 dark:border-surface-700 flex-shrink-0 hidden lg:block">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h3 className="text-ui font-semibold text-secondary-900 dark:text-white">
              {selectedConversation.isGroup ? t('apps.chat.group_info') : t('apps.chat.contact_info')}
            </h3>
            <button
              onClick={() => setShowUserInfo(false)}
              className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            >
              <Icon icon={Icons.x} width={20} height={20} className="text-secondary-500" />
            </button>
          </div>

          <div className="p-4 text-center border-b border-surface-200 dark:border-surface-700">
            {selectedConversation.isGroup ? (
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-theme-primary flex items-center justify-center">
                <Icon icon={Icons.users} width={32} height={32} className="text-white" />
              </div>
            ) : (
              <img
                src={selectedInfo?.avatar}
                alt={selectedInfo?.name}
                className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
              />
            )}
            <h4 className="text-ui font-semibold text-secondary-900 dark:text-white">
              {selectedInfo?.name}
            </h4>
            <p className="text-ui-sm text-secondary-500 dark:text-secondary-400">
              {selectedInfo?.subtitle}
            </p>
          </div>

          {/* Members for group */}
          {selectedConversation.isGroup && (
            <div className="p-4">
              <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                {t('apps.chat.members')} ({selectedConversation.participants.length + 1})
              </h5>
              <div className="space-y-3">
                {/* Current user */}
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      {currentUser.name} ({t('apps.chat.you')})
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                {/* Other participants */}
                {selectedConversation.participants.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-surface-900 ${statusColors[user.status]}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact info for individual chat */}
          {!selectedConversation.isGroup && selectedConversation.participants[0] && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1">{t('apps.chat.role')}</p>
                <p className="text-sm text-secondary-900 dark:text-white">
                  {selectedConversation.participants[0].role}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-1">{t('apps.chat.status')}</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusColors[selectedConversation.participants[0].status]}`} />
                  <span className="text-sm text-secondary-900 dark:text-white capitalize">
                    {selectedConversation.participants[0].status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatPage

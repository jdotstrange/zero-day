import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { Icon, Icons, Logo, ThemeModeToggle, LanguageSwitcher } from '@/components/common'
import { Button } from '@/components/ui'
import { cn } from '@/components/ui/cn'
import { useLocale } from '@/i18n'
import { getLocaleOption } from '@/i18n/localeOptions'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { HeaderSearch } from './HeaderSearch'

type HeaderProps = {
  sidebarWidth: number
  isHorizontal: boolean
  isCollapsed: boolean
  onToggleSidebar: () => void
  isMobileSidebarOpen?: boolean
  onToggleMobileSidebar?: () => void
}

type MegaItem = {
  to: string
  title: string
  description: string
  icon: string
  badge?: string
}

type MegaMenu = {
  id: string
  label: string
  items: MegaItem[]
  footer?: {
    label: string
    to: string
  }
}

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      onOutside()
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [onOutside])

  return ref
}

function TopLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn('header-nav-link', isActive && 'header-nav-link-active')
      }
    >
      {label}
    </NavLink>
  )
}

export function AppHeader({ sidebarWidth, isHorizontal, isCollapsed, onToggleSidebar, onToggleMobileSidebar }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, locale } = useLocale()
  const { signOut } = useAuth()
  const { config: themeConfig } = useTheme()
  const isRtl = themeConfig.direction === 'rtl'
  const activeLocale = getLocaleOption(locale)

  const [openMega, setOpenMega] = useState<string | null>(null)
  const [userOpen, setUserOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const megaCloseTimerRef = useRef<number | null>(null)

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current) {
      window.clearTimeout(megaCloseTimerRef.current)
      megaCloseTimerRef.current = null
    }
  }

  const openMegaMenu = (id: string) => {
    clearMegaCloseTimer()
    setOpenMega(id)
  }

  const scheduleMegaClose = () => {
    clearMegaCloseTimer()
    megaCloseTimerRef.current = window.setTimeout(() => setOpenMega(null), 180)
  }

  const megaRef = useClickOutside<HTMLDivElement>(() => {
    clearMegaCloseTimer()
    setOpenMega(null)
  })
  const userRef = useClickOutside<HTMLDivElement>(() => {
    setUserOpen(false)
    setLangOpen(false)
  })
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false))

  const menus = useMemo<MegaMenu[]>(
    () => [
      {
        id: 'apps',
        label: t('header.menu.apps'),
        items: [
          { to: '/app/email', title: t('nav.email'), description: t('header.apps.email_desc'), icon: Icons.mail, badge: '3' },
          { to: '/app/chat', title: t('nav.chat'), description: t('header.apps.chat_desc'), icon: Icons.message, badge: '5' },
          { to: '/app/notes', title: t('nav.notes'), description: t('header.apps.notes_desc'), icon: Icons.note },
          { to: '/app/kanban', title: t('nav.kanban_board'), description: t('header.apps.kanban_desc'), icon: Icons.kanban },
          { to: '/app/calendar', title: t('nav.calendar'), description: t('header.apps.calendar_desc'), icon: Icons.calendar },
          { to: '/app/ecommerce/products', title: t('nav.ecommerce_title'), description: t('header.apps.ecommerce_desc'), icon: Icons.shopping },
          { to: '/app/blog', title: t('nav.blog'), description: t('header.apps.blog_desc'), icon: Icons.article },
        ],
        footer: { label: t('header.footer.all_apps'), to: '/dashboard' },
      },
    ],
    [t],
  )

  const headerLeft = isHorizontal ? 0 : sidebarWidth

  return (
    <header
      className="layout-header fixed top-0 left-0 right-0 z-[1020] h-16 border-b border-surface-200 bg-white/95 backdrop-blur transition-all duration-300 dark:border-surface-800 dark:bg-surface-900/95"
      style={{ left: isHorizontal ? 0 : undefined }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .layout-header {
            left: 0 !important;
            right: 0 !important;
          }

          ${isHorizontal ? '' : (isRtl
            ? `html[dir="rtl"] .layout-header { right: ${headerLeft}px !important; }`
            : `html[dir="ltr"] .layout-header { left: ${headerLeft}px !important; }`)}
        }
      `}</style>

      <div className={cn('header-bar', isHorizontal && 'layout-container max-w-none')}>
        {/* Start: toggles + horizontal logo */}
        <div className="flex shrink-0 items-center gap-1">
          {!isHorizontal && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="header-icon-btn header-icon-btn-mobile"
              aria-label={t('header.aria.toggle_mobile_menu')}
            >
              <Icon icon={Icons.menu} className="h-5 w-5" />
            </button>
          )}

          {!isHorizontal && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="header-icon-btn header-icon-btn-desktop"
              aria-label={t('header.aria.toggle_sidebar')}
            >
              {isCollapsed ? (
                <Icon icon={Icons.chevronRight} className="h-5 w-5" />
              ) : (
                <Icon icon={Icons.chevronLeft} className="h-5 w-5" />
              )}
            </button>
          )}

          {isHorizontal && (
            <Link to="/dashboard" className="me-2 flex items-center" aria-label="0-Day Home">
              <Logo height={32} />
            </Link>
          )}
        </div>

        {/* Center: primary nav */}
        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex" ref={megaRef}>
          <TopLink to="/dashboard" label={t('header.top.dashboard')} />

          {menus.map((m) => (
            <div key={m.id} className="relative">
              <button
                type="button"
                className={cn(
                  'header-nav-link',
                  openMega === m.id && 'header-nav-link-open',
                )}
                aria-haspopup="menu"
                aria-expanded={openMega === m.id}
                onMouseEnter={() => openMegaMenu(m.id)}
                onMouseLeave={scheduleMegaClose}
                onClick={() => {
                  clearMegaCloseTimer()
                  setOpenMega((cur) => (cur === m.id ? null : m.id))
                }}
              >
                {m.label}
                <Icon
                  icon={Icons.chevronDown}
                  className={cn('h-4 w-4 transition-transform duration-200', openMega === m.id && 'rotate-180')}
                />
              </button>

              {openMega === m.id && (
                <div
                  className="card absolute left-0 z-[1035] mt-2 w-[860px] rounded-3xl p-5"
                  onMouseEnter={() => openMegaMenu(m.id)}
                  onMouseLeave={scheduleMegaClose}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">{m.label}</p>
                      <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">{t('header.quick_access')}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-sm text-secondary-500 dark:text-secondary-400"
                      onClick={() => setOpenMega(null)}
                    >
                      {t('common.close')}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {m.items.map((it) => (
                      <Link
                        key={it.to}
                        to={it.to}
                        className={cn(
                          'group flex items-start gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-surface-200/70 hover:bg-surface-50 dark:hover:border-surface-700 dark:hover:bg-surface-800',
                          location.pathname.startsWith(it.to) && 'border-surface-200/70 bg-surface-50 dark:border-surface-700 dark:bg-surface-800',
                        )}
                        onClick={() => setOpenMega(null)}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-theme-primary/10 text-theme-primary">
                          <Icon icon={it.icon} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-ui truncate font-semibold text-secondary-900 dark:text-white">{it.title}</p>
                            {it.badge && (
                              <span className="rounded-full bg-danger-100 px-2 py-0.5 text-ui-xs text-danger-600 dark:bg-danger-900/30 dark:text-danger-300">
                                {it.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-secondary-600 dark:text-secondary-300">{it.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {m.footer && (
                    <div className="mt-4 flex items-center justify-end border-t border-surface-200 pt-4 dark:border-surface-700">
                      <Link
                        to={m.footer.to}
                        className="text-sm font-semibold text-theme-primary hover:underline"
                        onClick={() => setOpenMega(null)}
                      >
                        {m.footer.label}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* End: search + actions */}
        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="header-icon-btn header-icon-btn-mobile"
            aria-label={t('common.search')}
            aria-expanded={searchOpen}
          >
            <Icon icon={Icons.search} className="h-5 w-5" />
          </button>

          <HeaderSearch
            placeholder={t('search_placeholder')}
            className="header-search-wrap"
          />

          <div className="header-actions-divider" aria-hidden="true" />

          <Button asChild className="header-create-btn">
            <Link to="/app/blog/create">
              <Icon icon={Icons.plus} />
              <span className="hidden lg:inline">{t('create')}</span>
            </Link>
          </Button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="header-icon-btn relative"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={t('header.notifications')}
              aria-expanded={notifOpen}
            >
              <Icon icon={Icons.bell} className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-surface-900" />
            </button>

            {notifOpen && (
              <div className="card absolute right-0 z-[1035] mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-3">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">{t('header.notifications')}</p>
                  <Link
                    to="/pages/account-settings"
                    className="text-xs text-theme-primary hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    {t('common.manage')}
                  </Link>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                    <p className="text-sm text-secondary-900 dark:text-white">New message in Chat</p>
                    <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">2 minutes ago</p>
                  </div>
                  <div className="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                    <p className="text-sm text-secondary-900 dark:text-white">Order #1024 paid</p>
                    <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">Today</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => {
                setUserOpen((v) => !v)
                setLangOpen(false)
              }}
              className="flex items-center gap-2.5 rounded-xl border-s border-surface-200 py-1 ps-2.5 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-800 sm:ps-3"
              aria-label={t('header.user_menu')}
              aria-expanded={userOpen}
            >
              <div className="hidden text-end sm:block">
                <p className="text-sm font-medium leading-tight text-secondary-900 dark:text-white">John Doe</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Admin</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-theme-primary text-sm font-semibold text-white">
                JD
              </div>
            </button>

            {userOpen && (
              <div className="card absolute right-0 z-[1035] mt-2 w-64 rounded-2xl p-2">
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary-700 hover:bg-surface-50 dark:text-secondary-200 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.user} className="h-5 w-5" />
                  {t('common.profile')}
                </Link>
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary-700 hover:bg-surface-50 dark:text-secondary-200 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.settings} className="h-5 w-5" />
                  {t('common.settings')}
                </Link>

                <div className="my-2 border-t border-surface-200 dark:border-surface-700" />

                <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-secondary-700 dark:text-secondary-200">
                    <Icon
                      icon={themeConfig.mode === 'dark' ? Icons.moon : Icons.sun}
                      className="h-5 w-5 shrink-0"
                    />
                    <span>{t('account.appearance')}</span>
                  </div>
                  <ThemeModeToggle />
                </div>

                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-secondary-700 hover:bg-surface-50 dark:text-secondary-200 dark:hover:bg-surface-800"
                    onClick={() => setLangOpen((v) => !v)}
                    aria-expanded={langOpen}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon icon={Icons.globe} className="h-5 w-5 shrink-0" />
                      <span>{t('language')}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                      {activeLocale.label}
                      <Icon
                        icon={Icons.chevronDown}
                        className={cn('h-4 w-4 transition-transform', langOpen && 'rotate-180')}
                      />
                    </span>
                  </button>
                  {langOpen && (
                    <div className="mt-1 rounded-xl bg-surface-50 p-1 dark:bg-surface-800/60">
                      <LanguageSwitcher
                        variant="menu"
                        onSelect={() => {
                          setLangOpen(false)
                          setUserOpen(false)
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="my-2 border-t border-surface-200 dark:border-surface-700" />

                <Link
                  to="/pages/faq"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary-700 hover:bg-surface-50 dark:text-secondary-200 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.help} className="h-5 w-5" />
                  {t('common.help')}
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20"
                  onClick={() => {
                    setUserOpen(false)
                    void signOut().then(() => navigate('/auth/login'))
                  }}
                >
                  <Icon icon={Icons.logout} className="h-5 w-5" />
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="header-mobile-panel absolute top-full left-0 right-0 z-[1019] border-b border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <HeaderSearch placeholder={t('search_placeholder')} autoFocus />
        </div>
      )}
    </header>
  )
}

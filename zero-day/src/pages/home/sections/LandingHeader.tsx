import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Icon, Icons, Logo } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

export function LandingHeader() {
 const { t } = useLocale()

 const sectionLinks = [
 { label: t('landing.header.nav.demos'), href: '#demos' },
 { label: t('landing.header.nav.features'), href: '#features' },
 { label: t('landing.header.nav.widgets'), href: '#widgets' },
 { label: t('landing.header.nav.testimonials'), href: '#testimonials' },
 ] as const

 const dashboards = [
 {
 title: t('nav.analytics'),
 description: t('landing.header.dashboards.analytics.desc'),
 to: '/dashboard/analytics',
 icon: Icons.chartLine,
 accent: 'from-blue-500/20 to-indigo-500/20',
 iconColor: 'text-blue-600 dark:text-blue-400',
 badge: t('landing.header.badge.popular'),
 badgeKind: 'popular',
 bg: 'bg-blue-50 dark:bg-blue-900/10',
 },
 {
 title: t('nav.ecommerce_title'),
 description: t('landing.header.dashboards.ecommerce.desc'),
 to: '/dashboard/ecommerce',
 icon: Icons.shoppingBag,
 accent: 'from-emerald-500/20 to-teal-500/20',
 iconColor: 'text-emerald-600 dark:text-emerald-400',
 badge: t('landing.header.badge.new'),
 badgeKind: 'new',
 bg: 'bg-emerald-50 dark:bg-emerald-900/10',
 },
 {
 title: t('nav.crm'),
 description: t('landing.header.dashboards.crm.desc'),
 to: '/dashboard/crm',
 icon: Icons.users,
 accent: 'from-orange-500/20 to-red-500/20',
 iconColor: 'text-orange-600 dark:text-orange-400',
 badge: t('landing.header.badge.pro'),
 badgeKind: 'pro',
 bg: 'bg-orange-50 dark:bg-orange-900/10',
 },
 ] as const

 const location = useLocation()
 const [isOpen, setIsOpen] = useState(false)
 const [megaOpen, setMegaOpen] = useState(false)
 const [scrolled, setScrolled] = useState(false)
 const closeTimerRef = useRef<number | null>(null)
 const megaContainerRef = useRef<HTMLDivElement | null>(null)

 useEffect(() => {
 const handleScroll = () => {
 setScrolled(window.scrollY > 20)
 }
 window.addEventListener('scroll', handleScroll)
 return () => window.removeEventListener('scroll', handleScroll)
 }, [])

 // Close menus on location change
 useEffect(() => {
 setIsOpen(false)
 setMegaOpen(false)
 }, [location.pathname, location.search, location.hash])

 useEffect(() => {
 const onKeyDown = (e: KeyboardEvent) => {
 if (e.key !== 'Escape') return
 setIsOpen(false)
 setMegaOpen(false)
 }

 document.addEventListener('keydown', onKeyDown)
 return () => document.removeEventListener('keydown', onKeyDown)
 }, [])

 useEffect(() => {
 if (!isOpen) return
 const prevOverflow = document.body.style.overflow
 document.body.style.overflow = 'hidden'
 return () => {
 document.body.style.overflow = prevOverflow
 }
 }, [isOpen])

 useEffect(() => {
 if (!megaOpen) return
 const onPointerDown = (e: MouseEvent) => {
 const root = megaContainerRef.current
 if (!root) return
 if (root.contains(e.target as Node)) return
 setMegaOpen(false)
 }
 document.addEventListener('mousedown', onPointerDown)
 return () => document.removeEventListener('mousedown', onPointerDown)
 }, [megaOpen])

 const openMega = () => {
 if (closeTimerRef.current) {
 window.clearTimeout(closeTimerRef.current)
 closeTimerRef.current = null
 }
 setMegaOpen(true)
 }

 const scheduleCloseMega = () => {
 if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
 closeTimerRef.current = window.setTimeout(() => setMegaOpen(false), 150)
 }

 return (
 <header
 className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
 ? 'bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50 shadow-sm py-3'
 : 'bg-transparent py-5'
 }`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-0">
 <div className="flex items-center justify-between" ref={megaContainerRef}>
 {/* Logo */}
 <Link to="/" className="flex items-center gap-2.5 group">
 <Logo className="group- transition-transform duration-300" width={140} height={28} />
 </Link>

 {/* Desktop Nav - Floating Island */}
 <nav className="hidden md:flex items-center p-1.5 rounded-full bg-surface-100/50 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/50 backdrop-blur-md shadow-sm">
 {sectionLinks.map((l) => (
 <a
 key={l.href}
 href={l.href}
 className="px-4 py-2 rounded-full text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-800 transition-all duration-200"
 >
 {l.label}
 </a>
 ))}

 <div
 className="relative"
 onMouseEnter={openMega}
 onMouseLeave={scheduleCloseMega}
 >
 <button
 type="button"
 className={`
 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5
 ${megaOpen
 ? 'bg-white dark:bg-surface-800 text-secondary-900 dark:text-white shadow-sm'
 : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-white dark:hover:bg-surface-800'
 }
 `}
 aria-haspopup="menu"
 aria-expanded={megaOpen}
 onClick={() => setMegaOpen((v) => !v)}
 >
 {t('landing.header.nav.dashboards')}
 <Icon
 icon={Icons.chevronDown}
 className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
 />
 </button>

 {/* Mega Menu */}
 <div
 className={`
 absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[800px]
 transition-all duration-300 origin-top-right
 ${megaOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
 `}
 onMouseEnter={openMega}
 onMouseLeave={scheduleCloseMega}
 >
 <div className="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl shadow-theme-primary/10 overflow-hidden p-2">
 <div className="grid grid-cols-12 gap-2">
 {/* Main Content */}
 <div className="col-span-8 p-6 bg-surface-50/50 dark:bg-surface-950/50 rounded-lg">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-2">
 <div className="p-2 rounded-lg bg-theme-primary/10 text-theme-primary">
 <Icon icon={Icons.sparkles} className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
 {t('landing.header.mega.title')}
 </h3>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">
 {t('landing.header.mega.subtitle')}
 </p>
 </div>
 </div>
 <Link
 to="/dashboard"
 className="text-xs font-bold text-theme-primary hover:text-theme-primary-dark transition-colors flex items-center gap-1 bg-white dark:bg-surface-800 px-3 py-1.5 rounded-full shadow-sm border border-surface-200 dark:border-surface-700"
 onClick={() => setMegaOpen(false)}
 >
 {t('landing.header.mega.view_all')}
 <Icon icon={Icons.arrowRight} className="w-3 h-3" />
 </Link>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {dashboards.map((d) => (
 <Link
 key={d.title}
 to={d.to}
 onClick={() => setMegaOpen(false)}
 className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-theme-primary/50 transition-all duration-300"
 >
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${d.bg || 'bg-surface-100 dark:bg-surface-700'} ${d.iconColor} group-hover:scale-110 transition-transform`}>
 <Icon icon={d.icon} className="w-6 h-6" />
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h4 className="text-sm font-bold text-secondary-900 dark:text-white truncate">
 {d.title}
 </h4>
 {d.badge && (
 <span className={`px-1.5 py-0.5 rounded text-ui-2xs font-bold uppercase tracking-wider ${d.badgeKind === 'new' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-surface-100 text-secondary-600 dark:bg-surface-700 dark:text-secondary-400'}`}>
 {d.badge}
 </span>
 )}
 </div>
 <p className="text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2 leading-relaxed">
 {d.description}
 </p>
 </div>
 </Link>
 ))}
 </div>
 </div>

 {/* Sidebar */}
 <div className="col-span-4 flex flex-col gap-2">
 {/* Quick Links */}
 <div className="p-6 rounded-lg bg-surface-50/50 dark:bg-surface-950/50 h-full">
 <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-4 px-2">
 {t('landing.header.quick_links.title')}
 </h3>
 <div className="space-y-1">
 {[
 { label: t('landing.header.quick_links.chat_app'), to: '/app/chat', icon: Icons.message },
 { label: t('landing.header.quick_links.kanban_board'), to: '/app/kanban', icon: Icons.kanban },
 { label: t('landing.header.quick_links.file_manager'), to: '/app/files', icon: Icons.briefcase },
 { label: t('landing.header.quick_links.user_profile'), to: '/pages/account-settings', icon: Icons.user },
 ].map((l) => (
 <Link
 key={l.label}
 to={l.to}
 onClick={() => setMegaOpen(false)}
 className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-surface-800 transition-all group"
 >
 <Icon icon={l.icon} className="w-4 h-4 text-secondary-400 group-hover:text-theme-primary transition-colors" />
 <span className="text-sm font-medium text-secondary-700 dark:text-secondary-200 group-hover:text-secondary-900 dark:group-hover:text-white">
 {l.label}
 </span>
 </Link>
 ))}
 </div>
 </div>

 {/* CTA */}
 <Link
 to="/components/all"
 className="p-6 rounded-lg bg-theme-primary text-white transition-all flex flex-col justify-center items-center gap-3"
 onClick={() => setMegaOpen(false)}
 >
 <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
 <Icon icon={Icons.layoutGrid} className="w-6 h-6" />
 </div>
 <div className="text-center">
 <p className="text-base font-bold leading-tight text-white">{t('landing.header.components_cta.title')}</p>
 <p className="text-xs opacity-90 font-medium mt-1 text-white">{t('landing.header.components_cta.subtitle')}</p>
 </div>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 </nav>

 {/* Right Actions */}
 <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/auth/login">{t('landing.header.actions.login')}</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">
                {t('home.get_started')}
                <Icon icon={Icons.chevronDown} className="-rotate-90" />
              </Link>
            </Button>
 </div>

 {/* Mobile Menu Button */}
 <button
 type="button"
 className="md:hidden relative z-50 w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-secondary-900 dark:text-white"
 onClick={() => setIsOpen((v) => !v)}
 >
 {isOpen ? <Icon icon={Icons.x} className="w-5 h-5" /> : <Icon icon={Icons.menu} className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Mobile Menu Overlay */}
 <div
 className={`
 fixed inset-0 z-40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl transition-all duration-300 md:hidden
 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
 `}
 >
 <div className="h-full overflow-y-auto pt-24 pb-8 px-6">
 <div className="flex flex-col gap-2">
 {sectionLinks.map((l) => (
 <a
 key={l.href}
 href={l.href}
 onClick={() => setIsOpen(false)}
 className="heading-3 text-secondary-900 dark:text-white py-3 border-b border-surface-100 dark:border-surface-800"
 >
 {l.label}
 </a>
 ))}
 </div>

 <div className="mt-8">
 <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-4">
 {t('landing.header.nav.dashboards')}
 </p>
 <div className="grid gap-3">
 {dashboards.map((d) => (
 <Link
 key={d.title}
 to={d.to}
 onClick={() => setIsOpen(false)}
 className="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800"
 >
 <div className={`w-10 h-10 rounded-xl bg-white dark:bg-surface-800 flex items-center justify-center ${d.iconColor} shadow-sm`}>
 <Icon icon={d.icon} className="w-5 h-5" />
 </div>
 <div>
 <h4 className="text-base font-bold text-secondary-900 dark:text-white">{d.title}</h4>
 <p className="text-xs text-secondary-500 dark:text-secondary-400">{d.description}</p>
 </div>
 </Link>
 ))}
 </div>
 </div>

 <div className="mt-8 grid gap-3">
            <Button asChild variant="outline" fullWidth>
              <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                {t('landing.header.actions.login')}
              </Link>
            </Button>
            <Button asChild fullWidth>
              <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                {t('home.get_started')}
              </Link>
            </Button>
 </div>
 </div>
 </div>
 </header>
 )
}

import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { useLocale } from '@/i18n'

const ORBIT_ICONS = {
 ring1: [
 { icon: Icons.chartBar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { icon: Icons.users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
 { icon: Icons.settings, color: 'text-purple-500', bg: 'bg-purple-500/10' },
 { icon: Icons.shopping, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
 ],
 ring2: [
 { icon: Icons.mail, color: 'text-pink-500', bg: 'bg-pink-500/10' },
 { icon: Icons.calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
 { icon: Icons.lock, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
 { icon: Icons.file, color: 'text-red-500', bg: 'bg-red-500/10' },
 { icon: Icons.dashboard, color: 'text-teal-500', bg: 'bg-teal-500/10' },
 { icon: Icons.video, color: 'text-violet-500', bg: 'bg-violet-500/10' },
 ],
 ring3: [
 { icon: Icons.kanban, color: 'text-amber-500', bg: 'bg-amber-500/10' },
 { icon: Icons.camera, color: 'text-rose-500', bg: 'bg-rose-500/10' },
 { icon: Icons.article, color: 'text-lime-500', bg: 'bg-lime-500/10' },
 { icon: Icons.microphone, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
 { icon: Icons.creditCard, color: 'text-sky-500', bg: 'bg-sky-500/10' },
 { icon: Icons.chartPie, color: 'text-green-500', bg: 'bg-green-500/10' },
 { icon: Icons.message, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
 { icon: Icons.phone, color: 'text-secondary-500', bg: 'bg-secondary-500/10' },
 ]
}

export function HeroSection() {
 const { t } = useLocale()

 return (
 <section id="top" className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">
 {/* Background Gradient */}
 <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950 transition-colors duration-300" />
 <div className="absolute inset-0 bg-theme-primary/5" />

 {/* Orbit Container - Centered */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
 {/* Focal glow */}
 <div className="absolute h-64 w-64 rounded-full bg-theme-primary/20 blur-3xl animate-hero-glow sm:h-80 sm:w-80" aria-hidden />

 {/* Ring 1 - Diameter 650px (Radius 325px) */}
 <div className="absolute w-[650px] h-[650px] rounded-full border border-dashed border-surface-300/80 dark:border-surface-700/80 animate-orbit" style={{ '--duration-orbit': '45s' } as React.CSSProperties}>
 {ORBIT_ICONS.ring1.map((item, i, arr) => {
 const angle = (i / arr.length) * 360;
 return (
 <div
 key={i}
 className="absolute top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-auto"
 style={{ transform: `rotate(${angle}deg) translateY(-325px) rotate(-${angle}deg)` }}
 >
 <div className="animate-orbit-reverse" style={{ '--duration-orbit': '45s' } as React.CSSProperties}>
 <div className={`w-12 h-12 rounded-lg ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 cursor-default`}>
 <Icon icon={item.icon} className={`w-6 h-6 ${item.color}`} />
 </div>
 </div>
 </div>
 )
 })}
 </div>

 {/* Ring 2 - Diameter 950px (Radius 475px) */}
 <div className="absolute w-[950px] h-[950px] rounded-full border border-dashed border-surface-300/60 dark:border-surface-700/60 animate-orbit-reverse hidden sm:block" style={{ '--duration-orbit': '65s' } as React.CSSProperties}>
 {ORBIT_ICONS.ring2.map((item, i, arr) => {
 const angle = (i / arr.length) * 360;
 return (
 <div
 key={i}
 className="absolute top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-auto"
 style={{ transform: `rotate(${angle}deg) translateY(-475px) rotate(-${angle}deg)` }}
 >
 <div className="animate-orbit" style={{ '--duration-orbit': '65s' } as React.CSSProperties}>
 <div className={`w-12 h-12 rounded-lg ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 cursor-default`}>
 <Icon icon={item.icon} className={`w-6 h-6 ${item.color}`} />
 </div>
 </div>
 </div>
 )
 })}
 </div>

 {/* Ring 3 - Diameter 1250px (Radius 625px) */}
 <div className="absolute w-[1250px] h-[1250px] rounded-full border border-dashed border-surface-300/50 dark:border-surface-700/50 animate-orbit hidden md:block" style={{ '--duration-orbit': '85s' } as React.CSSProperties}>
 {ORBIT_ICONS.ring3.map((item, i, arr) => {
 const angle = (i / arr.length) * 360;
 return (
 <div
 key={i}
 className="absolute top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-auto"
 style={{ transform: `rotate(${angle}deg) translateY(-625px) rotate(-${angle}deg)` }}
 >
 <div className="animate-orbit-reverse" style={{ '--duration-orbit': '85s' } as React.CSSProperties}>
 <div className={`w-12 h-12 rounded-lg ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 cursor-default`}>
 <Icon icon={item.icon} className={`w-6 h-6 ${item.color}`} />
 </div>
 </div>
 </div>
 )
 })}
 </div>

 </div>

 {/* Main Content */}
 <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
 <div className="animate-fade-in flex flex-col items-center">

 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 text-sm text-secondary-700 dark:text-secondary-200 backdrop-blur-xl mb-8 shadow-sm">
 <Icon icon={Icons.sparkles} className="w-4 h-4 text-theme-primary" />
 <span className="font-medium">{t('landing.hero.badge')}</span>
 </div>

 <h1 className="text-display-hero text-secondary-900 dark:text-white mb-8">
 {t('landing.hero.title_prefix')}
 <br />
 <span className="text-accent-brand dark:text-white">
 {t('landing.hero.title_emphasis')}
 </span>
 </h1>

 <p className="text-lead text-secondary-600 dark:text-secondary-400 mb-12 max-w-2xl mx-auto leading-relaxed">
 {t('landing.hero.subtitle')}
 </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/dashboard">
                {t('landing.hero.view_preview')}
                <Icon icon={Icons.arrowRight} />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/auth/login">
                <Icon icon={Icons.user} />
                {t('auth.login.sign_in')}
              </Link>
            </Button>
          </div>

 {/* Stats */}
 <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl">
 {[
 { k: '50+', v: t('landing.hero.stats.pages') },
 { k: '12+', v: t('landing.hero.stats.apps') },
 { k: '100%', v: t('landing.hero.stats.typescript') },
 { k: t('landing.hero.stats.dark'), v: t('landing.hero.stats.mode') },
 ].map((s) => (
 <div key={s.v} className="rounded-2xl bg-white/60 dark:bg-surface-900/60 backdrop-blur-md border border-surface-200 dark:border-surface-800 p-6 flex flex-col items-center hover:bg-white dark:hover:bg-surface-900 transition-all duration-300">
 <p className="heading-2 text-secondary-900 dark:text-white">{s.k}</p>
 <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mt-1 uppercase tracking-wider">{s.v}</p>
 </div>
 ))}
 </div>

 </div>
 </div>
 </section>
 )
}


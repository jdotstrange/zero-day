import { cn } from '@/components/ui/cn'

export function navLinkClasses(active: boolean, collapsed: boolean, className?: string) {
  return cn(
    'nav-link',
    collapsed ? 'nav-link-collapsed' : 'nav-link-expanded',
    active ? 'nav-link-active' : 'nav-link-inactive',
    className,
  )
}

export function navSubLinkClasses(active: boolean, className?: string) {
  return cn(
    'nav-sublink',
    active ? 'nav-sublink-active' : 'nav-sublink-inactive',
    className,
  )
}

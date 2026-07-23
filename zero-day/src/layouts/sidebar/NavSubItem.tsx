import { Link, useLocation } from 'react-router'
import type { NavSubItem as NavSubItemType } from './types'
import { useLocale } from '@/i18n'
import { navSubLinkClasses } from './navClasses'

const NAV_SUB_ITEM_KEY_BY_LABEL: Record<string, string> = {
  'All Posts': 'nav.blog_all_posts',
  'Create Post': 'nav.blog_create_post',
  Products: 'nav.ecommerce_products',
  'Add Product': 'nav.ecommerce_add_product',
  Checkout: 'nav.ecommerce_checkout',
  'Side Login': 'nav.login_side',
  'Card Login': 'nav.login_card',
  'Side Register': 'nav.register_side',
  'Card Register': 'nav.register_card',
}

interface NavSubItemProps {
  item: NavSubItemType
}

export function NavSubItem({ item }: NavSubItemProps) {
  const location = useLocation()
  const { t } = useLocale()
  const isActive = location.pathname === item.path
  const label = NAV_SUB_ITEM_KEY_BY_LABEL[item.label]
    ? t(NAV_SUB_ITEM_KEY_BY_LABEL[item.label])
    : item.label

  return (
    <Link to={item.path} className={navSubLinkClasses(isActive)}>
      {label}
    </Link>
  )
}

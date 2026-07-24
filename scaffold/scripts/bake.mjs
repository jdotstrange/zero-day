#!/usr/bin/env node
/**
 * Baker CLI — materialize a client repo from zero-day/ per scaffold/BAKE.md
 * Usage: node scaffold/scripts/bake.mjs --config <path> --out <dir>
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FACTORY_ROOT = path.resolve(__dirname, '../..')
const ZERO_DAY_SRC = path.join(FACTORY_ROOT, 'zero-day')
const DOCS_SRC = path.join(FACTORY_ROOT, 'Documentation')
const NAV_REGISTRY_PATH = path.join(FACTORY_ROOT, 'scaffold/mappings/nav-registry.json')

const DASHBOARD_IDS = ['Overview', 'Analytics', 'eCommerce', 'CRM']
const STARTER_IDS = ['Email', 'Chat', 'Calendar', 'Contacts', 'Blog', 'E-commerce', 'Notes', 'Kanban']
const ADVANCED_IDS = [
  'Rule Engine', 'Query Builder', 'Simulation', 'Insights', 'Workflow Builder', 'Task Scheduler',
]
const AUTH_METHOD_IDS = ['credentials', 'passwordless', 'social', 'entra']
const PASSWORDLESS_MODES = ['otp', 'magic-link']
const MEGA_STARTER_IDS = new Set(['Email', 'Chat', 'Notes', 'Kanban', 'Calendar', 'E-commerce', 'Blog'])

const MEGA_ITEM_TEMPLATE = {
  Email: { to: '/app/email', titleKey: 'nav.email', descKey: 'header.apps.email_desc', icon: 'Icons.mail' },
  Chat: { to: '/app/chat', titleKey: 'nav.chat', descKey: 'header.apps.chat_desc', icon: 'Icons.message' },
  Notes: { to: '/app/notes', titleKey: 'nav.notes', descKey: 'header.apps.notes_desc', icon: 'Icons.note' },
  Kanban: { to: '/app/kanban', titleKey: 'nav.kanban_board', descKey: 'header.apps.kanban_desc', icon: 'Icons.kanban' },
  Calendar: { to: '/app/calendar', titleKey: 'nav.calendar', descKey: 'header.apps.calendar_desc', icon: 'Icons.calendar' },
  'E-commerce': {
    to: '/app/ecommerce/products',
    titleKey: 'nav.ecommerce_title',
    descKey: 'header.apps.ecommerce_desc',
    icon: 'Icons.shopping',
  },
  Blog: { to: '/app/blog', titleKey: 'nav.blog', descKey: 'header.apps.blog_desc', icon: 'Icons.article' },
}

const BRAND_PATTERNS = [/0-Day/g, /Zero-Day/g, /zero-day/g, /0-day/g]

const COPY_SKIP_DIRS = new Set(['node_modules', 'dist', '.git'])
const COPY_SKIP_FILE = (name) => name.endsWith('.local') || name === '.env.local'

function parseArgs(argv) {
  const args = { config: null, out: null }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--config' && argv[i + 1]) args.config = argv[++i]
    else if (argv[i] === '--out' && argv[i + 1]) args.out = argv[++i]
  }
  return args
}

function usage(msg) {
  if (msg) console.error(`Error: ${msg}\n`)
  console.error('Usage: node scaffold/scripts/bake.mjs --config <path> --out <client-output-dir>')
  process.exit(1)
}

function derivePackageName(productName) {
  let slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  slug = slug.replace(/^-+|-+$/g, '').replace(/-+/g, '-')
  return slug || 'lob-app'
}

const HEX_RE = /^#[0-9A-Fa-f]{6}$/
const PKG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// ponytail: hand validation below; scaffold.config.schema.json is source of truth — keep enums in sync
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function validateConfig(raw) {
  const errors = []
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Config must be a JSON object'] }
  }

  const allowed = new Set([
    '$schema', 'version', 'productName', 'packageName', 'defaultSurface',
    'primaryHex', 'accentHex', 'shell', 'container', 'cardStyle', 'authLayout',
    'authMethods', 'authPrimary', 'passwordlessMode', 'includeRegister',
    'dashboards', 'starterModules', 'advancedFeatures',
  ])
  for (const k of Object.keys(raw)) {
    if (!allowed.has(k)) errors.push(`Unknown field: ${k}`)
  }

  const req = [
    'version', 'productName', 'defaultSurface', 'primaryHex', 'accentHex',
    'container', 'cardStyle', 'authLayout', 'dashboards',
  ]
  for (const k of req) {
    if (raw[k] === undefined || raw[k] === null) errors.push(`Missing required field: ${k}`)
  }

  if (raw.version !== '1') errors.push('version must be "1"')
  if (typeof raw.productName !== 'string' || !raw.productName.length) {
    errors.push('productName must be non-empty string')
  }
  if (raw.packageName !== undefined && !PKG_RE.test(raw.packageName)) {
    errors.push('packageName must match ^[a-z0-9]+(?:-[a-z0-9]+)*$')
  }
  if (!['light', 'dark'].includes(raw.defaultSurface)) errors.push('defaultSurface must be light or dark')
  if (!HEX_RE.test(raw.primaryHex ?? '')) errors.push('primaryHex must be #RRGGBB')
  if (!HEX_RE.test(raw.accentHex ?? '')) errors.push('accentHex must be #RRGGBB')
  if (raw.shell !== undefined && !['sidebar', 'top-rail'].includes(raw.shell)) {
    errors.push('shell must be sidebar or top-rail')
  }
  if (!['full', 'boxed'].includes(raw.container)) errors.push('container must be full or boxed')
  if (!['shadow', 'border'].includes(raw.cardStyle)) errors.push('cardStyle must be shadow or border')
  if (!['split', 'card'].includes(raw.authLayout)) errors.push('authLayout must be split or card')
  if (raw.includeRegister !== undefined && typeof raw.includeRegister !== 'boolean') {
    errors.push('includeRegister must be boolean')
  }

  let authMethods = raw.authMethods
  if (authMethods === undefined) {
    authMethods = ['credentials']
  } else if (!Array.isArray(authMethods) || authMethods.length < 1) {
    errors.push('authMethods must be a non-empty array')
    authMethods = []
  } else {
    const seen = new Set()
    for (const id of authMethods) {
      if (!AUTH_METHOD_IDS.includes(id)) errors.push(`Invalid authMethods id: ${id}`)
      if (seen.has(id)) errors.push(`Duplicate authMethods: ${id}`)
      seen.add(id)
    }
  }

  const authPrimary = raw.authPrimary ?? authMethods[0]
  if (authPrimary !== undefined) {
    if (!AUTH_METHOD_IDS.includes(authPrimary)) {
      errors.push('authPrimary must be credentials, passwordless, social, or entra')
    } else if (authMethods.length && !authMethods.includes(authPrimary)) {
      errors.push(`authPrimary "${authPrimary}" must be included in authMethods`)
    }
  }

  if (raw.passwordlessMode !== undefined && !PASSWORDLESS_MODES.includes(raw.passwordlessMode)) {
    errors.push('passwordlessMode must be otp or magic-link')
  }

  const includeRegister = raw.includeRegister ?? false
  if (
    includeRegister
    && authMethods.length
    && !authMethods.includes('credentials')
    && !authMethods.includes('passwordless')
  ) {
    errors.push('includeRegister requires authMethods to include credentials or passwordless')
  }

  if (!Array.isArray(raw.dashboards) || raw.dashboards.length < 1) {
    errors.push('dashboards must be a non-empty array')
  } else {
    const seen = new Set()
    for (const id of raw.dashboards) {
      if (!DASHBOARD_IDS.includes(id)) errors.push(`Invalid dashboard id: ${id}`)
      if (seen.has(id)) errors.push(`Duplicate dashboard: ${id}`)
      seen.add(id)
    }
  }

  for (const [field, valid] of [
    ['starterModules', STARTER_IDS],
    ['advancedFeatures', ADVANCED_IDS],
  ]) {
    if (raw[field] === undefined) continue
    const arr = raw[field]
    if (!Array.isArray(arr)) { errors.push(`${field} must be an array`); continue }
    const seen = new Set()
    for (const id of arr) {
      if (!valid.includes(id)) errors.push(`Invalid ${field} id: ${id}`)
      if (seen.has(id)) errors.push(`Duplicate ${field}: ${id}`)
      seen.add(id)
    }
  }

  return { ok: errors.length === 0, errors }
}

function applyDefaults(raw) {
  const authMethods = raw.authMethods ?? ['credentials']
  return {
    ...raw,
    shell: raw.shell ?? 'sidebar',
    authMethods,
    authPrimary: raw.authPrimary ?? authMethods[0],
    passwordlessMode: raw.passwordlessMode ?? 'otp',
    includeRegister: raw.includeRegister ?? false,
    starterModules: raw.starterModules ?? [],
    advancedFeatures: raw.advancedFeatures ?? [],
    packageName: raw.packageName ?? derivePackageName(raw.productName),
  }
}

function hexToChannels(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

async function isDirEmpty(dir) {
  return (await fs.readdir(dir)).length === 0
}

async function validateOutDir(outDir) {
  const resolved = path.resolve(outDir)
  const zeroDayResolved = path.resolve(ZERO_DAY_SRC)

  if (resolved === zeroDayResolved || resolved.startsWith(zeroDayResolved + path.sep)) {
    throw new Error(`--out must not be inside factory zero-day/: ${resolved}`)
  }

  try {
    const stat = await fs.stat(resolved)
    if (!stat.isDirectory()) throw new Error(`--out exists and is not a directory: ${resolved}`)
    if (!(await isDirEmpty(resolved))) throw new Error(`--out must be empty: ${resolved}`)
  } catch (e) {
    if (e.code === 'ENOENT') await fs.mkdir(resolved, { recursive: true })
    else throw e
  }
  return resolved
}

async function copyTemplate(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    if (COPY_SKIP_DIRS.has(entry.name)) continue
    if (entry.isFile() && COPY_SKIP_FILE(entry.name)) continue
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) await copyTemplate(s, d)
    else await fs.copyFile(s, d)
  }
}

async function readOut(out, rel) {
  return fs.readFile(path.join(out, rel), 'utf8')
}

async function writeOut(out, rel, content) {
  const full = path.join(out, rel)
  await fs.mkdir(path.dirname(full), { recursive: true })
  await fs.writeFile(full, content, 'utf8')
}

async function transformOut(out, rel, fn) {
  await writeOut(out, rel, fn(await readOut(out, rel)))
}

async function stepPackageName(out, config) {
  const updatePkg = (raw) => {
    const pkg = JSON.parse(raw)
    pkg.name = config.packageName
    if (pkg.description) pkg.description = pkg.description.replace(/0-Day/g, config.productName)
    if (pkg.author) pkg.author = config.productName
    return `${JSON.stringify(pkg, null, 2)}\n`
  }
  await transformOut(out, 'package.json', updatePkg)
  try {
    await transformOut(out, 'package-lock.json', (raw) => {
      let r = raw.replace(/"name": "zero-day"/g, `"name": "${config.packageName}"`)
      r = r.replace(/"name": "0-day"/g, `"name": "${config.packageName}"`)
      return r
    })
  } catch { /* no lockfile */ }
}

async function stepBrandGrepPass(out, config) {
  const roots = ['src', 'public']
  const exts = new Set(['.ts', '.tsx', '.json', '.css', '.html', '.md', '.svg'])
  async function walk(dir) {
    let entries
    try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name === 'node_modules') continue
        await walk(full)
      } else if (exts.has(path.extname(e.name))) {
        const text = await fs.readFile(full, 'utf8')
        const next = brandReplace(text, config.productName)
        if (next !== text) await fs.writeFile(full, next, 'utf8')
      }
    }
  }
  for (const root of roots) await walk(path.join(out, root))
}

function brandReplace(text, productName) {
  let result = text
  for (const re of BRAND_PATTERNS) result = result.replace(re, productName)
  return result
}

async function stepBrandSweep(out, config) {
  const { productName, packageName } = config
  const themeKey = `${packageName}-theme`
  const localeKey = `${packageName}-locale`
  const dirKey = `${packageName}-direction-locked-by-locale`

  await transformOut(out, 'src/i18n/locales/en.json', (c) => brandReplace(c, productName))

  const localeDir = path.join(out, 'src/i18n/locales')
  const locales = (await fs.readdir(localeDir)).filter((f) => f.endsWith('.json') && f !== 'en.json')
  for (const file of locales) {
    await transformOut(out, `src/i18n/locales/${file}`, (c) => brandReplace(c, productName))
  }

  const safeName = escapeHtml(productName)

  await transformOut(out, 'index.html', (c) => {
    let r = c.replace(/<title>[^<]*<\/title>/, `<title>${safeName}</title>`)
    return r.replace(/zeroday-theme/g, themeKey)
  })

  await transformOut(out, 'src/components/common/Logo.tsx', (c) =>
    brandReplace(c.replace(/alt="0-Day"/g, `alt="${safeName}"`), productName),
  )

  await transformOut(out, 'src/layouts/header/AppHeader.tsx', (c) =>
    c.replace(/aria-label="0-Day Home"/, `aria-label="${safeName} Home"`),
  )

  await transformOut(out, 'src/pages/forms/FormLayoutPage.tsx', (c) =>
    c.replace(/placeholder="0-Day Inc\."/, `placeholder="${productName} Inc."`),
  )

  await transformOut(out, 'src/context/ThemeContext.tsx', (c) =>
    c.replace(/const STORAGE_KEY = 'zeroday-theme'/, `const STORAGE_KEY = '${themeKey}'`),
  )

  await transformOut(out, 'src/i18n/LocaleProvider.tsx', (c) =>
    c
      .replace(/const STORAGE_KEY = 'zeroday-locale'/, `const STORAGE_KEY = '${localeKey}'`)
      .replace(
        /const DIRECTION_LOCK_STORAGE_KEY = 'zeroday-direction-locked-by-locale'/,
        `const DIRECTION_LOCK_STORAGE_KEY = '${dirKey}'`,
      ),
  )

  for (const css of [
    'src/index.css', 'src/styles/variables.css', 'src/styles/base.css',
    'src/styles/components.css', 'src/styles/layout.css', 'src/styles/forms.css',
    'src/styles/fonts.css', 'src/styles/animations.css',
  ]) {
    try { await transformOut(out, css, (c) => brandReplace(c, productName)) } catch { /* skip */ }
  }

  await transformOut(out, 'src/types/theme.ts', (c) => brandReplace(c, productName))

  for (const svg of ['public/assets/logo/logo.svg', 'public/assets/logo/logo-dark.svg']) {
    try {
      await transformOut(out, svg, (c) => c.replace(/aria-label="0-Day"/, `aria-label="${safeName}"`))
    } catch { /* skip */ }
  }

  try { await transformOut(out, 'README.md', (c) => brandReplace(c, productName)) } catch { /* skip */ }
}

async function stepColors(out, config) {
  const primary = hexToChannels(config.primaryHex)
  const accent = hexToChannels(config.accentHex)

  await transformOut(out, 'src/styles/variables.css', (c) =>
    c
      .replace(/--theme-primary:\s*[\d\s]+;/, `--theme-primary: ${primary};`)
      .replace(/--theme-accent:\s*[\d\s]+;/, `--theme-accent: ${accent};`),
  )

  await transformOut(out, 'src/types/theme.ts', (c) => {
    let r = c
    if (!r.includes("'brand'")) {
      r = r.replace(/export type ThemeColor = .+/, (m) => `${m} | 'brand'`)
    }
    const brandBlock = `brand: {\n    primary: '${primary}',\n    accent: '${accent}',\n  }`
    if (!r.includes('brand:')) {
      r = r.replace(/(cyan:\s*\{[^}]+\},)\r?\n(\})/, `$1\n  ${brandBlock},\n$2`)
    } else {
      r = r.replace(/brand:\s*\{[^}]+\}/, brandBlock)
    }
    return r
  })

  await transformOut(out, 'index.html', (c) => {
    const brandLine = `brand: ['${primary}', '${accent}']`
    if (!c.includes('brand:')) {
      return c.replace(/(cyan:\s*\[[^\]]+\],)\r?\n(\s+\})/, `$1\n            ${brandLine},\n$2`)
    }
    return c.replace(/brand:\s*\[[^\]]+\]/, brandLine)
  })
}

async function stepThemeDefaults(out, config, registry) {
  const sidebarLayout = registry.shellMap[config.shell]
  const block = `export const defaultThemeConfig: ThemeConfig = {
  mode: '${config.defaultSurface}',
  direction: 'ltr',
  color: 'brand',
  sidebarLayout: '${sidebarLayout}',
  container: '${config.container}',
  cardStyle: '${config.cardStyle}',
  sidebarCollapsed: false,
}`

  await transformOut(out, 'src/types/theme.ts', (c) =>
    c.replace(/export const defaultThemeConfig: ThemeConfig = \{[\s\S]*?\r?\n\}/, block),
  )
}

function repointAuth(content, authPrefix) {
  if (authPrefix === '/auth') return content
  // Quote-bound only — never touch Vite alias imports like `@/auth/config`
  return content.replace(/(['"`])\/auth\//g, `$1${authPrefix}/`)
}

async function stepAuthLinks(out, config, registry) {
  const authPrefix = registry.authPrefixMap[config.authLayout]
  for (const rel of [
    'src/pages/auth/LoginPage.tsx',
    'src/pages/auth/RegisterPage.tsx',
    'src/pages/auth/ForgotPasswordPage.tsx',
    'src/pages/auth/components/CredentialsForm.tsx',
    'src/auth/RequireAuth.tsx',
    'src/layouts/header/AppHeader.tsx',
    'src/layouts/sidebar/Sidebar.tsx',
  ]) {
    await transformOut(out, rel, (c) => repointAuth(c, authPrefix))
  }
}

function formatAuthConfigBlock(config, homePath) {
  const methods = config.authMethods.map((m) => `'${m}'`).join(', ')
  return `export const authConfig: AuthUiConfig = {
  methods: [${methods}],
  primary: '${config.authPrimary}',
  registerEnabled: ${config.includeRegister},
  passwordlessMode: '${config.passwordlessMode}',
  socialProviders: ['google', 'apple'],
  adapter: 'mock',
  postLoginPath: '${homePath}',
}`
}

async function stepAuthConfig(out, config, homePath) {
  const block = formatAuthConfigBlock(config, homePath)
  const re = /export const authConfig: AuthUiConfig = \{[\s\S]*?\r?\n\}/
  await transformOut(out, 'src/auth/config.ts', (c) => {
    if (!re.test(c)) throw new Error('src/auth/config.ts: authConfig block not found')
    return c.replace(re, block)
  })
}

function lookupById(list, id) {
  return list.find((e) => e.id === id)
}

function formatNavItem(entry) {
  const lines = [`      { path: '${entry.path}', label: '${entry.label}', icon: Icons.${entry.icon}`]
  if (entry.children?.length) {
    lines[0] += ','
    lines.push('        children: [')
    for (const ch of entry.children) {
      lines.push(`          { path: '${ch.path}', label: '${ch.label}' },`)
    }
    lines.push('        ],')
    lines.push('      },')
  } else {
    lines[0] += ' },'
  }
  return lines.join('\n')
}

function generateNavData(config, registry) {
  const groups = []

  const dashItems = config.dashboards.map((id) => lookupById(registry.dashboards, id)).filter(Boolean)
  if (dashItems.length) groups.push({ title: 'Dashboards', items: dashItems })

  const appItems = [
    ...config.starterModules.map((id) => lookupById(registry.starterModules, id)),
    ...config.advancedFeatures.map((id) => lookupById(registry.advancedFeatures, id)),
  ].filter(Boolean)
  if (appItems.length) groups.push({ title: 'Apps', items: appItems })

  const pagesItems = registry.alwaysNav ?? []
  if (pagesItems.length) groups.push({ title: 'Pages', items: pagesItems })

  const groupBlocks = groups.map((g) => {
    const items = g.items.map(formatNavItem).join('\n')
    return `  {\n    title: '${g.title}',\n    items: [\n${items}\n    ],\n  }`
  })

  return `import { Icons } from '@/components/common'
import type { NavGroup } from './types'

/**
 * Navigation menu configuration
 * Centralized navigation data for the sidebar
 * Generated by scaffold baker — do not edit by hand
 */
export const navGroups: NavGroup[] = [
${groupBlocks.join(',\n')},
]
`
}

async function stepNavData(out, config, registry) {
  await writeOut(out, 'src/layouts/sidebar/navData.ts', generateNavData(config, registry))
}

function generateMegaMenusBlock(config, homePath) {
  const items = config.starterModules
    .filter((id) => MEGA_STARTER_IDS.has(id))
    .map((id) => {
      const t = MEGA_ITEM_TEMPLATE[id]
      if (!t) return null
      return `          { to: '${t.to}', title: t('${t.titleKey}'), description: t('${t.descKey}'), icon: ${t.icon} },`
    })
    .filter(Boolean)
    .join('\n')

  return `  const menus = useMemo<MegaMenu[]>(
    () => [
      {
        id: 'apps',
        label: t('header.menu.apps'),
        items: [
${items}
        ],
        footer: { label: t('header.footer.all_apps'), to: '${homePath}' },
      },
    ],
    [t],
  )`
}

async function stepTopRailMega(out, config, homePath) {
  if (config.shell !== 'top-rail') return
  let c = await readOut(out, 'src/layouts/header/AppHeader.tsx')
  const menusRe = /const menus = useMemo<MegaMenu\[\]>\(\s*\(\) => \[[\s\S]*?\],\s*\[t\],\s*\)/
  if (!menusRe.test(c)) throw new Error('AppHeader.tsx: could not find menus useMemo block')
  c = c.replace(menusRe, generateMegaMenusBlock(config, homePath))
  await writeOut(out, 'src/layouts/header/AppHeader.tsx', c)
}

async function stepDocumentation(out, config) {
  const docsDest = path.join(out, 'Documentation')
  await fs.mkdir(docsDest, { recursive: true })

  const stampedName = escapeHtml(config.productName)
  const indexContent = (await fs.readFile(path.join(DOCS_SRC, 'index.html'), 'utf8'))
    .replaceAll('0-Day', stampedName)
  await fs.writeFile(path.join(docsDest, 'index.html'), indexContent, 'utf8')

  try {
    await fs.copyFile(path.join(DOCS_SRC, 'favicon.ico'), path.join(docsDest, 'favicon.ico'))
  } catch { /* favicon optional */ }
}

async function stepHomePath(out, homePath) {
  const replacements = [
    ['src/routes/index.tsx', /(<Navigate to=")\/dashboard(")/g, `$1${homePath}$2`],
    ['src/layouts/sidebar/Sidebar.tsx', /(<Link to=")\/dashboard(")/g, `$1${homePath}$2`],
    ['src/layouts/AuthLayout.tsx', /(<Link to=")\/dashboard(")/g, `$1${homePath}$2`],
    ['src/pages/errors/NotFoundPage.tsx', /(<Link to=")\/dashboard(")/g, `$1${homePath}$2`],
    ['src/layouts/header/AppHeader.tsx', /(<Link to=")\/dashboard(")/g, `$1${homePath}$2`],
    ['src/layouts/header/AppHeader.tsx', /(<TopLink to=")\/dashboard(")/g, `$1${homePath}$2`],
  ]

  for (const [rel, re, rep] of replacements) {
    await transformOut(out, rel, (c) => c.replace(re, rep))
  }

  await transformOut(out, 'src/layouts/header/AppHeader.tsx', (c) =>
    c.replace(
      /footer: \{ label: t\('header\.footer\.all_apps'\), to: '\/dashboard' \}/,
      `footer: { label: t('header.footer.all_apps'), to: '${homePath}' }`,
    ),
  )

  const routes = await readOut(out, 'src/routes/index.tsx')
  if (!routes.includes(`to="${homePath}"`)) {
    throw new Error(`routes/index.tsx: failed to repoint Navigate to ${homePath}`)
  }

  const authLayout = await readOut(out, 'src/layouts/AuthLayout.tsx')
  if (!authLayout.includes(`to="${homePath}"`)) {
    throw new Error(`AuthLayout.tsx: failed to repoint home Link to ${homePath}`)
  }
}

async function printChecklist(out, config, registry, homePath) {
  const checks = []
  const pass = (label, ok) => checks.push({ label, ok })

  try {
    const pkg = JSON.parse(await readOut(out, 'package.json'))
    pass(`package.json name === ${config.packageName}`, pkg.name === config.packageName)
  } catch { pass('package.json readable', false) }

  try {
    const en = JSON.parse(await readOut(out, 'src/i18n/locales/en.json'))
    pass(`en.json brand.name === ${config.productName}`, en['brand.name'] === config.productName)
  } catch { pass('en.json brand.name', false) }

  try {
    const html = await readOut(out, 'index.html')
    const safeTitle = escapeHtml(config.productName)
    pass('index.html title matches productName', html.includes(`<title>${safeTitle}</title>`))
    pass('index.html storage key', html.includes(`${config.packageName}-theme`))
    pass('index.html brand preset', html.includes('brand:'))
  } catch { pass('index.html checks', false) }

  try {
    const nav = await readOut(out, 'src/layouts/sidebar/navData.ts')
    pass('navData.ts regenerated', nav.includes('Generated by scaffold baker'))
    pass(
      'navData has selected dashboards',
      config.dashboards.every((d) => {
        const entry = lookupById(registry.dashboards, d)
        return entry && nav.includes(entry.path)
      }),
    )
  } catch { pass('navData.ts', false) }

  try {
    const routes = await readOut(out, 'src/routes/index.tsx')
    pass(`routes index → ${homePath}`, routes.includes(`to="${homePath}"`))
  } catch { pass('routes homePath', false) }

  try {
    const theme = await readOut(out, 'src/types/theme.ts')
    pass("defaultThemeConfig.color === 'brand'", theme.includes("color: 'brand'"))
    pass(`defaultThemeConfig.mode === ${config.defaultSurface}`, theme.includes(`mode: '${config.defaultSurface}'`))
  } catch { pass('theme.ts defaults', false) }

  try {
    const tc = await readOut(out, 'src/context/ThemeContext.tsx')
    pass('ThemeContext storage key', tc.includes(`${config.packageName}-theme`))
  } catch { pass('ThemeContext key', false) }

  try {
    const authCfg = await readOut(out, 'src/auth/config.ts')
    const methodsLit = `[${config.authMethods.map((m) => `'${m}'`).join(', ')}]`
    pass("authConfig adapter: 'mock'", /adapter:\s*'mock'/.test(authCfg))
    pass(`authConfig methods: ${methodsLit}`, authCfg.includes(`methods: ${methodsLit}`))
    pass(`authConfig postLoginPath: '${homePath}'`, authCfg.includes(`postLoginPath: '${homePath}'`))
  } catch { pass('src/auth/config.ts authConfig', false) }

  const authPrefix = registry.authPrefixMap[config.authLayout]
  if (config.authLayout === 'card') {
    try {
      const requireAuth = await readOut(out, 'src/auth/RequireAuth.tsx')
      const header = await readOut(out, 'src/layouts/header/AppHeader.tsx')
      const sidebar = await readOut(out, 'src/layouts/sidebar/Sidebar.tsx')
      pass(
        'RequireAuth uses card auth prefix',
        requireAuth.includes(`to="${authPrefix}/login"`),
      )
      pass(
        'logout navigates use card auth prefix',
        header.includes(`navigate('${authPrefix}/login')`)
          && sidebar.includes(`navigate('${authPrefix}/login')`),
      )
    } catch { pass('card authPrefix links', false) }
  }

  try {
    let corrupt = false
    async function scan(dir) {
      for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
        if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue
        const p = path.join(dir, ent.name)
        if (ent.isDirectory()) await scan(p)
        else if (/\.(tsx?|jsx?|mjs|cjs|json)$/.test(ent.name)) {
          if ((await fs.readFile(p, 'utf8')).includes('@/auth-card')) corrupt = true
        }
      }
    }
    await scan(out)
    pass("no '@/auth-card' import corruption", !corrupt)
  } catch { pass("no '@/auth-card' import corruption", false) }

  try {
    const docs = await readOut(out, 'Documentation/index.html')
    const safeName = escapeHtml(config.productName)
    pass('Documentation/index.html exists', true)
    pass('Documentation/index.html title/brand uses productName', docs.includes(safeName))
    pass('Documentation/index.html: no leftover 0-Day', !docs.includes('0-Day'))
  } catch { pass('Documentation/index.html stamped', false) }

  console.log('\n── Bake checklist ──')
  let allOk = true
  for (const { label, ok } of checks) {
    console.log(`  ${ok ? '✓' : '✗'} ${label}`)
    if (!ok) allOk = false
  }
  console.log(`\nOutput: ${out}`)
  console.log(`packageName: ${config.packageName}`)
  console.log(`homePath: ${homePath}`)
  console.log(`authPrefix: ${registry.authPrefixMap[config.authLayout]}`)
  console.log(`shell: ${config.shell} → ${registry.shellMap[config.shell]}`)
  return allOk
}

async function main() {
  const args = parseArgs(process.argv)
  if (!args.config || !args.out) usage('Missing --config or --out')

  const configPath = path.resolve(args.config)
  let rawConfig
  try {
    rawConfig = JSON.parse(await fs.readFile(configPath, 'utf8'))
  } catch (e) {
    usage(`Cannot read config: ${e.message}`)
  }

  const validation = validateConfig(rawConfig)
  if (!validation.ok) {
    console.error('Config validation failed:')
    validation.errors.forEach((e) => console.error(`  - ${e}`))
    process.exit(1)
  }

  const config = applyDefaults(rawConfig)

  let registry
  try {
    registry = JSON.parse(await fs.readFile(NAV_REGISTRY_PATH, 'utf8'))
  } catch (e) {
    console.error(`Cannot read nav-registry: ${e.message}`)
    process.exit(1)
  }

  const firstDash = lookupById(registry.dashboards, config.dashboards[0])
  if (!firstDash) {
    console.error(`Dashboard not in registry: ${config.dashboards[0]}`)
    process.exit(1)
  }
  const homePath = firstDash.path

  let out
  try {
    out = await validateOutDir(args.out)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }

  console.log(`Baking ${config.productName} → ${out}`)

  try {
    await copyTemplate(ZERO_DAY_SRC, out)
    await stepPackageName(out, config)
    await stepBrandSweep(out, config)
    await stepBrandGrepPass(out, config)
    await stepColors(out, config)
    await stepThemeDefaults(out, config, registry)
    await stepAuthLinks(out, config, registry)
    await stepAuthConfig(out, config, homePath)
    await stepNavData(out, config, registry)
    await stepTopRailMega(out, config, homePath)
    await stepHomePath(out, homePath)
    await stepDocumentation(out, config)

    const ok = await printChecklist(out, config, registry, homePath)
    process.exit(ok ? 0 : 1)
  } catch (e) {
    console.error(`Bake failed: ${e.message}`)
    if (e.stack) console.error(e.stack)
    process.exit(1)
  }
}

main()

#!/usr/bin/env node
/**
 * Ensure a zero-day factory is available locally (workspace, parent, or git cache).
 *
 * Env:
 *   ZERO_DAY_FACTORY_URL   — git remote (default: https://github.com/jdotstrange/zero-day.git)
 *   ZERO_DAY_FACTORY_CACHE — local clone path (default: %LOCALAPPDATA%\zero-day-factory or ~/.cache/zero-day-factory)
 *
 * Usage:
 *   node scaffold/scripts/ensure-factory.mjs [--json]
 *
 * Exit 0: prints factory root (last line of stdout, or JSON with --json).
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_URL = 'https://github.com/jdotstrange/zero-day.git'
const FACTORY_URL = process.env.ZERO_DAY_FACTORY_URL || DEFAULT_URL

function defaultCacheDir() {
  if (process.env.ZERO_DAY_FACTORY_CACHE) return process.env.ZERO_DAY_FACTORY_CACHE
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
    return path.join(localAppData, 'zero-day-factory')
  }
  return path.join(os.homedir(), '.cache', 'zero-day-factory')
}

const CACHE_DIR = defaultCacheDir()
const JSON_OUT = process.argv.includes('--json')

function fail(msg, code = 1) {
  console.error(`ensure-factory: ${msg}`)
  process.exit(code)
}

function gitOk() {
  const r = spawnSync('git', ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' })
  return r.status === 0
}

function runGit(args, cwd) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return r
}

function isFactoryRoot(dir) {
  const zeroDay = path.join(dir, 'zero-day')
  const bake = path.join(dir, 'scaffold', 'scripts', 'bake.mjs')
  try {
    return fs.statSync(zeroDay).isDirectory() && fs.statSync(bake).isFile()
  } catch {
    return false
  }
}

/** Walk cwd → filesystem root for a factory layout (dev mode). */
function findFactoryInAncestors(startDir) {
  let dir = path.resolve(startDir)
  for (;;) {
    if (isFactoryRoot(dir)) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

/** Script lives inside a factory when run from scaffold/scripts/. */
function factoryFromScriptLocation() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidate = path.resolve(here, '../..')
  return isFactoryRoot(candidate) ? candidate : null
}

function emit(factoryRoot, source) {
  if (JSON_OUT) {
    console.log(JSON.stringify({ factoryRoot, source }))
  } else {
    console.log(`Factory ready (${source}): ${factoryRoot}`)
    console.log(factoryRoot)
  }
}

function cloneFactory() {
  if (fs.existsSync(CACHE_DIR) && fs.readdirSync(CACHE_DIR).length > 0) {
    fail(`cache path exists but is not a valid factory: ${CACHE_DIR}`)
  }
  fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true })
  console.error(`Cloning ${FACTORY_URL} → ${CACHE_DIR}`)
  const r = runGit(['clone', '--depth', '1', FACTORY_URL, CACHE_DIR])
  if (r.status !== 0) {
    fail(`git clone failed:\n${r.stderr || r.stdout || '(no output)'}`)
  }
  if (!isFactoryRoot(CACHE_DIR)) {
    fail(`clone succeeded but cache is missing zero-day/ or scaffold/scripts/bake.mjs: ${CACHE_DIR}`)
  }
}

/**
 * Shallow fetch + hard reset to origin/main, else origin/HEAD.
 * ponytail: assumes default branch is main; origin/HEAD fallback covers renames.
 */
function updateCache() {
  console.error(`Updating factory cache: ${CACHE_DIR}`)
  let r = runGit(['fetch', '--depth', '1', 'origin'], CACHE_DIR)
  if (r.status !== 0) {
    fail(`git fetch failed:\n${r.stderr || r.stdout || '(no output)'}`)
  }
  r = runGit(['reset', '--hard', 'origin/main'], CACHE_DIR)
  if (r.status !== 0) {
    r = runGit(['reset', '--hard', 'origin/HEAD'], CACHE_DIR)
    if (r.status !== 0) {
      fail(`git reset failed (tried origin/main and origin/HEAD):\n${r.stderr || r.stdout || '(no output)'}`)
    }
  }
  if (!isFactoryRoot(CACHE_DIR)) {
    fail(`cache updated but is not a valid factory: ${CACHE_DIR}`)
  }
}

function ensureFromCache() {
  if (!gitOk()) fail('git is not installed or not on PATH')
  if (!fs.existsSync(CACHE_DIR)) {
    cloneFactory()
  } else if (!isFactoryRoot(CACHE_DIR)) {
    fail(`cache path exists but is not a valid factory (delete it or set ZERO_DAY_FACTORY_CACHE): ${CACHE_DIR}`)
  } else {
    updateCache()
  }
  emit(CACHE_DIR, 'cache')
}

// 1) Script location (running from inside factory)
const fromScript = factoryFromScriptLocation()
if (fromScript) {
  emit(fromScript, 'workspace')
  process.exit(0)
}

// 2) cwd or ancestor (operator opened a subfolder of factory)
const fromCwd = findFactoryInAncestors(process.cwd())
if (fromCwd) {
  emit(fromCwd, 'workspace')
  process.exit(0)
}

// 3) git cache
ensureFromCache()

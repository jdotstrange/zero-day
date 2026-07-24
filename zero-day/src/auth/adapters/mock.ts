import { authConfig } from '../config'
import type { AuthAdapter, AuthSession, SignInInput } from '../types'

const STORAGE_KEY = 'zeroday-auth-session'

const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  avatarUrl: undefined as string | undefined,
}

function demoSession(email?: string, name?: string): AuthSession {
  return {
    user: {
      ...DEMO_USER,
      email: email ?? DEMO_USER.email,
      name: name ?? (email ? email.split('@')[0] : DEMO_USER.name),
    },
  }
}

function readStored(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function writeStored(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const listeners = new Set<(s: AuthSession | null) => void>()

function notify(session: AuthSession | null) {
  writeStored(session)
  listeners.forEach((cb) => cb(session))
}

export const mockAdapter: AuthAdapter = {
  id: 'mock',

  async signIn(input: SignInInput): Promise<AuthSession> {
    switch (input.method) {
      case 'credentials': {
        const session = demoSession(input.email)
        notify(session)
        return session
      }
      case 'passwordless-request': {
        if (authConfig.passwordlessMode === 'magic-link') {
          // Demo: magic-link request auto-succeeds (no inbox required).
          const session = demoSession(input.email)
          notify(session)
          return session
        }
        // OTP: acknowledge request without establishing a session.
        return demoSession(input.email, 'Pending')
      }
      case 'passwordless-verify': {
        if (input.code !== '000000') {
          throw new Error('Invalid code — use 000000 in the mock adapter')
        }
        const session = demoSession(input.email)
        notify(session)
        return session
      }
      case 'social': {
        const session = demoSession(`${input.provider}@example.com`, `${input.provider} User`)
        notify(session)
        return session
      }
      case 'entra': {
        const session = demoSession('entra@example.com', 'Entra Demo User')
        notify(session)
        return session
      }
    }
  },

  async signOut(): Promise<void> {
    notify(null)
  },

  async getSession(): Promise<AuthSession | null> {
    return readStored()
  },

  onSessionChange(cb: (s: AuthSession | null) => void): () => void {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  },
}

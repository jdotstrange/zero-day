import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authConfig } from '@/auth/config'
import { getAdapter } from '@/auth/adapters'
import type { AuthSession, SignInInput } from '@/auth/types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  session: AuthSession | null
  status: AuthStatus
  signIn: (input: SignInInput) => Promise<AuthSession>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const adapter = getAdapter(authConfig.adapter)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let cancelled = false
    let unsub: () => void = () => {}

    adapter.getSession().then((s) => {
      if (cancelled) return
      setSession(s)
      setStatus(s ? 'authenticated' : 'unauthenticated')
    }).catch(() => {
      if (cancelled) return
      setSession(null)
      setStatus('unauthenticated')
    })

    try {
      unsub = adapter.onSessionChange((s) => {
        setSession(s)
        setStatus(s ? 'authenticated' : 'unauthenticated')
      })
    } catch {
      // Stub adapters throw until wired — ignore subscription.
    }

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  const signIn = useCallback(async (input: SignInInput) => {
    const next = await adapter.signIn(input)
    // OTP request only sends a code — do not treat as authenticated yet.
    if (input.method === 'passwordless-request' && authConfig.passwordlessMode === 'otp') {
      return next
    }
    setSession(next)
    setStatus('authenticated')
    return next
  }, [])

  const signOut = useCallback(async () => {
    await adapter.signOut()
    setSession(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

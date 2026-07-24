import type { AdapterId } from './config'

export interface AuthSession {
  user: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  expiresAt?: number
}

export type SignInInput =
  | { method: 'credentials'; email: string; password: string }
  | { method: 'passwordless-request'; email: string }
  | { method: 'passwordless-verify'; email: string; code: string }
  | { method: 'social'; provider: 'google' | 'apple' | 'github' }
  | { method: 'entra' }

export interface AuthAdapter {
  id: AdapterId
  signIn(input: SignInInput): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  onSessionChange(cb: (s: AuthSession | null) => void): () => void
}

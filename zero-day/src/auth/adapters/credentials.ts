import type { AuthAdapter, AuthSession, SignInInput } from '../types'

/**
 * Credentials adapter stub — wire your email/password API here.
 * Point signIn at your login endpoint; persist tokens in getSession/signOut.
 */
export const credentialsAdapter: AuthAdapter = {
  id: 'credentials',

  async signIn(_input: SignInInput): Promise<AuthSession> {
    // wire your API here: POST /auth/login with email + password
    throw new Error('credentials adapter not wired')
  },

  async signOut(): Promise<void> {
    // wire your API here: invalidate server session / clear tokens
    throw new Error('credentials adapter not wired')
  },

  async getSession(): Promise<AuthSession | null> {
    // wire your API here: validate cookie/JWT and return current user
    throw new Error('credentials adapter not wired')
  },

  onSessionChange(_cb: (s: AuthSession | null) => void): () => void {
    // wire your API here: subscribe to token refresh / storage events
    throw new Error('credentials adapter not wired')
  },
}

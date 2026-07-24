import type { AuthAdapter, AuthSession, SignInInput } from '../types'

/**
 * Passwordless adapter stub — wire OTP / magic-link API here.
 * passwordless-request → send code/link; passwordless-verify → confirm OTP.
 */
export const passwordlessAdapter: AuthAdapter = {
  id: 'passwordless',

  async signIn(_input: SignInInput): Promise<AuthSession> {
    // wire your API here: send OTP/magic link or verify code
    throw new Error('passwordless adapter not wired')
  },

  async signOut(): Promise<void> {
    // wire your API here: invalidate server session / clear tokens
    throw new Error('passwordless adapter not wired')
  },

  async getSession(): Promise<AuthSession | null> {
    // wire your API here: validate cookie/JWT and return current user
    throw new Error('passwordless adapter not wired')
  },

  onSessionChange(_cb: (s: AuthSession | null) => void): () => void {
    // wire your API here: subscribe to token refresh / storage events
    throw new Error('passwordless adapter not wired')
  },
}

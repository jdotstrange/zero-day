import type { AuthAdapter, AuthSession, SignInInput } from '../types'

/**
 * OAuth/social adapter stub — wire Google/Apple/GitHub (or your IdP) here.
 * Typically redirect or popup to the provider, then exchange the code for a session.
 */
export const oauthAdapter: AuthAdapter = {
  id: 'oauth',

  async signIn(_input: SignInInput): Promise<AuthSession> {
    // wire your API here: start OAuth for input.provider and exchange the callback
    throw new Error('oauth adapter not wired')
  },

  async signOut(): Promise<void> {
    // wire your API here: revoke tokens / clear session
    throw new Error('oauth adapter not wired')
  },

  async getSession(): Promise<AuthSession | null> {
    // wire your API here: validate cookie/JWT and return current user
    throw new Error('oauth adapter not wired')
  },

  onSessionChange(_cb: (s: AuthSession | null) => void): () => void {
    // wire your API here: subscribe to token refresh / storage events
    throw new Error('oauth adapter not wired')
  },
}

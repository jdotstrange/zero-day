import type { AccountInfo, PublicClientApplication } from '@azure/msal-browser'
import type { AuthAdapter, AuthSession, SignInInput } from '../types'

const DEFAULT_SCOPES = ['User.Read']

let pca: PublicClientApplication | null = null
let initPromise: Promise<PublicClientApplication> | null = null

const listeners = new Set<(s: AuthSession | null) => void>()

function requireEnv(): { clientId: string; tenantId: string; redirectUri: string } {
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string | undefined
  const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string | undefined
  if (!clientId || !tenantId) {
    throw new Error(
      'Entra ID is not configured — set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID',
    )
  }
  const redirectUri =
    (import.meta.env.VITE_AZURE_REDIRECT_URI as string | undefined) || window.location.origin
  return { clientId, tenantId, redirectUri }
}

/** Lazy-init MSAL only when this adapter is actually used (never at import time). */
async function getMsal(): Promise<PublicClientApplication> {
  if (pca) return pca
  if (!initPromise) {
    initPromise = (async () => {
      const { clientId, tenantId, redirectUri } = requireEnv()
      const { PublicClientApplication: PCA } = await import('@azure/msal-browser')
      const instance = new PCA({
        auth: {
          clientId,
          authority: `https://login.microsoftonline.com/${tenantId}`,
          redirectUri,
        },
        cache: {
          cacheLocation: 'localStorage',
        },
      })
      await instance.initialize()
      // Prefer loginPopup for SPA routing simplicity.
      // For redirect flow instead: use loginRedirect / handleRedirectPromise on boot.
      pca = instance
      return instance
    })()
  }
  return initPromise
}

function accountToSession(account: AccountInfo): AuthSession {
  return {
    user: {
      id: account.homeAccountId,
      name: account.name ?? account.username,
      email: account.username,
    },
  }
}

function notify(session: AuthSession | null) {
  listeners.forEach((cb) => cb(session))
}

export const entraAdapter: AuthAdapter = {
  id: 'entra',

  async signIn(input: SignInInput): Promise<AuthSession> {
    if (input.method !== 'entra') {
      throw new Error(`entra adapter does not support method '${input.method}'`)
    }
    const msal = await getMsal()
    const result = await msal.loginPopup({ scopes: DEFAULT_SCOPES })
    const account = result.account
    if (!account) {
      throw new Error('Entra login succeeded but no account was returned')
    }
    msal.setActiveAccount(account)
    const session = accountToSession(account)
    notify(session)
    return session
  },

  async signOut(): Promise<void> {
    const msal = await getMsal()
    const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0]
    if (account) {
      await msal.logoutPopup({ account })
    }
    notify(null)
  },

  async getSession(): Promise<AuthSession | null> {
    // Soft-fail when env is missing so boot with adapter:'mock' is never broken
    // if someone briefly flips config without env. Active entra adapter still
    // surfaces the error on signIn.
    try {
      requireEnv()
    } catch {
      return null
    }
    const msal = await getMsal()
    const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null
    if (!account) return null
    msal.setActiveAccount(account)
    return accountToSession(account)
  },

  onSessionChange(cb: (s: AuthSession | null) => void): () => void {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  },
}

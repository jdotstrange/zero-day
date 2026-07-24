import type { AdapterId } from '../config'
import type { AuthAdapter } from '../types'
import { credentialsAdapter } from './credentials'
import { entraAdapter } from './entra'
import { mockAdapter } from './mock'
import { oauthAdapter } from './oauth'
import { passwordlessAdapter } from './passwordless'

const adapters: Record<AdapterId, AuthAdapter> = {
  mock: mockAdapter,
  credentials: credentialsAdapter,
  passwordless: passwordlessAdapter,
  oauth: oauthAdapter,
  entra: entraAdapter,
}

export function getAdapter(id: AdapterId): AuthAdapter {
  return adapters[id]
}

export { credentialsAdapter, entraAdapter, mockAdapter, oauthAdapter, passwordlessAdapter }

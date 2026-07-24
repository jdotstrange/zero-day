export type AuthMethod = 'credentials' | 'passwordless' | 'social' | 'entra'
export type AdapterId = 'mock' | 'credentials' | 'passwordless' | 'oauth' | 'entra'

export interface AuthUiConfig {
  methods: AuthMethod[]
  primary: AuthMethod
  registerEnabled: boolean
  passwordlessMode: 'otp' | 'magic-link'
  socialProviders: ('google' | 'apple' | 'github')[]
  adapter: AdapterId
  postLoginPath: string
}

export const authConfig: AuthUiConfig = {
  methods: ['credentials'],
  primary: 'credentials',
  registerEnabled: true,
  passwordlessMode: 'otp',
  socialProviders: ['google', 'apple'],
  adapter: 'mock',
  postLoginPath: '/dashboard',
}

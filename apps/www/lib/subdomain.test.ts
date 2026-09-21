import { describe, expect, it } from 'vitest'

import { getValidSubdomain } from './subdomain'

describe('getValidSubdomain with a known root domain', () => {
  const root = 'myworldx.dev'

  it('reads the label in front of the root domain', () => {
    expect(getValidSubdomain('raferdev.myworldx.dev', root)).toBe('raferdev')
  })

  it('ignores the port on both the host and the root domain', () => {
    expect(getValidSubdomain('raferdev.localhost:3111', 'localhost:3111')).toBe('raferdev')
    expect(getValidSubdomain('raferdev.myworldx.dev:443', root)).toBe('raferdev')
  })

  it('returns nothing for the root domain itself', () => {
    expect(getValidSubdomain('myworldx.dev', root)).toBeNull()
    expect(getValidSubdomain('myworldx.dev:3111', root)).toBeNull()
  })

  it('refuses a host that merely ends with the root domain', () => {
    expect(getValidSubdomain('notmyworldx.dev', root)).toBeNull()
    expect(getValidSubdomain('evil-myworldx.dev', root)).toBeNull()
  })

  it('refuses a nested label rather than guessing which part is the account', () => {
    expect(getValidSubdomain('a.b.myworldx.dev', root)).toBeNull()
  })

  it('matches case-insensitively', () => {
    expect(getValidSubdomain('RaferDev.MyWorldX.dev', root)).toBe('raferdev')
  })
})

describe('getValidSubdomain without a root domain', () => {
  it('takes the first label when the host has at least three', () => {
    expect(getValidSubdomain('raferdev.myworldx.dev')).toBe('raferdev')
  })

  it('returns nothing for a bare domain or localhost', () => {
    expect(getValidSubdomain('myworldx.dev')).toBeNull()
    expect(getValidSubdomain('localhost:3111')).toBeNull()
  })
})

describe('getValidSubdomain rejections', () => {
  it('returns nothing for an absent host', () => {
    expect(getValidSubdomain(null)).toBeNull()
    expect(getValidSubdomain(undefined)).toBeNull()
    expect(getValidSubdomain('')).toBeNull()
  })

  it('refuses reserved labels', () => {
    for (const reserved of ['www', 'api', 'app', 'admin', 'cdn']) {
      expect(getValidSubdomain(`${reserved}.myworldx.dev`, 'myworldx.dev'), reserved).toBeNull()
    }
  })

  it('refuses labels that cannot be a GitHub login', () => {
    expect(getValidSubdomain('-leading.myworldx.dev', 'myworldx.dev')).toBeNull()
    expect(getValidSubdomain('trailing-.myworldx.dev', 'myworldx.dev')).toBeNull()
    expect(getValidSubdomain('has_underscore.myworldx.dev', 'myworldx.dev')).toBeNull()
    expect(getValidSubdomain(`${'a'.repeat(40)}.myworldx.dev`, 'myworldx.dev')).toBeNull()
  })

  it('accepts the shapes GitHub logins actually take', () => {
    expect(getValidSubdomain('a.myworldx.dev', 'myworldx.dev')).toBe('a')
    expect(getValidSubdomain('rafer-dev.myworldx.dev', 'myworldx.dev')).toBe('rafer-dev')
    expect(getValidSubdomain('user123.myworldx.dev', 'myworldx.dev')).toBe('user123')
  })
})

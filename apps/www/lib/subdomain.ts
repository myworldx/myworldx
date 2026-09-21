const RESERVED = new Set(['www', 'api', 'app', 'admin', 'static', 'assets', 'cdn', 'mail'])

export function getValidSubdomain(host: string | null | undefined, rootDomain?: string): string | null {
  if (!host) return null

  const hostname = host.split(':')[0]?.toLowerCase()
  if (!hostname) return null

  const root = rootDomain?.split(':')[0]?.toLowerCase()

  if (root) {
    if (hostname === root) return null
    if (!hostname.endsWith(`.${root}`)) return null

    const candidate = hostname.slice(0, -(root.length + 1))
    return accept(candidate)
  }

  const labels = hostname.split('.')
  if (labels.length < 3) return null

  return accept(labels[0])
}

function accept(candidate: string | undefined): string | null {
  if (!candidate) return null
  if (candidate.includes('.')) return null
  if (RESERVED.has(candidate)) return null
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/.test(candidate)) return null

  return candidate
}

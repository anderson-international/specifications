export function fromSameRouteReferrer(prefix: string): boolean {
  if (typeof window === 'undefined') return false
  const r = document.referrer
  if (!r) return false
  const origin = window.location.origin
  return r.startsWith(origin + prefix)
}

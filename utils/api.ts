/**
 * Resolves the backend API base URL safely.
 * Returns empty string for same-origin requests (e.g. on Vercel or local Express dev),
 * ensuring requests never get routed to dead preview branch URLs.
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim()) {
    // Guard against dead preview deployments
    if (envUrl.includes('wci-simbock-ew58')) {
      return '';
    }
    return envUrl.replace(/\/$/, '');
  }
  return '';
}

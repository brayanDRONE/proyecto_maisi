/**
 * In development: routes through the Vite /tworld-img proxy to avoid CORS.
 * In production: returns the original tworldstore.cl URL directly.
 * <img> tags don't require CORS headers, so direct URLs work fine in prod.
 */
export function twImg(url) {
  if (!url || typeof url !== 'string') return url
  if (import.meta.env.DEV) {
    return url.replace('https://tworldstore.cl', '/tworld-img')
  }
  return url
}

/**
 * Attempt to load a faster version (home_default) if available, fallback to original
 */
export function getImageWithFallback(url) {
  if (!url || typeof url !== 'string') return url
  const fastUrl = url.replace(/-large_default\//g, '-home_default/')
  return fastUrl === url ? url : fastUrl
}

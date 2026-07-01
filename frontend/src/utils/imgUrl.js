/**
 * Transforms a tworldstore.cl image URL to go through the local Vite proxy.
 * - Avoids hotlink/CORS blocks in development by routing through /tworld-img
 * - Keeps original URL structure (don't modify large_default/home_default)
 */
export function twImg(url) {
  if (!url || typeof url !== 'string') return url
  return url.replace('https://tworldstore.cl', '/tworld-img')
}

/**
 * Attempt to load a faster version (home_default) if available, fallback to original
 */
export function getImageWithFallback(url) {
  if (!url || typeof url !== 'string') return url
  const fastUrl = url.replace(/-large_default\//g, '-home_default/')
  return fastUrl === url ? url : fastUrl
}

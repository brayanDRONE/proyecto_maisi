module.exports = async function handler(req, res) {
  const pathParam = req.query.path
  const pathValue = Array.isArray(pathParam) ? pathParam.join('/') : pathParam

  if (!pathValue) {
    res.status(400).send('Missing image path')
    return
  }

  const targetUrl = new URL(`https://tworldstore.cl/${pathValue}`)

  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://tworldstore.cl/',
      'Origin': 'https://tworldstore.cl',
    },
  })

  if (!response.ok) {
    res.status(response.status).send(`Image proxy failed: ${response.status}`)
    return
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const cacheControl = response.headers.get('cache-control') || 'public, max-age=86400'

  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', cacheControl)

  const buffer = Buffer.from(await response.arrayBuffer())
  res.status(200).send(buffer)
}
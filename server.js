// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Simple CORS for the player
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // adjust for production
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/**
 * Usage:
 *  - Put the path part after /proxy/ and the proxy will forward to the same host.
 *  - Example for your URL:
 *      original: https://gg.poocloud.in/nba_minnesotatimberwolves/index.m3u8
 *      proxied request: http://localhost:3000/proxy/gg.poocloud.in/nba_minnesotatimberwolves/index.m3u8
 *
 * This approach preserves segments and relative URLs (manifest references).
 */
app.use('/proxy/:host/*', (req, res, next) => {
  const host = req.params.host; // like gg.poocloud.in
  // build target with host and the remainder of the path
  const rest = req.params[0] || '';
  const target = `${req.protocol}://${host}`;

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    selfHandleResponse: false,
    secure: false,
    pathRewrite: (path, req) => {
      // strip /proxy/<host> prefix — createProxyMiddleware will append `rest` automatically
      return `/${rest}`;
    },
    onProxyReq: (proxyReq, req, res) => {
      // Inject headers similar to your VLC options
      proxyReq.setHeader('Origin', 'https://embednow.top');
      proxyReq.setHeader('Referer', 'https://embednow.top/');
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0');
      // You can set other headers if needed:
      // proxyReq.setHeader('Accept', '*/*');
    },
    // optional: log proxy errors
    onError: (err, req, res) => {
      console.error('Proxy error', err);
      res.status(502).send('Bad gateway');
    },
  });

  proxy(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));

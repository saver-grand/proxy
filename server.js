// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Simple CORS for the player (restrict in production)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/**
 * Proxy usage:
 *  - GET /proxy/<host>/<path...>
 *  Example:
 *    /proxy/gg.poocloud.in/nba_minnesotatimberwolves/index.m3u8
 */
app.use('/proxy/:host/*', (req, res, next) => {
  const host = req.params.host;
  const rest = req.params[0] || '';
  const target = `https://${host}`;

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path, req) => {
      // remove /proxy/:host prefix; proxy middleware will append the right rest
      return `/${rest}`;
    },
    onProxyReq: (proxyReq, req, res) => {
      // Inject headers similar to your VLC options
      proxyReq.setHeader('Origin', 'https://embednow.top');
      proxyReq.setHeader('Referer', 'https://embednow.top/');
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0');

      // Optional: forward original range/accept headers
      const accept = req.headers['accept'];
      if (accept) proxyReq.setHeader('Accept', accept);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err && err.message);
      if (!res.headersSent) res.status(502).send('Bad gateway');
    },
  });

  return proxy(req, res, next);
});

// A small health route
app.get('/_health', (req, res) => res.send('ok'));

// Root message
app.get('/', (req, res) => {
  res.send('HLS proxy running. Use /proxy/<host>/<path>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

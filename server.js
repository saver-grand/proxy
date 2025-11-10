import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();
let proxyPool = [];

// 🌀 Auto-fetch free proxy IPs every hour
async function updateProxyList() {
  try {
    console.log("🔄 Updating proxy list...");
    const res = await fetch("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=2000&country=all");
    const text = await res.text();
    proxyPool = text
      .split("\n")
      .filter(Boolean)
      .map(ip => "http://" + ip.trim());
    console.log(`✅ Loaded ${proxyPool.length} proxies`);
  } catch (e) {
    console.error("❌ Failed to update proxy list:", e.message);
  }
}

// Load proxies on start and refresh hourly
updateProxyList();
setInterval(updateProxyList, 60 * 60 * 1000);

// Helper to pick a random proxy
function getRandomProxy() {
  if (proxyPool.length === 0) return null;
  const proxy = proxyPool[Math.floor(Math.random() * proxyPool.length)];
  console.log("🌐 Using proxy:", proxy);
  return proxy;
}

// ───────────────────────────────────────────────
// 🎯 Proxy endpoint
// Example: /proxy?url=https://example.com/playlist.m3u8
// ───────────────────────────────────────────────
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url=");

  try {
    const proxy = getRandomProxy();
    const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Origin": "https://test.renden.com",
      },
      agent,
    });

    if (!response.ok) {
      return res.status(response.status).send(`Upstream error (${response.status})`);
    }

    // Forward headers and stream response
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).send("Proxy error: " + err.message);
  }
});

// ───────────────────────────────────────────────
// 🔑 ClearKey DRM endpoint
// ───────────────────────────────────────────────
app.get("/clearkey", (req, res) => {
  const keyId = "31363231383438333031323033393138";
  const key = "38694e34324d543478316b7455753437";

  res.json({
    keys: [
      {
        kty: "oct",
        kid: Buffer.from(keyId, "hex").toString("base64"),
        k: Buffer.from(key, "hex").toString("base64"),
      },
    ],
    type: "temporary",
  });
});

// ───────────────────────────────────────────────
// 🖥️ Server start
// ───────────────────────────────────────────────
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`🚀 Proxy running on port ${port}`));

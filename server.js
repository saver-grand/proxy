import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();

// 🌀 Your proxy pool (rotate automatically)
const proxyPool = [
  "http://proxy1.example.com:8080",
  "http://proxy2.example.com:8080",
  "http://proxy3.example.com:8080"
];

function getRandomProxy() {
  return proxyPool[Math.floor(Math.random() * proxyPool.length)];
}

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
      agent
    });

    if (!response.ok) {
      return res.status(response.status).send("Upstream error");
    }

    // Pass headers & stream data
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

// ClearKey endpoint (optional)
app.get("/clearkey", (req, res) => {
  const keyId = "31363231383438333031323033393138";
  const key = "38694e34324d543478316b7455753437";
  res.json({
    keys: [{ kty: "oct", kid: Buffer.from(keyId, "hex").toString("base64"), k: Buffer.from(key, "hex").toString("base64") }],
    type: "temporary"
  });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));

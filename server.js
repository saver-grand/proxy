import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send("Missing ?url parameter");
  }

  try {
    // Ignore SSL errors for upstream
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const response = await fetch(target, {
      agent: httpsAgent,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Referer": "https://streamcenter.xyz/",
        "Origin": "https://streamcenter.xyz"
      }
    });

    // Copy content type
    res.set("Content-Type", response.headers.get("content-type"));

    // Stream the response to client
    response.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

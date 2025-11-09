import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url parameter");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Origin": "https://streamcenter.pro",
        "Referer": "https://streamcenter.pro/"
      }
    });

    // Pass through headers and CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");

    const body = await response.arrayBuffer();
    res.send(Buffer.from(body));
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

app.listen(10000, () => console.log("Proxy server running on port 10000"));

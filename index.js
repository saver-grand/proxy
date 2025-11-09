import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url parameter");

  try {
    const response = await fetch(url, {
      headers: {
        "Host": "edge2caster.pro",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Accept": "*/*",
        "Accept-Language": "en-US",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Origin": "https://streamcenter.pro",
        "Connection": "keep-alive",
        "Referer": "https://streamcenter.pro/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", contentType);

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy fetch failed");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Proxy running on port " + PORT));

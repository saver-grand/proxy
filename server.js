import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const STREAM_MAP = {
  "1093": "http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "1286": "http://143.44.136.67:6060/001/2/ch00000090990000001286/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
};

// Proxy helper
async function passthrough(req, res, url) {
  try {
    const response = await fetch(url);

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Forward status
    res.status(response.status);

    // Pipe the response directly (lossless)
    response.body.pipe(res);

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Proxy error");
  }
}

// MPD manifest
app.get("/:id/manifest.mpd", async (req, res) => {
  const id = req.params.id;
  const base = STREAM_MAP[id];

  if (!base) return res.status(404).send("Stream not found");

  const mpdUrl = base + "manifest.mpd"
    + "?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1";

  return passthrough(req, res, mpdUrl);
});

// Segments and init files
app.get("/:id/:segment", async (req, res) => {
  const id = req.params.id;
  const segment = req.params.segment;
  const base = STREAM_MAP[id];

  if (!base) return res.status(404).send("Stream not found");

  const segmentUrl = base + segment;

  return passthrough(req, res, segmentUrl);
});

app.listen(PORT, () => {
  console.log(`Widevine MPD proxy running on port ${PORT}`);
});

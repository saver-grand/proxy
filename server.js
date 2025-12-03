import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Mapping IDs → source MPD URLs
const STREAM_MAP = {
  "1093": "http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "1286": "http://143.44.136.67:6060/001/2/ch00000090990000001286/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
};

// Generic fetch passthrough
async function proxy(req, res, targetUrl) {
    try {
        const response = await fetch(targetUrl);
        res.status(response.status);

        // Copy headers
        response.headers.forEach((v, k) => res.setHeader(k, v));

        // Stream response body
        response.body.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Proxy Error");
    }
}

// MPD Manifest
app.get("/:id/manifest.mpd", async (req, res) => {
    const id = req.params.id;
    const source = STREAM_MAP[id];

    if (!source) return res.status(404).send("Stream Not Found");

    return proxy(req, res, source);
});

// Segment passthrough (*.m4s, *.mp4, *.init)
app.get("/:id/:segment", async (req, res) => {
    const id = req.params.id;
    const segment = req.params.segment;
    const base = STREAM_MAP[id];

    if (!base) return res.status(404).send("Stream Not Found");

    const sourceBase = base.split("manifest.mpd")[0]; // base path of segments
    const targetUrl = sourceBase + segment;

    return proxy(req, res, targetUrl);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

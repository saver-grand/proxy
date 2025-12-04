import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

const MAP = {
  "1093": "http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "1143": "http://143.44.136.67:6060/001/2/ch00000090990000001143/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "1090": "http://143.44.136.67:6060/001/2/ch00000090990000001090/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "1286": "http://143.44.136.67:6060/001/2/ch00000090990000001286/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1",
  "gma": "http://vstream.vip:2889/live/Demostream/Demostream/2079.ts%7CUser-Agent=RM%20STREAM"  
};

// When someone opens your shortcut
app.get("/:id/manifest.mpd", (req, res) => {
  const id = req.params.id;
  const url = MAP[id];
  if (!url) return res.status(404).send("Unknown ID");

  // 302 redirect to real MPD
  return res.redirect(302, url);
});

app.listen(PORT, () => console.log(`Shortcut MPD server running on ${PORT}`));

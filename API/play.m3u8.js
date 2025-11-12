export default function handler(req, res) {
  const { id } = req.query;

  const streamMap = {
    "287": "https://example.com/streams/287/playlist.m3u8",
    "288": "https://example.com/streams/288/playlist.m3u8",
  };

  const streamUrl = streamMap[id];

  if (!streamUrl) {
    res.status(404).send("Stream not found");
    return;
  }

  const m3u8Content = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
${streamUrl}
#EXT-X-ENDLIST`;

  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  res.status(200).send(m3u8Content);
}

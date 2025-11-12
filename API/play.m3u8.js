export default function handler(req, res) {
  const { id } = req.query;

  const streamMap = {
    "1": "https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1762968330/ei/qm4UaamqIN-J1d8PtcLYmQ8/ip/112.205.151.42/id/wu6k4ejxPy8.1/source/yt_live_broadcast/requiressl/yes/xpc/EgVo2aDSNQ%3D%3D/hfr/1/playlist_duration/30/manifest_duration/30/maudio/1/bui/AdEuB5ROBgtgqYB6_aOMF0hTj7dE8rvJSbOqi-t55cmaSb00yk9MKnUGreSHdoUy7YBGGT9xw8RGBkW3/spc/6b0G_IygqFL3r6WP96abUflnE_Zt4ZIW9oyj0TLgccnxFB0jUDOszdZ1Tx0uJFu0qTDGckATiOkuLA/vprv/1/go/1/rqh/5/pacing/0/nvgoi/1/ncsapi/1/keepalive/yes/fexp/51331020%2C51552689%2C51565115%2C51565682%2C51580968/dover/11/itag/0/playlist_type/DVR/sparams/expire%2Cei%2Cip%2Cid%2Csource%2Crequiressl%2Cxpc%2Chfr%2Cplaylist_duration%2Cmanifest_duration%2Cmaudio%2Cbui%2Cspc%2Cvprv%2Cgo%2Crqh%2Citag%2Cplaylist_type/sig/AJfQdSswRQIhAPYT2gplK2_Lr4AcQK4XoNlcRQ5jrMvVWRO4s5qbFs5_AiB6-BuISAhTViFek6KP5qL_xzTr8Rom3b6KPWNEREU6QA%3D%3D/file/index.m3u8",
    "2": "https://shorten.is/Gmaa",
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

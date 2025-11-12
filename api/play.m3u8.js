export default function handler(req, res) {
  const { id } = req.query;

  const streamMap = {
    "1": "https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1762983353/ei/WKkUab7GO7mC2roPj4zn2AE/ip/112.204.105.8/id/-Jg36u4JSFw.1/source/yt_live_broadcast/requiressl/yes/xpc/EgVo2aDSNQ%3D%3D/tx/51660875/txs/51660875%2C51660876%2C51660877%2C51660878%2C51660879%2C51660880%2C51660881/hfr/1/ctier/SPL/playlist_duration/30/manifest_duration/30/maudio/1/gcr/ph/bui/AdEuB5RLn-ovZXERi4avtZNZXLM8rPPra4Ow3QerZDKECN9pwynVdnzX_vBNYrFxr0mzm9iOcaEKhj1Y/spc/6b0G_ENt_-ez5Hld-DeE39BCnwLVSUydQEmQGC1-XIAe08LQ5Rikp52af6CwSaCEC2RE3ovuOIibkQ/vprv/1/go/1/rqh/5/pacing/0/nvgoi/1/ncsapi/1/keepalive/yes/fexp/51331020%2C51552689%2C51565116%2C51565682%2C51580968/dover/11/itag/0/playlist_type/DVR/sparams/expire%2Cei%2Cip%2Cid%2Csource%2Crequiressl%2Cxpc%2Ctx%2Ctxs%2Chfr%2Cctier%2Cplaylist_duration%2Cmanifest_duration%2Cmaudio%2Cgcr%2Cbui%2Cspc%2Cvprv%2Cgo%2Crqh%2Citag%2Cplaylist_type/sig/AJfQdSswRQIhAOPTl4TCBRvK3x_oLC6IRqipjK0aHQY8kU0RWq4XZvkkAiBFLE6aBmPTHKvyN81qrSGsc5u6y84F0voCKUj7rECipg%3D%3D/file/index.m3u8",
    "2": "https://manifest.googlevideo.com/api/manifest/hls_playlist/expire/1762983353/ei/WKkUab7GO7mC2roPj4zn2AE/ip/112.204.105.8/id/-Jg36u4JSFw.1/itag/96/source/yt_live_broadcast/requiressl/yes/ratebypass/yes/live/1/sgoap/gir%3Dyes%3Bitag%3D140/sgovp/gir%3Dyes%3Bitag%3D137/rqh/1/hls_chunk_host/rr5---sn-2aqu-hoals.googlevideo.com/xpc/EgVo2aDSNQ%3D%3D/ctier/SPL/playlist_duration/30/manifest_duration/30/gcr/ph/bui/AdEuB5RLn-ovZXERi4avtZNZXLM8rPPra4Ow3QerZDKECN9pwynVdnzX_vBNYrFxr0mzm9iOcaEKhj1Y/spc/6b0G_ENt_-ez5Hld-DeE39BCnwLVSUydQEmQGC1-XIAe08LQ5Rikp52af6CwSaCEC2RE3ovuOIibkQ/vprv/1/playlist_type/DVR/cps/518/initcwndbps/1626250/met/1762961876,/mh/DI/mip/112.205.151.42/mm/44/mn/sn-2aqu-hoals/ms/lva/mv/m/mvi/5/pl/25/rms/lva,lva/dover/11/pacing/0/keepalive/yes/fexp/51331020,51552689,51565116,51565682,51580968/mt/1762961788/sparams/expire,ei,ip,id,itag,source,requiressl,ratebypass,live,sgoap,sgovp,rqh,xpc,ctier,playlist_duration,manifest_duration,gcr,bui,spc,vprv,playlist_type/sig/AJfQdSswRQIgMo8H8Yjvl4YwqoD7wdLqfdQhw9g8kpi8NCPYMLV3PPgCIQDF2RPI1uwpQz-i0DUY4rA88QNJnq-aznb8DSMQAsm1PA%3D%3D/lsparams/hls_chunk_host,cps,initcwndbps,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms/lsig/APaTxxMwRQIgNDUacmtwOlpa_A39F22K_51kL_qgX57ps5DH66keh9QCIQCr4-biL4DsQpRH9y3YUvQlZgp68dAG63FpekmpH8eeRw%3D%3D/playlist/index.m3u8",
  };

  const streamUrl = streamMap[id];

  if (!streamUrl) {
    res.status(404).send("Stream not found");
    return;
  }

  // Build proxy HLS playlist
  const m3u8Content = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
${streamUrl}
#EXT-X-ENDLIST`;

  // Set headers for universal playback
  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.status(200).send(m3u8Content);
}

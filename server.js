import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
const PORT = process.env.PORT || 10000;

// Proxy endpoint
app.get("/proxy", async (req, res) => {
    const target = req.query.url;
    if (!target) return res.status(400).send("Missing ?url parameter");

    try {
        // Ignore SSL verification if needed
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        // Fetch the upstream resource with your custom headers
        const response = await fetch(target, {
            agent: httpsAgent,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Referer": "https://streamcenter.xyz/",
                "Origin": "https://streamcenter.xyz",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Connection": "keep-alive"
            }
        });

        // Forward content-type from upstream
        res.set("Content-Type", response.headers.get("content-type"));

        // Stream response back to client
        response.body.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Proxy error: " + err.message);
    }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
